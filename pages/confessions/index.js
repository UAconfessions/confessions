import { getConfessions } from '../../utils/firebase/firebase';
import Confession from '../../components/confession/Confession';
import Head from "../../components/head/head";

// TODO: pagination

export async function getStaticProps() {
    const confessions = await getConfessions();
    return { props: { confessions } };
}

// TODO: search
// TODO: reacting

export default function Index({confessions}) {
    return (
        <>
            <Head title={'UA Confessions'} />
            <h1>Confessions</h1>
            { confessions?.map((confession, index) => <Confession {...confession} key={index} />) }
        </>
    );
}
