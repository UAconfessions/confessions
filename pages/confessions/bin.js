import { getBinnedConfessions } from '../../utils/firebase/firebase';
import Confession from '../../components/confession/Confession';
import Head from "../../components/head/head";


const itemsPerPage = 60;
export async function getStaticProps() {
	const confessions = await getBinnedConfessions(itemsPerPage);
	return { props: { confessions } };
}

export default function Bin({confessions}) {
	return (
		<>
			<Head title={'Unfiltered UA Confessions'} />
			<h1>Unfiltered confessions</h1>
			{ confessions?.map((confession, index) => <Confession {...confession} key={index} />) }
		</>
	);
}
