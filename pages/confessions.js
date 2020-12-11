import style from '../styles/Confessions.module.css';
import { getConfessions } from '../utils/firebase/firebase';
import Confession from '../components/confession/Confession';

// TODO: pagination

export async function getStaticProps() {
    const confessions = await getConfessions();
    return { props: { confessions } };
}

// TODO: search
// TODO: reacting
// TODO: hotlink (with media cover image)

export default function Confessions({confessions}) {
    return confessions?.map(Confession);
}
