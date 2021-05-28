import style from './Article.module.css';

export default function Article(props) {
	return (
		<article className={`${style.article} ${props.isStack ? style.stack : ''} ${props.sensitive ? style.sensitive : ''}`}>
			{props.header && (
				<header>
					{props.header}
				</header>
			)}
			<section>
				{props.children}
			</section>
			{props.footer && (
				<footer>
					{props.footer}
				</footer>
			)}
		</article>
	);
}

