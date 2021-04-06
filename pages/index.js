import { useState } from 'react';
import style from '../styles/Home.module.css';
import Icon from '../components/icon/icon';
import { dateStringToReadable } from '../utils/dateHelper';
import {useRouter} from "next/router";
import Head from "../components/head/head";

import {useUser} from "../utils/firebase/useUser";

export default function Home() {
	const router = useRouter();
	const { user } = useUser();
	const [confession, setConfession] = useState('');
	const [isFetching, setFetching] = useState(false);
	const [reactionId, setReactionId] = useState(null);
	const [reactingOn, setReactingOn] = useState({});
	const [inputVersion, setInputVersion] = useState(new Date());
	const [imageUploading, setImageUploading] = useState(false);
	const [image, setImage] = useState(null);
	const [filename, setFilename] = useState(null);

	const minimumLength = 10;

	const getConfessionForReaction = async (e) => {
		setFetching(true);
		try {
			setReactionId(e.target.value);
			setReactingOn({});
			if (e.target.value) {
				const data = await Api.reaction.get({urlData: {id: e.target.value}});
				setReactingOn(data);
			}
		}catch(e){
			console.error(e);
		}
		setFetching(false);
	}

	const submitConfession = async () => {
		setFetching(true);
		try {
			if (reactingOn.value) {
				const {id} = await postConfession({confession}, reactionId);
				await router.push(`pending/${id}`);
			} else {
				const {id} = await postConfession({confession, filename}, null, user);
				await router.push(`pending/${id}`);
			}
			setConfession('');
		}catch(e){
			console.error(e);
		}
		setFetching(false);
	};

	const toggleReaction = () => {
		if(reactionId === null){
			setReactionId('' );
		}else{
			setReactionId(null );
			setReactingOn({});
		}
	};

	const uploadImage = async ([file]) => {
		setImageUploading(true);
		setImage(URL.createObjectURL(file));
		try{
			const tmpFilename = encodeURIComponent(file.name);
			setFilename(file.name);
			const response = await fetch(`/api/upload?file=${tmpFilename}&type=pending`, {
				headers: new Headers({token: user.token}),
				credentials: 'same-origin',
			});
			if (!response.ok) throw await response.json();

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

			} else {
				alert('Upload failed.');
			}
		}catch(error){
			console.error(error);
		}


		setInputVersion(Date.now());
		setImageUploading(false);
	};

	return (
		<>
			<Head title={'Confess'} />
			<h1>The truth will set you free</h1>
			<div className={style.confession}>
				<div className={style.confessionData}>
					{reactionId !== null && (
						<>
							<label htmlFor={'reactionId'} className={style.label}>
								reageer op een confession:
								<span className={style.at}>
                                <input
	                                className={style.reactionId}
	                                type={'number'}
	                                id={'reactionId'}
	                                name={'reactionId'}
	                                placeholder={123456}
	                                value={reactionId}
	                                onChange={getConfessionForReaction}
                                />
                            </span>
							</label>
							{reactingOn.value && (
								<div className={style.reactingOn}>
                                <span className={style.reactingOnInfo}>
                                    {dateStringToReadable(reactingOn.posted)}
                                </span>
									<p>{reactingOn.value}</p>
								</div>
							)}
						</>
					)}

					<textarea
						className={style.confessionField}
						onChange={e => setConfession(e.target.value)}
						placeholder={'Jouw anonieme confession hier ...'}
						value={confession}
					/>
				</div>
				<div className={style.confessActions}>
					{confession.length < minimumLength && (<span>- {minimumLength - confession.length}</span>)}
					{user?.token && (
						<div className={style.action}>
							<input
								type={'file'}
							       className={style.imageUpload}
							       disabled={imageUploading}
							       id={'upload-image'}
							       onChange={(e) => uploadImage(e.target.files)}
							       key={inputVersion}
							       accept="image/png, image/jpeg"
							/>
							<Icon.SetImage />
						</div>
					)}
					{/*<button*/}
					{/*	className={style.action}*/}
					{/*	onClick={toggleReaction}*/}
					{/*>@</button>*/}
					<button
						className={style.cta}
						onClick={submitConfession}
						disabled={isFetching || confession.length < minimumLength}
					>
						<div>
							<Icon.Send/>
							<Icon.Blocked loading={isFetching}/>
						</div>
					</button>
				</div>
			</div>
			<hr />
			{image && (
				<div className={style.imageDisplay}>
					<button onClick={() => setImage(null)}>remove</button>
					<br />
					<img src={image} alt={'user upload'} />
				</div>
			)}
		</>
	);
}

const postConfession = async (confession, id, user) => {
	const headers = {'Content-Type': 'application/json'};
	if(user?.token){
		headers.token = user.token;
	}

	return await fetch(`/api/confess${ id ? `/${id}` : '' }`, {
		method: 'POST',
		headers: new Headers(headers),
		credentials: 'same-origin',
		body: JSON.stringify(confession)
	}).then(res => res.json()).catch(e => console.error(e));
}
