import { useUser } from '../utils/firebase/useUser'
import FirebaseAuth from "../components/firebaseAuth/firebaseAuth";
import {useState} from "react";
import {mutate} from "swr";
import style from "../styles/Login.module.css";
import Head from "../components/head/head";

const Login = () => {
	const { user, logout } = useUser()
	const [username, setUsername] = useState(null);
	const [changingUsername, setChangingUsername] = useState(false);
	const [verificationUploading, setVerificationUploading] = useState(null);
	const [fetching, setFetching] = useState(false);
	const [inputVersion, setInputVersion] = useState(Date.now());

	if (!user?.id) {
		return (
			<>
				<h1 className={style.greeting}>Welcome!</h1>
				<h3 className={style.greeting}>Login or create an account.</h3>
				<FirebaseAuth />
			</>
		);
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
	};

	const uploadVerification = async ([file]) => {
		setVerificationUploading(true);

		const filename = encodeURIComponent(file.name);
		const response = await fetch(`/api/upload?file=${filename}`, {
			headers: new Headers({token: user.token}),
			credentials: 'same-origin',
		});
		const { url, fields } = await response.json();
		const formData = new FormData();

		Object.entries({ ...fields, file }).forEach(([key, value]) => {
			formData.append(key, value);
		});

		const upload = await fetch(url, {
			method: 'POST',
			body: formData,
		});

		if (upload.ok) {
			console.log('Uploaded successfully!');
		} else {
			console.error('Upload failed.');
		}

		setInputVersion(Date.now());
		setVerificationUploading(false);

	};

	return (
		<div>
			<Head />
			<div>
				<h1 className={style.greeting}>Hi {user.name ?? user.email}</h1>
				{!changingUsername && (<button className={style.smallButton} onClick={() => setChangingUsername(true)}>change username</button>)}
				{changingUsername && (
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
							<label htmlFor={'change-name'} className={style.label}>Username</label>
						</div>
						<button className={style.button} disabled={fetching} onClick={() => saveName()}>save</button>
						<button className={style.button} onClick={() => {setChangingUsername(false); setUsername(null);}}>cancel</button>
					</div>
				)}

				<div className={style.card}>
					<div className={style.header}>
						<h3 className={style.title}>Verify your account</h3>
						<span>Upload a clear picture of your student card to verify your student account.</span>
					</div>
					<div className={style.fileInputWrapper} disabled={verificationUploading}>
						<label htmlFor={'verify-account'} className={style.fileField}>
							{!verificationUploading && ('drop your file here')}
							{verificationUploading && ('uploading...')}
							<input
								disabled={verificationUploading}
								className={style.fileInput}
								id={'verify-account'}
								type={'file'}
								onChange={(e) => uploadVerification(e.target.files)}
								key={inputVersion}
								accept="image/png, image/jpeg"
							/>
						</label>
					</div>
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
