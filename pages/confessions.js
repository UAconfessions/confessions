import style from '../styles/Confessions.module.css';
import { getConfessions } from '../utils/firebase/firebase';

// TODO: pagination

export async function getStaticProps() {
    const confessions = await getConfessions();
    return { props: { confessions } };
}

// TODO: search
// TODO: reacting
// TODO: hotlink (with media cover image)

export default function Confessions({confessions}) {
    return confessions?.map(({ value, id }) => (
        <div className={style.confession} key={id}>
            <div>#{id} {value}</div>
        </div>
    ));
}
