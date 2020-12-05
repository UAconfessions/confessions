import style from './navItem.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function NavItem({children, right, ...props}) {
	const { asPath } = useRouter();
	const classNameActiveOrNot =
		asPath === props.href || asPath === props.as // .as is for slugs
			? `${style.navItem} ${style.navItemActive}`.trim()
			: style.navItem

	const classNameRightOrNot =
		right ?
			`${classNameActiveOrNot} ${style.navItemRight}`.trim()
			: classNameActiveOrNot

	return (
		<Link {...props}>
			<div className={classNameRightOrNot}>
				{children}
			</div>
		</Link>
	);
}
