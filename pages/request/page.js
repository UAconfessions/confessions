import style from '../../styles/RequestAPage.module.css';
import Head from "../../components/head/head";
import Article from "../../components/article/Article";
import {useEffect, useState} from "react";

const TextScroller = ({ children, time }) => {
	const [index, setIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(
			() => setIndex(index => (index + 1) % children.length),
			time * 1000
		);

		return () => clearInterval(interval);
	}, []);

	const prevIndex = (index ? index : children.length) - 1;
	return (
		<span className={style.textScroller} style={{['--timing']: `${time}s`}}>
			<span key={index}>{children[index]}</span>
			<span key={prevIndex}>{children[prevIndex]}</span>
		</span>
	)
};

export default function RequestAPage() {

	const getTextScroller = () => (
		<TextScroller time={2}>
			<span>School</span>
			<span>University</span>
			<span>Organization</span>
			<span>Group</span>
			<span>Workplace</span>
			<span>Event</span>
			<span>Brand</span>
		</TextScroller>
	);

	return (
		<div className={style.container}>
			<Head title={'Request a page'} />
			<section>
				<h1>Confessions for your {getTextScroller()}</h1>
				<p>Do you want your own confessions platform? We can help you find the optimal solution for your needs</p>
				<Article
					footer={[
						<span>free</span>,
						<a>instructions</a>
					]}
				>
					<h2>Host it yourself</h2>
					<span>If you want to do your own thing, you can follow the setup instructions to host your own version.</span>
				</Article>

				<Article
					footer={[
						<span>€ 4,99 / month</span>,
						<a>more information</a>
					]}
				>
					<h2>Let's work together</h2>
					<span>We help you setup everything up and provide hosting, you are in charge of the data and administrative side.</span>
				</Article>

				<Article
					footer={[
						<span>€ 9,99 - € 99,99 / month</span>,
						<a>see plans</a>
					]}
				>
					<h2>Let us handle everything</h2>
					<span>We provide the fully managed solution for you.</span>
				</Article>

			</section>


		</div>
	);
}
