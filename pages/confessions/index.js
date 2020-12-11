import { getConfessions } from '../../utils/firebase/firebase';
import Confession from '../../components/confession/Confession';

// TODO: pagination

export async function getStaticProps() {
    const confessions = await getConfessions();
    return { props: { confessions } };
}

// TODO: search
// TODO: reacting

export default function Index({confessions}) {
    return confessions?.map(Confession);
}
