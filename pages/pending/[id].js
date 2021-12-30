import { getQueuedConfession } from "../../utils/firebase/firebase";
import Confession from '../../components/confession/Confession';
import Head from "../../components/head/head";

export async function getServerSideProps({params}) {
	const confession = await getQueuedConfession(params.id);
	if (confession.id) {
		return {
			redirect: {
				destination: `/confessions/${confession.id}`,
				permanent: true
			}
		};
	}
	return { props: {  confession, queueId: params.id } };
}

export default function Pending({confession, queueId }) {
	return (
		<div>
			{confession.handled ? [
				<Head title={'Rejected Confession'} />,
				<h1>Rejected Confession</h1>
			] : [
				<Head title={'Pending Confession'} />,
				<h1>Pending Confession</h1>
			]}

			<Confession {...confession} queueId={queueId} />
		</div>
	);
}
