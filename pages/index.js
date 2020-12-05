import { useState } from 'react';
import style from '../styles/Home.module.css';
import Icon from '../components/icon/icon';
import { dateStringToReadable } from '../utils/dateHelper';
import {useRouter} from "next/router";


export default function Home() {
	const router = useRouter()
	const [confession, setConfession] = useState('');
	const [isFetching, setFetching] = useState(false);
	const [reactionId, setReactionId] = useState(null);
	const [reactingOn, setReactingOn] = useState({});
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
				const {id} = await postConfession({confession});
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

	return (
		<>
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
		</>
	);
}

const postConfession = async (confession, id) => {
	return await fetch(`/api/confess${ id ? `/${id}` : '' }`, {
		method: 'POST',
		headers: new Headers({'Content-Type': 'application/json'}),
		body: JSON.stringify(confession)
	}).then(res => res.json()).catch(e => console.error(e));
}
