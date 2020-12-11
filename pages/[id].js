import style from '../styles/Confession.module.css';
import { getConfession } from "../utils/firebase/firebase";
import Confession from '../components/confession/Confession';

export async function getServerSideProps({params}) {
	const confession = await getConfession(params.id);
	return { props: {  confession } };
}

export default function Confession({confession}) {
	return (
		<div className={style.confession}>
		    <Confession {...confession} />
        </div>
	);
}
