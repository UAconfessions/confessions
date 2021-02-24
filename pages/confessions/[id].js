import { getConfession } from "../../utils/firebase/firebase";
import Confession from '../../components/confession/Confession';
import Head from "../../components/head/head";

export async function getServerSideProps({params}) {
	const confession = await getConfession(params.id);
	return { props: {  confession } };
}
// TODO: custom OG image
export default function ConfessionById({confession}) {
	return (
		<div>
			<Head title={`UA Confession ${confession.id}`} />
		    <Confession {...confession} />
        </div>
	);
}
