import '../styles/globals.css';
import Nav from '../components/nav/nav';
import style from '../styles/App.module.css';
import NavItem from '../components/navItem/navItem';
import NavLogo from '../components/navLogo/navLogo';
import { useUser } from '../utils/firebase/useUser';

const pages = [
	{
		navItemProps: {
			key: 'submit',
			href: '/',
		},
		isActive: () => true,
		getTitle: () => 'Confess'
	},
	{
		navItemProps: {
			key: 'confessions',
			href: '/confessions',
		},
		isActive: () => true,
		getTitle: () => 'Confessions'
	},
	{
		navItemProps: {
			key: 'bin',
			href: '/confessions/bin',
		},
		isActive: () => true,
		getTitle: () => 'Unfiltered'
	},
	{
		navItemProps: {
			key: 'admin',
			href: '/admin',
		},
		isActive: ({user}) => user?.isAdmin,
		getTitle: () => 'Judge'
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
		}
	}
];

export default function MyApp({ Component, pageProps }) {
	const { user } = useUser();
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

			<section className={style.content}>
				<Component {...pageProps} />
			</section>
		</>
	);
}
