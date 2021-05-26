import style from '../../styles/Pending.module.css';
import { getQueuedConfession } from "../../utils/firebase/firebase";
import Confession from '../../components/confession/Confession';
import Head from "../../components/head/head";

export async function getServerSideProps({params}) {
	const confession = await getQueuedConfession(params.id);
	return { props: {  confession, queueId: params.id } };
}
// handle confession no longer pending
export default function Pending({confession, queueId }) {
	return (
		<div>
			<Head title={'Pending Confession'} />
			<Confession {...confession} queueId={queueId} />
		</div>
	);
}
