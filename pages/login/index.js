import FirebaseAuth from '../../components/firebaseAuth/firebaseAuth';
import { useState } from 'react';
import Button, { COLORS as BUTTON_COLORS, SIZES as BUTTON_SIZES } from '../../components/button/Button';
import { mutate } from 'swr';
import style from '../../styles/Login.module.css';
import Head from '../../components/head/head';
import { useAuth } from '../../utils/auth.context';

const Login = () => {
	const { user, logout } = useAuth();
	const [username, setUsername] = useState(null);
	const [changingUsername, setChangingUsername] = useState(false);
	// const [verificationUploading, setVerificationUploading] = useState(null);
	const [fetching, setFetching] = useState(false);
	// const [inputVersion, setInputVersion] = useState(Date.now());

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
		if (!username || username === '') return alert('cannot set username empty');
		setFetching(true);
		const response = await fetch(`/api/admin/user`, {
			method: 'POST',
			headers: new Headers({'Content-Type': 'application/json', token: user.token}),
			body: JSON.stringify({username}),
			credentials: 'same-origin',
		});
		setUsername(null);
		await mutate([`api/admin/user`, user.token]);
		setFetching(false);
	};

	const cancelChangeName = () => {
		setChangingUsername(false);
		setUsername(null);
	};

	const uploadVerification = async ([file]) => {
		setVerificationUploading(true);
		try{
			const filename = encodeURIComponent(file.name);
			const response = await fetch(`/api/upload?file=${filename}&type=verification`, {
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
		}catch(error){
			console.error(error);
		}

		setInputVersion(Date.now());
		setVerificationUploading(false);

	};

	return [
		<Head />,
		<div className={style.page}>
			<h1 className={style.greeting}>Hi {user.name ?? user.email}</h1>
			<section className={style.changeName}>
				{!changingUsername && (<Button size={BUTTON_SIZES.STRETCH} onClick={() => setChangingUsername(true)}>change username</Button>)}
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
							<input className={style.input} id={'change-name'} placeholder={' '} type={'text'} value={username ?? ''} onChange={(e) => setUsername(e.target.value)} />
							<label htmlFor={'change-name'} className={style.label}>Username</label>
						</div>
						<div className={style.actions}>
							<Button size={BUTTON_SIZES.SMALL} color={BUTTON_COLORS.DARKBLUE} disabled={fetching ? 'aan het doorsturen.' : (!username || username === '') ? 'Username cannot be empty' : false} onClick={saveName}>save</Button>
							<Button size={BUTTON_SIZES.SMALL} color={BUTTON_COLORS.DARKBLUE} disabled={fetching ? 'aan het doorsturen.' : false} onClick={cancelChangeName}>cancel</Button>
						</div>
					</div>
				)}
			</section>
			<section className={style.logout}>
				<Button size={BUTTON_SIZES.STRETCH} color={BUTTON_COLORS.RED} onClick={() => logout()}>
					Log out
				</Button>
			</section>
		</div>
	]
}

// <div className={style.card}>
// 	<div className={style.header}>
// 		<h3 className={style.title}>Verify your account</h3>
// 		<span>Upload a clear picture of your student card to verify your student account.</span>
// 	</div>
// 	<div className={style.fileInputWrapper} disabled={verificationUploading}>
// 		<label htmlFor={'verify-account'} className={style.fileField}>
// 			{!verificationUploading && ('drop your file here')}
// 			{verificationUploading && ('uploading...')}
// 			<input
// 				disabled={verificationUploading}
// 				className={style.fileInput}
// 				id={'verify-account'}
// 				type={'file'}
// 				onChange={(e) => uploadVerification(e.target.files)}
// 				key={inputVersion}
// 				accept="image/png, image/jpeg"
// 			/>
// 		</label>
// 	</div>
// </div>

export default Login
