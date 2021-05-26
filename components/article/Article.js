import style from './Article.module.css';

export default function Confession(props) {
	return (
		<article className={`${style.article} ${props.isStack ? style.stack : ''} ${props.sensitive ? style.sensitive : ''}`}>
			<section>
				{props.children}
			</section>
			<footer>
				{props.footer}
			</footer>
		</article>
	);
}

