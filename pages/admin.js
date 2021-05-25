import style from '../styles/Admin.module.css';
import Icon from '../components/icon/icon';
import useSWR, {mutate} from 'swr';
import fetcher from '../utils/api/fetcher';
import {useUser} from '../utils/firebase/useUser';
import {useState} from 'react';
import Head from "../components/head/head";
import Confession from "../components/confession/Confession";

export default function Dashboard({}) {
    const {user} = useUser();
    const {
        data: archiveData,
        error: archiveError
    } = useSWR(user?.token ? ['api/admin/archive', user.token] : null, fetcher);
    const {data, error} = useSWR(user?.token ? ['api/admin/confession', user.token] : null, fetcher);
    const [fetching, setFetching] = useState({});
    const actions = {
        reject: {ActionIcon: Icon.Reject, actionStyle: style.red, handle: true, active: true},
        archive: {ActionIcon: Icon.Archive, actionStyle: style.blue, handle: true, active: true},
        toggleTriggerWarning: {ActionIcon: Icon.Tag, actionStyle: style.pink, handle: false, active: false},
        accept: {ActionIcon: Icon.Accept, actionStyle: style.green, handle: true, active: true},
    };
    const archiveActions = {
        reject: {ActionIcon: Icon.Reject, actionStyle: style.red},
        toggleTriggerWarning: {ActionIcon: Icon.Tag, actionStyle: style.pink},
        accept: {ActionIcon: Icon.Accept, actionStyle: style.green},
    };

    function toggleTriggerWarning(confession) {
        if (confession.triggerWarning) {
            confession.triggerWarning = '';
        } else {
            confession.triggerWarning = prompt('What about this confession could be a trigger?', 'verkrachting');
        }

    }

    const handleConfession = async (action, confession, stack) => {
        if (!confession?.queueId) return alert('no confession is found');
        if (!user.token) return alert('no user token found');

        setFetching({...fetching, [confession.queueId]: true});

        if (action === 'toggleTriggerWarning') {
            toggleTriggerWarning(confession);
        }

        if (action.handle) {
            await handle(confession.queueId, action, user.token, confession.triggerWarning);

            // update confessions after handle
            if (action === 'archive') {
                await mutate(['api/admin/confession', user.token]);
                await mutate(['api/admin/archive', user.token]);
            } else if (stack === 'queue') {
                await mutate(['api/admin/confession', user.token]);
            } else {
                await mutate(['api/admin/archive', user.token]);
            }
        }

        setFetching({...fetching, [confession.queueId]: false});

    };

    return (
        <>
            <Head title={'UA Admin'}/>

            <section className={style.queue}>
                {error?.code === 404 && (
                    <h1>No pending confessions</h1>
                )}
                {error?.code !== 404 && (
                    <>
                        <h1>{data?.amount ?? '-'} pending</h1>
                        {data?.confession && (
                            <>
                                <Confession {...data.confession} />

                                <div className={style.actions}>
                                    {Object.entries(actions).map(([action, {actionStyle, ActionIcon, handle, active}]) => (
                                        <button key={action} disabled={fetching[data.confession.queueId]}
                                                className={actionStyle}
                                                onClick={() => handleConfession(action, data.confession, 'queue')}>
                                            <ActionIcon/></button>
                                    ))}
                                </div>
                            </>
                        )}
                        {error && (
                            <div>
                                <span>An error occurred, try reloading this page.</span>
                                {JSON.stringify(error)}
                            </div>
                        )}
                    </>
                )}
            </section>
            {archiveData?.confessions?.length > 0 && (
                <>
                    <h1>Archive</h1>
                    <section>
                        {archiveData.confessions.map(confession => (
                            <div className={style.archivedConfession}>
                                <Confession {...confession} />
                                <div className={style.actions}>
                                    {Object.entries(archiveActions).map(([action, {
                                        actionStyle,
                                        ActionIcon
                                    }]) => (
                                        <button key={action} disabled={fetching[confession.queueId]}
                                                className={actionStyle}
                                                onClick={() => handleConfession(action, confession, 'archive')}>
                                            <ActionIcon/></button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </section>
                </>
            )}

        </>
    );
}


const handle = async (id, action, token, triggerWarning) => {
    await fetch(`/api/admin/confession/${id}/${action}${triggerWarning ? `?triggerWarning=${triggerWarning}` : ''}`, {
        method: 'POST',
        headers: new Headers({'Content-Type': 'application/json', token}),
        credentials: 'same-origin',
    });
}
