import style from "../../styles/App.module.css";
import Link from 'next/link';

export default function footer(){

	return (
		<footer className={style.footer}>
			<section>
				<h2>Contact</h2>
				<div className={style.column}>
					<a target={'_blank'} href={'mailto:admin@confessions.link'}>admin@confessions.link</a>
					{/*<Link href={''}>request a page</Link>*/}
					{/*<a target={'_blank'} href={''}>presskit</a>*/}
					{/* download zip with press material, logo's, contact information, manifesto, brand colors, slogan */}
				</div>
			</section>
			{/*<section>*/}
			{/*	<h2>Legal</h2>*/}
			{/*	<div className={style.column}>*/}
			{/*		<Link href={''}>Terms & Conditions</Link>*/}
			{/*		<Link href={''}>Privacy policy</Link>*/}
			{/*		<Link href={''}>Cookies</Link>*/}
			{/*	</div>*/}
			{/*</section>*/}
			<section>
				<h2>Resources</h2>
				<div className={style.column}>
					<Link href={'/help/FAQ'}>FAQ</Link>
					<Link href={'/help'}>Looking for help?</Link>
					<Link href={'/changelog'}>Changelog</Link>
				</div>
			</section>
			<section>
				<h2>Follow us</h2>
				<div className={style.columns}>
					<div className={style.column}>
						<a target={'_blank'} href={'https://www.facebook.com/UAntwerpenConfessions'}>Facebook</a>
						<a target={'_blank'} href={'https://www.snapchat.com/add/ua_confessions'}>Snapchat</a>
						<a target={'_blank'} href={'https://www.instagram.com/uantwerpen_confessions/'}>Instagram</a>
					</div>
					<div className={style.column}>
						<a target={'_blank'} href={'https://twitter.com/UAntConfessions'}>Twitter</a>
						<Link href={'/rss'}>Rss</Link>
						{/*<Link href={''}>Email</Link>*/}
					</div>
				</div>
			</section>
			{/*<section>*/}
			{/*	<h2>Support us</h2>*/}
			{/*	<div className={style.column}>*/}
			{/*		<a target={'_blank'} href={'https://confessions.link'}>Store</a>*/}
			{/*		<Link href={''}>Advertisers</Link>*/}
			{/*		<Link href={''}>Sell your product</Link>*/}
			{/*	</div>*/}
			{/*</section>*/}
		</footer>
	);
}
