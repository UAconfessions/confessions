import fs from 'fs';
import { join } from 'path';
import { getConfessions } from '../../utils/firebase/firebase';
import Confession from '../../components/confession/Confession';
import Head from "../../components/head/head";
import Pagination from "../../components/pagination/Pagination";
import { useRouter } from "next/router";

export async function getServerSideProps(context) {
    const itemsPerPage = +(context.query.itemsPerPage ?? 20);
    const page = +(context.query.page ?? 0);

    const getStartId = async (queryId) => {
        if (!queryId) {
            const firstConfession = await getConfessions(1);
            return firstConfession[0].id;
        }
        return +queryId;
    }

    const startId = await getStartId(context.query.startId);
    const cursorId = startId - (itemsPerPage * page);

    let confessions = [];

    if (cursorId >= 13789) {
        confessions = await getConfessions(itemsPerPage, cursorId);
    }

    if (cursorId - itemsPerPage < 13789) {
        // firebase stores everything from 13789

        const rootDirectory = process.cwd();
        const fullPath = join(rootDirectory, 'resources/first_15k_confessions.json');
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const first15K = JSON.parse(fileContents);

        const firstId = cursorId - confessions.length;
        const firstIndex = 15000 - firstId;
        const extraConfessions = first15K.slice(firstIndex, firstIndex + (itemsPerPage - confessions.length));
        confessions = [...confessions, ...extraConfessions];
    }
    const amountOfConfessions = startId - 400;
    const pages = Math.ceil( amountOfConfessions / itemsPerPage);

    return { props: { confessions, pages, page: page, startId, itemsPerPage } };
}
// TODO: search
// TODO: reacting
// TODO: 13789 - 14340 firebase has not dates

export default function Index({confessions, pages, page, startId, itemsPerPage}) {
    const router = useRouter();
    const renderPagination = () => (
        <Pagination
            page={page}
            pages={pages}
            setPage={(page) => {
                if (page === 0) return router.replace(`?itemsPerPage=${itemsPerPage}`);
                router.replace(`?page=${page}&startId=${startId}&itemsPerPage=${itemsPerPage}`)
            }}
            leading={1}
            trailing={1}
            around={1}
        />
    );
    return (
        <>
            <Head title={'UA Confessions'} />
            <h1>Confessions</h1>
            {renderPagination()}
            { confessions?.map((confession) => <Confession {...confession} key={`${confession.id}-${confession.posted}`} />) }
            {renderPagination()}
        </>
    );
}
