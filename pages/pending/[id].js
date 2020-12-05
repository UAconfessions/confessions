import style from '../../styles/Pending.module.css';
import { getQueuedConfession } from "../../utils/firebase/firebase";

export async function getServerSideProps({params}) {
	const confession = await getQueuedConfession(params.id);
	return { props: {  confession } };
}

// TODO: search
// TODO: reacting
// TODO: hotlink (with media cover image)

export default function Confessions({confession}) {
	return (
		<div className={style.confession}>
			<div>{confession.value}</div>
		</div>
	);
}
