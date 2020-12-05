import { useUser } from '../utils/firebase/useUser'
import FirebaseAuth from "../components/firebaseAuth/firebaseAuth";
import {useState} from "react";
import {mutate} from "swr";
import style from "../styles/Login.module.css";

const Login = () => {
	const { user, logout } = useUser()
	const [username, setUsername] = useState(null);
	const [fetching, setFetching] = useState(false);
	if (!user?.id) {
		return (
			<>
				<p>Hi there!</p>
				<FirebaseAuth />
			</>
		)
	}

	const saveName = async () => {
		if(!username || username === '') return alert('cannot set username empty');
		setFetching(true);
		const response = await fetch(`/api/admin/user/${user.email}`, {
			method: 'POST',
			headers: new Headers({'Content-Type': 'application/json', token: user.token}),
			body: JSON.stringify({username}),
			credentials: 'same-origin',
		});
		setUsername(null);
		await mutate([`api/admin/user/${user.email}`, user.token]);
		setFetching(false);
	}

	return (
		<div>
			<div>
				<h1 className={style.greeting}>Hi {user.name ?? user.email}</h1>
				<div className={style.card}>
					<div className={style.header}>
						{!user.name && (
							<h3 className={style.title}>Choose a name</h3>
						) || (
							<h3  className={style.title}>Change your name</h3>
						)}
					</div>

					<div className={style.inputWrapper}>
						<input className={style.input} id={'change-name'} placeholder={' '} type={'text'} value={username ?? ''} onChange={(e) => setUsername(e.target.value) }/>
						<label for={'change-name'} className={style.label}>Username</label>
					</div>
					<button className={style.button} disabled={fetching} onClick={() => saveName()}>save</button>
				</div>
				<hr className={style.break}/>
				<button className={style.red} onClick={() => logout()}>
					Log out
				</button>
			</div>
		</div>
	)
}

export default Login
