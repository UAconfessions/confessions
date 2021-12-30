import style from './Confession.module.css';
import Id from '../id/Id';
import Article from '../article/Article';
import {dateStringToReadable} from "../../utils/dateHelper";
import Link from 'next/link';
const USE_SHARE_API = false;

export default function Confession(props) {

	const toClipBoard = async () => {
		const linkToCopy = props.queueId ? `pending/${props.queueId}` : `confessions/${props.id}`;
		try {
			if (USE_SHARE_API && navigator.share){
				const res = await navigator.share?.({title: `#${props.id ?? ''} ${props.value}`, url: `https://ua.confessions.link/${linkToCopy}`})
				console.log(res);
			} else {
				navigator.clipboard.writeText(`https://ua.confessions.link/${linkToCopy}`)
					.then(
						() => alert('Copied link.'),
						er => alert('Could not copy link.')
					);
			}
		} catch (e) {
			console.error(e);
		}
	};
	const header = [];
	if(props.triggerWarning) header.push(<span key={'trigger warning'}>TRIGGER WARNING: {props.triggerWarning}</span>);
	if(props.help) header.push(<Link key={'mental help'} href="/help">Hulp nodig?</Link>);

	const renderContent = (string) => {
		if(!string) return;

		const makeUrlLinks = (string) => {
			const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
			const urls = string.match(urlRegex);
			if (!urls) return string;

			return urls.reduce((content, url) => {
				const [rest, ...start] = content.reverse();

				const [part1, ...part2] = rest.split(url);
				const reconstructedPart2 = part2.join(url);
				return [
					...start.reverse(),
					part1,
					// if no https:// -> add it.
					<a href={url} target="_blank" rel="noopener noreferrer" className={style.link} key={url}>
						{url}
					</a>,
					reconstructedPart2
				];
			}, [string]);
		}

		const makeHashTags = (jsx) => {
			if (!(typeof jsx === 'string')) {
				if (jsx.length) return jsx.map(makeHashTags);
				return jsx;
			}
			const hashtagRegex = /(?:^|[\s()])(?:#)([a-zA-ZÀ-ÖØ-öø-ɏ\d]+)(?=$|[\s?!\.,()]+)/g;
			const hashtags = [...jsx.matchAll(hashtagRegex)].map(match => match[1]);

			if (!hashtags) return jsx;

			return hashtags.reduce((content, hashtag) => {
				const [rest, ...start] = content.reverse();

				const [part1, ...part2] = rest.split(`#${hashtag}`);
				const reconstructedPart2 = part2.join(`#${hashtag}`);
				return [
					...start.reverse(),
					part1,
					<span className={style.hashtag} key={hashtag}>
						#{hashtag}
					</span>,
					reconstructedPart2
				];
			}, [jsx]);
		}
		return makeHashTags((makeUrlLinks(string)));

	};
	const date = (props.posted !== 'unknown data' && props.posted) || (props.submitted !== 'unknown data' && props.submitted);



	const renderPoll = poll => {
		if (!poll) return null;

		const emojis = ['👍', '❤️', '😂', '😮', '😢', '😡'];
		const reactions = poll.reduce((sum, { reaction, option }) => {
			if (!option || option.trim() === '') return sum;
			return sum + reaction
		}, 0);
		return (
			<div className={style.poll}>
				{poll.map(({option, reaction}, index) => {
					if (!option || option.trim() === '') return null;
					return (
						<div key={index} className={style.pollOption} style={{'--reactions': reaction / reactions}} title={`${reaction} / ${reactions}`}>
							<span className={style.pollOptionEmoji}>{emojis[index]}</span>
							<span>{option}</span>
						</div>
					);
				})}
			</div>
		);
	};

	const renderConfession = () => (
		<Article
			isStack={props.isStack}
			sensitive={props.help || props.triggerWarning}
			footer={
				<>
					{date && (
						<span className={style.submitted}>{dateStringToReadable(date)}</span>
					)}
					<span>
						{(props.queueId || props.id) && (
							<a onClick={toClipBoard}>share</a>
						)}
						{props.facebook_post_id && (
							<a href={`https://www.facebook.com/UAntwerpenConfessions/posts/${props.facebook_post_id?.split('_')[1]}`} target="_blank">
								facebook
							</a>
						)}
					</span>
				</>
			}
			header={header.length > 0 && header }
		>
			<Id {...props} />{renderContent(props.value)}
			{renderPoll(props.poll)}

			{props?.url && (
				<img className={style.image} src={props?.url} />
			)}
		</Article>
	);

	// if (props.parent) {
	// 	return (
	// 		<div>
	// 			<Confession {...props.parent} />
	// 			{renderConfession()}
	// 		</div>
	// 	)
	// }
	return renderConfession();

}

