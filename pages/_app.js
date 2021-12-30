import '../styles/globals.css';
import Nav from '../components/nav/nav';
import style from '../styles/App.module.css';
import NavItem from '../components/nav/navItem/navItem';
import NavLogo from '../components/navLogo/navLogo';
import Footer from '../components/footer/Footer';
import { AuthProvider, useAuth } from '../utils/auth.context';
import { useEffect, useState } from 'react';

const pages = [
	{
		navItemProps: {
			key: 'submit',
			href: '/',
		},
		getTitle: () => 'Confess'
	},
	{
		navItemProps: {
			key: 'confessions',
			href: '/confessions',
		},
		getTitle: () => 'Confessions'
	},
	{
		navItemProps: {
			key: 'bin',
			href: '/confessions/bin',
		},
		getTitle: () => '#NoFilter',
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
		}
	}
];

const adminPages = [
	{
		navItemProps: {
			key: 'admin',
			href: '/admin',
		},
		getTitle: () => 'Judge'
	},
];

export default function MyApp({ Component, pageProps }) {
	return (
		<AuthProvider>
			<Main>
				<Component {...pageProps} />
			</Main>
		</AuthProvider>
	);
}

const Main = ({children}) => {
	const { user } = useAuth();
	const [mainClass, setMainClass] = useState(style.main)


	useEffect(() => {
		if (user?.isAdmin) return setMainClass(style.adminMain);
		setMainClass(style.main);
	}, [user]);

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

			<div className={mainClass}>
				<section className={style.content}>
					{children}
				</section>
				<Footer />
			</div>
		</>
	);
};

