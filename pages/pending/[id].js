import style from '../../styles/Pending.module.css';
import { getQueuedConfession } from "../../utils/firebase/firebase";

export async function getServerSideProps({params}) {
	const confession = await getQueuedConfession(params.id);
	return { props: {  confession } };
}

export default function Confessions({confession}) {
	return (
		<div className={style.confession}>
			<div>{confession.value}</div>
		</div>
	);
}
