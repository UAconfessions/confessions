import style from '../../styles/Admin.module.css';
import Icon from '../../components/icon/icon';
import useSWR, {mutate} from 'swr';
import fetcher from '../../utils/api/fetcher';
import { useState } from 'react';
import Head from '../../components/head/head';
import Confession from '../../components/confession/Confession';
import { removeEmpty } from '../../utils/objectHelper';
import {useAuth} from '../../utils/auth.context';

export default function Admin({}) {
	const { user } = useAuth();
	const { data: archiveData } = useSWR(user?.token ? ['api/admin/archive', user.token] : null, fetcher);
	const { data, error } = useSWR(user?.token ? ['api/admin/confession', user.token] : null, fetcher);
	const [addedData, setAddedData] = useState({});
	const [actionMenuOpen, setActionMenuOpen] = useState();
	const [archiveIndex, setArchiveIndex] = useState(0);
	const [stacked, setStacked] = useState({queue: true, archive: true});

	const addDataFor = (queueId, data) => {
		return setAddedData((addedData) => ({
			...addedData,
			[queueId]: {
				...(addedData[queueId] ?? {}),
				...data
			}
		}));
	}

	const toggleTriggerWarning = ({queueId}) => {
		if (addedData[queueId]?.triggerWarning) return addDataFor(queueId, { triggerWarning: undefined });

		const triggerWarning = prompt('What about this confession could be a trigger?', 'verkrachting');
		addDataFor(queueId, { triggerWarning });
	}

	const toggleHelp = ({queueId}) => {
		addDataFor(queueId, { help: !addedData[queueId]?.help });
	}

	const scrollArchive = (direction = 1) => {
		setArchiveIndex((archiveIndex + direction) % archiveData.confessions.length);
	};

	const initializeFetch = ({queueId}, stack) => {
		if (stack === 'archive') scrollArchive();
		if (!user.token) return alert('no user token found');
		addDataFor(queueId, { fetching: true });
	}

	const doFetch = async (queueId, action) => {
		await handle(queueId, action, user.token, addedData[queueId]?.triggerWarning, addedData[queueId]?.help);
	};

	const endFetch = async ({queueId}, stack) => {
		if (stack === 'queue') {
			await mutate(['api/admin/confession', user.token]);
		}
		if (stack === 'archive') {
			await mutate(['api/admin/archive', user.token]);
			scrollArchive(-1);
		}
		addDataFor(queueId, {fetching: false}); // TODO: show errors
	};


	const accept = async (confession, stack) => {
		initializeFetch(confession, stack);
		await doFetch(confession.queueId, 'accept');
		await endFetch(confession, stack);
	};

	const reject = async (confession, stack) => {
		initializeFetch(confession, stack);
		await doFetch(confession.queueId, 'reject');
		await endFetch(confession, stack);
	};

	const archive = async (confession) => {
		initializeFetch(confession, 'queue');
		await doFetch(confession.queueId, 'archive');
		await mutate(['api/admin/archive', user.token]);
		await endFetch(confession, 'queue');
	};



	const actions = {
		queue: {
			stack: {
				reject: { ActionIcon: Icon.Reject, actionStyle: style.red, action: confession => reject(confession, 'queue'), hint: 'Reject' },
				archive: { ActionIcon: Icon.Archive, actionStyle: style.blue, action: archive, hint: 'Move to waiting list' },
                accept: { ActionIcon: Icon.Accept, actionStyle: style.green, action: confession => accept(confession, 'queue'), hint: 'Post to facebook' },
                toggleActions: {ActionIcon : Icon.Angle.Right, actionStyle : style.pink, action: ({queueId}) => setActionMenuOpen(queueId), hint: 'Show extra actions' },
			}
		},
		archive: {
			stack: {
				reject: { ActionIcon: Icon.Reject, actionStyle: style.red, action: confession => reject(confession, 'archive'), hint: 'Reject' },
				archive: { ActionIcon: Icon.Archive, actionStyle: style.blue, action: () => scrollArchive(), hint: 'Move to back of stack' },
				accept: { ActionIcon: Icon.Accept, actionStyle: style.green, action: confession => accept(confession, 'archive'), hint: 'Post to facebook' },
                toggleActions: {ActionIcon : Icon.Angle.Right, actionStyle : style.pink, action: ({queueId}) => setActionMenuOpen(queueId), hint: 'Show extra actions' },
			},
			list: {
				reject: { ActionIcon: Icon.Reject, actionStyle: style.red, action: confession => reject(confession, 'archive'), hint: 'Reject' },
                accept: { ActionIcon: Icon.Accept, actionStyle: style.green, action: confession => accept(confession, 'archive'), hint: 'Post to facebook' },
                toggleActions: {ActionIcon : Icon.Angle.Right, actionStyle : style.pink, action: ({queueId}) => setActionMenuOpen(queueId), hint: 'Show extra actions' },
			}
		},
        extra: {
            toggleTriggerWarning: {ActionIcon: Icon.Tag, actionStyle: style.pink, action: toggleTriggerWarning, hint: 'Toggle trigger warning' },
            toggleHelp: {ActionIcon: Icon.Help, actionStyle: style.pink, action: toggleHelp, hint: 'toggle help url' },
            toggleActions: {ActionIcon : Icon.Angle.Left, actionStyle: style.pink, action: () => setActionMenuOpen(undefined), hint: 'Hide extra actions' },
        }
	}
	// TODO: change style of toggles depending on their current state

	const getCardActions = (confession, src) => {
		if (confession?.queueId === actionMenuOpen) {
			return actions['extra'];
		} else {
			return actions[src][stacked[src] ? 'stack' : 'list'];
		}
	};

	const renderCard = (confession, src, isStack) => {
		if (!confession) return null;
	    const cardActions = getCardActions(confession, src);
		const renderContent = () => (
			<>
				<Confession {...confession} isStack={!!isStack} {...addedData[confession.queueId]} />
				<div className={style.actions}>
					{Object.entries(cardActions).map( ([name, { actionStyle, ActionIcon, action, hint }]) => (
						<button title={hint} key={name} disabled={addedData[confession.queueId]?.fetching} className={actionStyle} onClick={() => action(confession)}><ActionIcon /></button>
					))}
				</div>
			</>

		);

		if (isStack) return renderContent();

		return (
			<div className={style.containedConfession}>
				{renderContent()}
			</div>
		);
	}

	return (
		<>
			<Head title={'UA Admin'} />

			<section className={style.queue}>
				{data?.amount === 0 && (
					<h1>No pending confessions</h1>
				)}
				{data?.amount !== 0 && (
					<>
						<h1>{data?.amount ?? '-'} Pending</h1>
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
						<span>{archiveData.confessions.length} Waiting</span>
						{archiveData.confessions.length > 1 && (!stacked.archive ? (<Icon.Angle.Down style={{verticalAlign: 'middle'}} />) : (<Icon.Angle.Right style={{verticalAlign: 'middle'}} />)) }
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

Admin.whyDidYouRender = true


const handle = async (id, action, token, triggerWarning, help) => {
	const endpoint = new URL(`api/admin/confession/${id}/${action}`, window.location);
	endpoint.search = new URLSearchParams(removeEmpty({ triggerWarning, help }));
    await fetch(endpoint, {
        method: 'POST',
        headers: new Headers({'Content-Type': 'application/json', token}),
        credentials: 'same-origin',
    });
}
