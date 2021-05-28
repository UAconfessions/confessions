import '../styles/globals.css';
import Nav from '../components/nav/nav';
import style from '../styles/App.module.css';
import NavItem from '../components/nav/navItem/navItem';
import NavLogo from '../components/navLogo/navLogo';
import Footer from '../components/footer/Footer';
import { useUser } from '../utils/firebase/useUser';
import { useRouter } from "next/router";

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
	// {
	// 	navItemProps: {
	// 		key: 'dashboard',
	// 		href: '/admin/dashboard',
	// 	},
	// 	getTitle: () => 'Dashboard',
	// 	className: style.dashboard
	// },
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

			<div className={`${user?.isAdmin ? style.adminMain : style.main} ${activePage?.className ?? ''}`}>
				<section className={style.content}>
					<Component {...pageProps} />
				</section>
				<Footer />
			</div>
		</>
	);
}
