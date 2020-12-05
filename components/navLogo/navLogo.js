import { useRouter } from 'next/router';
import style from './navLogo.module.css';
import Link from "next/link";

export default function NavLogo({children, ...props}) {
	const { asPath } = useRouter();
	const className =
		asPath === props.href || asPath === props.as // .as is for slugs
			? `${style.navItem} ${style.navItemActive}`.trim()
			: style.navItem

	return (
		<Link {...props}>
			<span className={className}>
				{children}
			</span>
		</Link>
	);
}
