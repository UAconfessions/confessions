import '../styles/globals.css';
import Nav from '../components/nav/nav';
import style from '../styles/App.module.css';
import NavItem from '../components/nav/navItem/navItem';
import NavLogo from '../components/navLogo/navLogo';
import { useUser } from '../utils/firebase/useUser';
import {useRouter} from "next/router";
import Icon from './../components/icon/icon';

const pages = [
	{
		navItemProps: {
			key: 'submit',
			href: '/',
		},
		getTitle: () => 'Confess',
		className: style.submit
	},
	{
		navItemProps: {
			key: 'confessions',
			href: '/confessions',
		},
		getTitle: () => 'Confessions',
		className: style.confessions
	},
	{
		navItemProps: {
			key: 'bin',
			href: '/confessions/bin',
		},
		getTitle: () => '#NoFilter',
		className: style.bin
	},
	// {
	// 	navItemProps: {
	// 		key: 'wingit',
	// 		href: '/wingit',
	// 	},
	// 	isActive: () => false,
	// 	getTitle: () => 'Wing It',
	// 	className: style.wingIt
	// },
	// {
	// 	navItemProps: {
	// 		key: 'polls',
	// 		href: '/confessions/polls',
	// 	},
	// 	isActive: () => false,
	// 	getTitle: () => 'Polls',
	// 	className: style.polls
	// },
	{
		navItemProps: {
			key: 'login',
			href: '/login',
			right: true,
		},
		getTitle: ({user}) => {
			if (user?.id) return 'Account';
			return 'Login'
		},
		className: style.login
	}
];

const adminPages = [
	{
		navItemProps: {
			key: 'admin',
			href: '/admin',
		},
		getTitle: () => 'Judge',
		className: style.admin
	},
	{
		navItemProps: {
			key: 'dashboard',
			href: '/admin/dashboard',
		},
		getTitle: () => 'Dashboard',
		className: style.dashboard
	},
];

export default function MyApp({ Component, pageProps }) {
	const { user } = useUser();
	const { asPath } = useRouter();

	const activePage = [...pages, ...adminPages].find(page => asPath === page.navItemProps.href);


	return (
		<>
			<Nav>
				<NavLogo href={'/'}><img className={style.logo} src="/images/logo.jpg" alt={'fluisterlogo UAntwerpen confessions'}/></NavLogo>
				{pages.map(({ navItemProps, getTitle }) => (
					<NavItem
						{...navItemProps}
					>
						{getTitle({user})}
					</NavItem>
				))}
				{user?.isAdmin && adminPages.map(({ navItemProps, getTitle }) => (
					<NavItem
						{...navItemProps}
					>
						{getTitle({user})}
					</NavItem>
				))}
			</Nav>

			<div className={`${user?.isAdmin ? style.adminContent : style.content} ${activePage?.className ?? ''}`}>
				<section>
					<Component {...pageProps} />
				</section>
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
						{/*<a>Products</a>*/}
						<a>advertisers</a>
						<a>buy us a coffee</a>
					</div>
				</section>
			</footer>
			</div>
		</>
	);
}
