import style from "../../styles/App.module.css";
import Icon from "../icon/icon";

export default function footer(){
	return (
		<footer className={style.footer}>
			<section>
				<h2>contact</h2>
				<div className={style.column}>
					<a href={'mailto:admin@confessions.link'}>admin@confessions.link</a>
					<a>request a page</a>
					<a>presskit</a>
					<a>request a feature</a>
				</div>
			</section>
			<section>
				<h2>legal</h2>
				<div className={style.column}>
					<a>Terms & Conditions</a>
					<a>Privacy policy</a>
					<a>Cookies</a>
				</div>
			</section>
			<section>
				<h2>support</h2>
				<div className={style.column}>
					<a>Getting started</a>
					<a>FAQ</a>
					<a>file a bug report</a>
					<a>changelist</a>
				</div>
			</section>
			<section>
				<h2>Follow us</h2>
				<div className={style.column}>
					<a>facebook</a>
					<a>snapchat</a>
					<a>instagram</a>
				</div>
				<div className={style.column}>
					<a>twitter</a>
					<a>rss</a>
					<a>email overview</a>
				</div>
				<span>
						<input placeholder={'test@email.be'} className={style.textInput} type={'email'}/>
						<button className={style.inputButton} onClick={() => alert('email')}>
							<Icon.Send />
						</button>
					</span>
			</section>
			<section>
				<h2>Support us</h2>
				<div className={style.column}>
					<a>Merch</a>
					<a>Products</a>
					<a>advertisers</a>
					<a>buy us a coffee</a>
				</div>
			</section>
		</footer>
	);
}
