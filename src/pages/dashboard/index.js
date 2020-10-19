import React, {useState} from 'react';
import Api from "../../utils/api";
import style from './Dashboard.module.css';
import Icon from './../../modules/icon';

export default function Dashboard() {
    const [freshConfession, setFreshConfession] = useState(null);
    const [pwd, setPwd] = useState('');
    const [fetching, setFetching] = useState(false);
    const [posting, setPosting] = useState(false);
    const [error, setError] = useState([]);

    const fetchConfession = () => {
        if (fetching) return;
        setFetching(true);
        const success = data => {
            setFreshConfession(data);
            setFetching(false);
        };
        const fail = e => {
            setFetching(false);
            setError([...error, e]);
        };
        Api.confession.get({}, success, fail, pwd);
    };
    const acceptConfession = () => {
        handleConfession(parseInt(freshConfession.id), 'accept');
    }
    const rejectConfession = () => {
        handleConfession(parseInt(freshConfession.id), 'reject');
    }
    const archiveConfession = () => {
        handleConfession(parseInt(freshConfession.id), 'archive');
    }
    const handleConfession = (id, action) => {
        if (posting) return;
        setPosting(true);
        const success = data => {
            setFreshConfession(null);
            setPosting(false);
            fetchConfession();
        };
        const fail = e => {
            setPosting(false);
            setError([...error, e]);
        };
        Api.handle.post({action, id}, success, fail, pwd);
    };
    return (
        <>
            <h1>Dashboard</h1>
            <input type={'text'} placeholder={'paswoord'} value={pwd} onChange={(e) => setPwd(e.target.value)}/>
            <button onClick={fetchConfession}>Start</button>
            {freshConfession && (
                <>
                    <div className={style.confession}>
                        {freshConfession.text}

                    </div>
                    <div className={style.actions}>
                        <button onClick={rejectConfession}><Icon.reject /></button>
                        <button onClick={archiveConfession}><Icon.archive /></button>
                        <button onClick={acceptConfession}><Icon.accept /></button>
                    </div>
                </>
            )}
            {error?.length > 0 && (
                <div>
                    <ul>
                        {error.map(e => (<li>{JSON.stringify(e)}</li>))}
                    </ul>
                </div>
            )}
        </>
    );
}
