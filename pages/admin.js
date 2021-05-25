import style from '../styles/Admin.module.css';
import Icon from '../components/icon/icon';
import useSWR, {mutate} from 'swr';
import fetcher from '../utils/api/fetcher';
import {useUser} from '../utils/firebase/useUser';
import {useState} from 'react';
import Head from "../components/head/head";
import Confession from "../components/confession/Confession";

export default function Dashboard({}) {
	const { user } = useUser();
	const { data: archiveData, error: archiveError } = useSWR(user?.token ? ['api/admin/archive', user.token] : null, fetcher);
	const { data, error } = useSWR(user?.token ? ['api/admin/confession', user.token] : null, fetcher);
	const [fetching, setFetching] = useState({});
	const [archiveIndex, setArchiveIndex] = useState(0);
	const [stacked, setStacked] = useState({queue: true, archive: true});

	const actions = {
		queue: {
			stack: {
				reject: { ActionIcon: Icon.Reject, actionStyle: style.red, handle: true},
				archive: { ActionIcon: Icon.Archive, actionStyle: style.blue, handle: true},
				toggleTriggerWarning: {ActionIcon: Icon.Tag, actionStyle: style.pink, handle: false, active: false},
        		accept: { ActionIcon: Icon.Accept, actionStyle: style.green, handle: true},
			}
		},
		archive: {
			stack: {
				reject: { ActionIcon: Icon.Reject, actionStyle: style.red, handle: true},
				archive: { ActionIcon: Icon.Archive, actionStyle: style.blue, handle: true},
				toggleTriggerWarning: {ActionIcon: Icon.Tag, actionStyle: style.pink, handle: false},
        		accept: { ActionIcon: Icon.Accept, actionStyle: style.green, handle: true},
			},
			list: {
				reject: { ActionIcon: Icon.Reject, actionStyle: style.red, handle: true},
				toggleTriggerWarning: {ActionIcon: Icon.Tag, actionStyle: style.pink, handle: false},
        		accept: { ActionIcon: Icon.Accept, actionStyle: style.green, handle: true},
			}
		}
	}

	function toggleTriggerWarning(confession) {
        if (confession.triggerWarning) {
            confession.triggerWarning = '';
        } else {
            confession.triggerWarning = prompt('What about this confession could be a trigger?', 'verkrachting');
        }

    }

	const handleConfession = async (action, confession, stack, isHandle) => {
		if (stack === 'archive'){
			if (action === 'archive') return setArchiveIndex((archiveIndex + 1) % archiveData.confessions.length);
			setArchiveIndex((archiveIndex + 1) % (archiveData.confessions.length - 1));
		}
		if (!confession?.queueId) return alert('no confession is found');
		if (!user.token) return alert('no user token found');
		setFetching({...fetching, [confession.queueId]: true});

		if (action === 'toggleTriggerWarning') {
            toggleTriggerWarning(confession);
        }

        if (isHandle) {
            await handle(confession.queueId, action, user.token, confession.triggerWarning);

            // update confessions after handle
            if (action === 'archive') {
                await mutate(['api/admin/confession', user.token]);
                await mutate(['api/admin/archive', user.token]);
            } else if (stack === 'queue') {
                await mutate(['api/admin/confession', user.token]);
            } else {
                await mutate(['api/admin/archive', user.token]);
            }
        }

        setFetching({...fetching, [confession.queueId]: false});

    };

	const renderCard = (confession, src, isStack) => {
		const cardActions = actions[src][stacked[src] ? 'stack' : 'list'];
		const renderContent = () => (
			<>
				<Confession {...confession} isStack={!!isStack} />
				<div className={style.actions}>
					{Object.entries(cardActions).map( ([action, {actionStyle, ActionIcon, handle}]) => (
						<button key={action} disabled={fetching[confession.queueId]} className={actionStyle} onClick={() => handleConfession(action, confession, src, handle)}><ActionIcon /></button>
					))}
				</div>
			</>

		);

		return isStack
			?
				renderContent()
			:
				<div className={style.archivedConfession}>
					{renderContent()}
				</div>
		;
	}

	return (
		<>
			<Head title={'UA Admin'} />

			<section className={style.queue}>
				{error?.code === 404 && (
					<h1>No pending confessions</h1>
				)}
				{error?.code !== 404 && (
					<>
						<h1>{data?.amount ?? '-'} pending</h1>
						{data?.confession && renderCard(data.confession, 'queue', data?.amount > 1)}
						{error && (
							<div>
								<span>An error occurred, try reloading this page.</span>
								{JSON.stringify(error)}
							</div>
						)}
					</>
				)}
			</section>
			{archiveData?.confessions?.length > 0 && (
				<section>
					<h1 onClick={() => setStacked({ ...stacked, archive: !stacked.archive })}>
						<span>{archiveData.confessions.length} Archived</span>
						{archiveData.confessions.length > 1 && (!stacked.archive ? (<Icon.Angle.Down />) : (<Icon.Angle.Right />)) }
					</h1>
					{!stacked.archive
						? archiveData.confessions.map(confession => renderCard(confession, 'archive'))
						: renderCard(archiveData.confessions[archiveIndex], 'archive', archiveData.confessions.length > 1)
					}
				</section>
			)}
		</>
	);
}


const handle = async (id, action, token, triggerWarning) => {
    await fetch(`/api/admin/confession/${id}/${action}${triggerWarning ? `?triggerWarning=${triggerWarning}` : ''}`, {
        method: 'POST',
        headers: new Headers({'Content-Type': 'application/json', token}),
        credentials: 'same-origin',
    });
}
