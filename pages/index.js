import {useEffect, useState} from 'react';
import style from '../styles/Home.module.css';
import Icon from '../components/icon/icon';
import {useRouter} from 'next/router';
import Head from '../components/head/head';

import Article from '../components/article/Article';
import Link from 'next/link';
import {useAuth} from '../utils/auth.context';

export default function Home() {
	const router = useRouter();
	const { user } = useAuth();
	const [confession, setConfession] = useState('');
	const [isFetching, setFetching] = useState(false);
	const [reactionId, setReactionId] = useState(null);
	const [reactingOn, setReactingOn] = useState({});
	const [inputVersion, setInputVersion] = useState(new Date());
	const [imageUploading, setImageUploading] = useState(false);
	const [image, setImage] = useState(null);
	const [filename, setFilename] = useState(null);
	const [triggerWarning, setTriggerWarning] = useState(null);
	const [help, setHelp] = useState(false);
	const [notes, setNotes] = useState([]);

	const minimumLength = 1;

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
			const { id } = await postConfession({confession, filename}, reactionId, user);
			await router.push(`pending/${id}`);
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

	const toggleTriggerWarning = () => {
		if (triggerWarning) return setTriggerWarning(null);
		setTriggerWarning(prompt('What about this confession could be a trigger?'));
	}

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

	const navigateToLogin = () => {
		router.push('/login')
	}

	const actions = {
		toggleHelp: {ActionIcon: Icon.Help, actionStyle: style.teal, action: () => setHelp(!help), hint: 'Toggle help url', disabled: isFetching },
		toggleTriggerWarning: {ActionIcon: Icon.Tag, actionStyle: style.pink, action: toggleTriggerWarning, hint: 'Toggle trigger warning', disabled: isFetching },
		uploadImage: {ActionIcon: Icon.SetImage, actionStyle: style.blue, action: navigateToLogin, hint: 'Upload an Image', type: 'file', disabled: isFetching || imageUploading },
		post: { ActionIcon: isFetching ? Icon.Loading : Icon.Accept, actionStyle: style.green, action: submitConfession, hint: 'Submit your confessions', disabled:  isFetching || confession.length < minimumLength || imageUploading},
	}

	const header = [];
	if(triggerWarning) header.push(<span key={'trigger warning'}>TRIGGER WARNING: {triggerWarning}</span>);
	if(help) header.push(<Link key={'mental help'} href="/help">Hulp nodig?</Link>);

	useEffect(() => {
		if (confession.length > 0){
			const hashtags = confession.split('#')
			// spaces in between hashtags
			// camelcase hashtags
			// use a popular hashtag
			// react to a post
		}
	}, [confession]);

	const renderActions = () => (
		<div className={style.actions}>
			{Object.entries(actions).map( ([name, { actionStyle, ActionIcon, action, hint, type, disabled }]) => {
				if (type === 'file' && user?.token) {
					if (!image){
						return (
							<button
								className={actionStyle}
								title={hint}
								key={name}
								disabled={disabled}
							>
								<input
									type={'file'}
									className={style.imageUpload}
									disabled={disabled}
									id={'upload-image'}
									onChange={(e) => uploadImage(e.target.files)}
									key={inputVersion}
									accept="image/png, image/jpeg"
								/>
								<ActionIcon />
							</button>
						)
					}
					return (
						<button
							className={actionStyle}
							title={hint}
							onClick={()=>setImage(null)}
							key={name}
							disabled={disabled}
						>
							<ActionIcon cancel />
						</button>
					);
				}
				return (
					<button
						title={hint}
						key={name}
						disabled={disabled}
						className={actionStyle}
						onClick={() => action()}
					>
						<ActionIcon />
					</button>
				);
			})}
		</div>
	);

	return (
		<>
			<Head title={'Confess'} />
			<section>
				<h1>The truth will set you free</h1>
				<Article
					header={header.length > 0 && header }
					sensitive={help || triggerWarning}
					footer={[ // TODO: implement tips and FAQ
						<a key={'tips'}>Tips</a>,
						<a key={'FAQ'}>FAQ</a>
					]}
				>
					<textarea
						className={style.confessionField}
						onChange={e => setConfession(e.target.value)}
						placeholder={'Jouw anonieme confession hier ...'}
						value={confession}
					/>
					{image && (
						<img
							className={style.image}
							src={image}
							alt={'user upload'}
						/>
					)}
				</Article>
				{renderActions()}
			</section>
		</>
	);
}

const postConfession = async (confession, id, user) => {
	// TODO: save help and or triggerWarning
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
