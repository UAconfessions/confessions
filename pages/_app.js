import '../styles/globals.css';
import Nav from '../components/nav/nav';
import style from '../styles/App.module.css';
import NavItem from '../components/navItem/navItem';
import NavLogo from '../components/navLogo/navLogo';
import { useUser } from '../utils/firebase/useUser';
import {useRouter} from "next/router";

const pages = [
	{
		navItemProps: {
			key: 'submit',
			href: '/',
		},
		isActive: () => true,
		getTitle: () => 'Confess',
		className: style.submit
	},
	{
		navItemProps: {
			key: 'confessions',
			href: '/confessions',
		},
		isActive: () => true,
		getTitle: () => 'Confessions',
		className: style.confessions
	},
	{
		navItemProps: {
			key: 'bin',
			href: '/confessions/bin',
		},
		isActive: () => true,
		getTitle: () => 'Unfiltered',
		className: style.bin
	},
	{
		navItemProps: {
			key: 'help',
			href: '/help',
		},
		isActive: () => true,
		getTitle: () => 'Help',
		className: style.bin
	},
	{
		navItemProps: {
			key: 'wingit',
			href: '/wingit',
		},
		isActive: () => false,
		getTitle: () => 'Wing It',
		className: style.wingIt
	},
	{
		navItemProps: {
			key: 'polls',
			href: '/confessions/polls',
		},
		isActive: () => false,
		getTitle: () => 'Polls',
		className: style.polls
	},
	{
		navItemProps: {
			key: 'admin',
			href: '/admin',
		},
		isActive: ({user}) => user?.isAdmin,
		getTitle: () => 'Judge',
		className: style.admin
	},
	{
		navItemProps: {
			key: 'dashboard',
			href: '/admin/dashboard',
		},
		isActive: ({user}) => user?.isAdmin,
		getTitle: () => 'Dashboard',
		className: style.dashboard
	},
	{
		navItemProps: {
			key: 'login',
			href: '/login',
			right: true,
		},
		isActive: () => false,
		getTitle: ({user}) => {
			if (user?.id)
				return user.name ?? user.email;
			return 'Login'
		},
		className: style.login
	}
];

export default function MyApp({ Component, pageProps }) {
	const { user } = useUser();
	const { asPath } = useRouter();

	const activePage = pages.find(page => asPath === page.navItemProps.href);

	return (
		<>
			<Nav type={'icon links'}>
				<NavLogo href={'/'}><img className={style.logo} src="/images/logo.jpg" alt={'fluisterlogo UAntwerpen confessions'}/></NavLogo>
				{pages.map(({ navItemProps, isActive, getTitle }) => {
					if (isActive({user}))
						return (
							<NavItem
								{...navItemProps}
							>
								{getTitle({user})}
							</NavItem>
						)
				})}
			</Nav>

			<section className={`${style.content} ${activePage?.className ?? ''}`}>
				<Component {...pageProps} />
			</section>
		</>
	);
}
