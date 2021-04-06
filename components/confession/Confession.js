import style from './Confession.module.css';
import Id from '../id/Id';

export default function Confession(props) {
	const toClipBoard = () => {
		const linkToCopy = props.queueId ? `pending/${props.queueId}` : `confessions/${props.id}`
		navigator.clipboard.writeText(`https://ua.confessions.link/${linkToCopy}`)
			.then(
				() => alert('Copied link.'),
				er => alert('Could not copy link.')
			);
	};
	return (
		<div className={style.confession}>
			<section>
				<Id {...props} />{props.value}
				{props?.url && (
					<img className={style.image} src={props?.url} />
				)}
			</section>
			<footer>
				{(props.queueId || props.id) && (
					<span onClick={toClipBoard}>copy link</span>
				)}
				{props.facebook_post_id && (
					<a href={`https://www.facebook.com/UAntwerpenConfessions/posts/${props.facebook_post_id?.split('_')[1]}`} target="_blank">
						show on facebook
					</a>
				)}
			</footer>
		</div>
	);
}

