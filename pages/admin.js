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
	const actions = {
		reject: { ActionIcon: Icon.Reject, actionStyle: style.red},
		archive: { ActionIcon: Icon.Archive, actionStyle: style.action},
		accept: { ActionIcon: Icon.Accept, actionStyle: style.green},
	};
	const archiveActions = {
		reject: { ActionIcon: Icon.Reject, actionStyle: style.red},
		accept: { ActionIcon: Icon.Accept, actionStyle: style.green},
	};

	const handleConfession = async (action, confession) => {
		if(!confession?.queueId) return alert('no confession is found');
		if(!user.token) return alert('no user token found');
		setFetching({...fetching, [confession.queueId]: true});
		await handle(confession.queueId, action, user.token);
		setFetching({...fetching, [confession.queueId]: false});
	};

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
						{data?.confession && (
							<>
								<Confession {...data.confession} />

								<div className={style.actions}>
									{Object.entries(actions).map( ([action, {actionStyle, ActionIcon}]) => (
										<button key={action} disabled={fetching[data.confession.queueId]} className={actionStyle} onClick={() => handleConfession(action, data.confession)}><ActionIcon /></button>
									))}
								</div>
							</>
						)}
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
				<>
					<h1>Archive</h1>
					<section>
						{archiveData.confessions.map(confession => (
							<div className={style.archivedConfession}>
								<Confession {...confession} />
								<div className={style.actions}>
									{Object.entries(archiveActions).map( ([action, {actionStyle, ActionIcon}]) => (
										<button key={action} disabled={fetching[confession.queueId]} className={actionStyle} onClick={() => handleConfession(action, confession)}><ActionIcon /></button>
									))}
								</div>
							</div>
						))}
					</section>
				</>
			)}

		</>
	);
}


const handle = async (id, action, token) => {
	await fetch(`/api/admin/confession/${id}/${action}`, {
		method: 'POST',
		headers: new Headers({'Content-Type': 'application/json', token}),
		credentials: 'same-origin',
	});
	await mutate(['api/admin/confession', token]);

	if (action === 'archive'){
		await mutate(['api/admin/archive', token]);
	}
}
