import { getBinnedConfessions } from '../../utils/firebase/firebase';
import Confession from '../../components/confession/Confession';

// TODO: pagination

export async function getStaticProps() {
	const confessions = await getBinnedConfessions();
	return { props: { confessions } };
}

// TODO: search
// TODO: reacting

export default function Bin({confessions}) {
	return confessions?.map(Confession);
}
