import { getBinnedConfessions } from '../../utils/firebase/firebase';
import Confession from '../../components/confession/Confession';
import Head from "../../components/head/head";

// TODO: pagination

export async function getStaticProps() {
	const confessions = await getBinnedConfessions(60);
	return { props: { confessions } };
}

// TODO: search
// TODO: reacting

export default function Bin({confessions}) {
	return (
		<>
			<Head title={'UA Confessions bin'} />
			<h1>Unfiltered confessions</h1>
			{ confessions?.map((confession, index) => <Confession {...confession} key={index} />) }
		</>
	);
}
