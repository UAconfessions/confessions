import { useState } from 'react';
import Button, { COLORS, SIZES } from '../components/button/Button';
import style from '../styles/Home.module.css';
import Icon from '../components/icon/icon';
import { useRouter } from 'next/router';
import Head from '../components/head/head';

import Article from '../components/article/Article';
import Link from 'next/link';
import { useAuth } from '../utils/auth.context';
import { removeNullish } from '../utils/objectHelper';

export default function Home() {
	const router = useRouter();
	const { user } = useAuth();
	const [confession, setConfession] = useState('');
	const [isFetching, setFetching] = useState(false);
	// const [reactionId, setReactionId] = useState(null);
	// const [reactingOn, setReactingOn] = useState({});
	const [inputVersion, setInputVersion] = useState(new Date());
	const [imageUploading, setImageUploading] = useState(false);
	const [image, setImage] = useState(null);
	const [filename, setFilename] = useState(null);
	const [pollOptions, setPollOptions] = useState(undefined);
	const [pollFocus, setPollFocus] = useState(undefined);
	const minimumLength = 1;

	// const getConfessionForReaction = async (e) => {
	// 	setFetching(true);
	// 	try {
	// 		setReactionId(e.target.value);
	// 		setReactingOn({});
	// 		if (e.target.value) {
	// 			const data = await Api.reaction.get({urlData: {id: e.target.value}});
	// 			setReactingOn(data);
	// 		}
	// 	}catch(e){
	// 		console.error(e);
	// 	}
	// 	setFetching(false);
	// }

	const submitConfession = async () => {
		setFetching(true);
		const poll = pollOptions ? { options: Object.values(pollOptions)} : null;
		try {
			const { id } = await postConfession(removeNullish({confession, filename, poll}), /*reactionId,*/ user);
			await router.push(`pending/${id}`);
			setConfession('');
		}catch(e){
			console.error(e);
		}
		setFetching(false);
	};

	// const toggleReaction = () => {
	// 	if(reactionId === null){
	// 		setReactionId('' );
	// 	}else{
	// 		setReactionId(null );
	// 		setReactingOn({});
	// 	}
	// };


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

	const togglePoll = () => {
		setPollOptions(pollOptions => {
			if (!pollOptions) return { 0: '' }
			return undefined;
		});
	}

	const addPollOption = () => {
		setPollOptions(pollOptions => {
			const nextKey = Math.max(...[-1, ...Object.keys(pollOptions)].map(key => +key)) + 1;
			return { ...pollOptions, [nextKey]: '' };
		});
	}

	const removePollOption = key => {
		setPollOptions(pollOptions => (removeNullish({ ...pollOptions, [key]: undefined })));
	}

	const setPollOption = (key, value) => {
		setPollOptions(pollOptions => ({...pollOptions, [key]: value }))
	}

	const actions = {
		togglePoll: {ActionIcon: Icon.Poll, actionStyle: style.teal, action: togglePoll, hint: 'poll', disabled: isFetching },
		uploadImage: {ActionIcon: Icon.SetImage, actionStyle: style.blue, action: navigateToLogin, hint: 'Upload an Image', type: 'file', disabled: isFetching || imageUploading },
		post: {
			ActionIcon: isFetching ? Icon.Loading : Icon.Accept,
			actionStyle: style.green,
			action: submitConfession,
			hint: 'Submit your confessions',
			disabled:  isFetching || confession.length < minimumLength || imageUploading || (Object.values(pollOptions ?? {}).filter(option => (option.trim() !== '')).length === 1)
		},
	};

	// useEffect(() => {
	// 	if (confession.length > 0){
	// 		const hashtags = confession.split('#')
	// 		// spaces in between hashtags
	// 		// camelcase hashtags
	// 		// use a popular hashtag
	// 		// react to a post
	// 	}
	// }, [confession]);


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
	const emojis = ['👍', '❤️', '😂', '😮', '😢', '😡'];

	return (
		<>
			<Head title={'Confess'} />
			<section>
				<h1>The truth will set you free</h1>
				<Article
					footer={[
						<Link key={'faq'} href={'/help/FAQ'}>FAQ</Link>
					]}
				>
					<textarea
						className={style.confessionField}
						onChange={e => setConfession(e.target.value)}
						placeholder={'Jouw anonieme confession hier ...'}
						value={confession}
					/>
					{pollOptions && (
						<div className={style.poll}>
							{Object.entries(pollOptions).map(([key, value], index) => (
								<div key={key} className={value.trim() === '' ? style.pollOptionEmpty : style.pollOption}>
									<span className={style.pollOptionEmoji}>{emojis[index]}</span>
									<input
										className={style.pollOptionInput}
										type="text"
										value={value ?? ''}
										onChange={e => setPollOption(key, e.target.value)}
										onKeyDown={e => {
											switch (e.key) {
												case 'Enter': {
													if (Object.keys(pollOptions).length < 6)
														addPollOption()
													break;
												}
												case 'Backspace': {
													if (value === '') {
														if (Object.keys(pollOptions).length === 1) togglePoll();
														else {
															removePollOption(key);
															setPollFocus(index - 1);
														}
													}
													break;
												}
												default: break;
											}
										}}
										ref={ref => {
											if (pollFocus === index && ref) {
												ref?.focus();
												setPollFocus(undefined);
											}
										}}
										autoFocus
									/>
									<Button textOnly color={COLORS.RED} onClick={() => removePollOption(key)} size={SIZES.SMALL} >⨉</Button>
								</div>
							))}
							{Object.keys(pollOptions).length < 6 && (
								<Button color={COLORS.LIGHTBLUE} onClick={addPollOption} size={SIZES.STRETCH}>Add poll option</Button>
							)}
						</div>
					)}
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

const postConfession = async (confession, user) => {
	const headers = {
		'Content-Type': 'application/json',
		token: user?.token
	};

	return await fetch(`/api/confess`, {
		method: 'POST',
		headers: new Headers(removeNullish(headers)),
		credentials: 'same-origin',
		body: JSON.stringify(confession)
	}).then(res => res.json()).catch(e => console.error(e));
}
// const postConfession = async (confession, id, user) => {
// 	const headers = {
// 		'Content-Type': 'application/json',
// 		token: user?.token
// 	};
//
// 	return await fetch(`/api/confess${ id ? `/${id}` : '' }`, {
// 		method: 'POST',
// 		headers: new Headers(removeNullish(headers)),
// 		credentials: 'same-origin',
// 		body: JSON.stringify(confession)
// 	}).then(res => res.json()).catch(e => console.error(e));
// }
