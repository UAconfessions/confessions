import style from '../styles/Admin.module.css';
import Icon from '../components/icon/icon';
import useSWR, {mutate} from 'swr';
import fetcher from '../utils/api/fetcher';
import {useUser} from '../utils/firebase/useUser';
import {useState} from 'react';
import Head from "../components/head/head";

export default function Dashboard({}) {
	const { user } = useUser();
	const { data, error } = useSWR(user?.token ? ['api/admin/confession', user.token] : null, fetcher);
	const [fetching, setFetching] = useState(false);
	const actions = {
		reject: { ActionIcon: Icon.Reject, actionStyle: style.red},
		archive: { ActionIcon: Icon.Archive, actionStyle: style.action},
		accept: { ActionIcon: Icon.Accept, actionStyle: style.green},
	};

	const handleConfession = async (action) => {
		if(!data?.confession?.id) return alert('no confession is found');
		if(!user.token) return alert('no user token found');
		setFetching(true);
		await handle(data.confession.id, action, user.token);
		setFetching(false);
	};


	return (
		<>
			<Head title={'UA Admin'} />
			<h1>Dashboard {data?.amount ? (<span>[{data?.amount} pending]</span>) : null}</h1>
			{data?.confession && (
				<>
					<div className={style.confession}>
						{data?.confession.value}
					</div>
					<div className={style.actions}>
						{Object.entries(actions).map( ([action, {actionStyle, ActionIcon}]) => (
							<button key={action} disabled={fetching} className={actionStyle} onClick={() => handleConfession(action)}><ActionIcon /></button>
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
	);
}


const handle = async (id, action, token) => {
	await fetch(`/api/admin/confession/${id}/${action}`, {
		method: 'POST',
		headers: new Headers({'Content-Type': 'application/json', token}),
		credentials: 'same-origin',
	});
	await mutate(['api/admin/confession', token]);

}
