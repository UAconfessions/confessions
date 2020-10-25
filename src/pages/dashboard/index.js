import React, {useState} from 'react';
import Api from "../../utils/api";
import style from './Dashboard.module.css';
import Icon from './../../modules/icon';

export default function Dashboard() {
    const [freshConfession, setFreshConfession] = useState(null);
    const [pwd, setPwd] = useState('');
    const [usr, setUsr] = useState('');
    const [fetching, setFetching] = useState(false);
    const [posting, setPosting] = useState(false);
    const [error, setError] = useState([]);

    const stop = () => {
        setFreshConfession(null);
        setPwd('');
        setUsr('');
    }
    const fetchConfession = () => {
        if (fetching) return;
        setFetching(true);
        const success = data => {
            setFetching(false);
            if (data.message === 'unauthorised') return setError([...error, data]);
            setFreshConfession(data);
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
        Api.handle.post({action, id, handler: usr}, success, fail, pwd);
    };
    return (
        <>
            <h1>Dashboard</h1>
            {!freshConfession && (
                <form onSubmit={e => e.preventDefault()}>
                    <input className={style.input} type={'text'} placeholder={'username'} value={usr}
                           onChange={(e) => setUsr(e.target.value)}/>
                    <input className={style.input} type={'password'} placeholder={'paswoord'} value={pwd}
                           onChange={(e) => setPwd(e.target.value)}/>
                    <button className={style.green} onClick={fetchConfession}>{}<Icon.Start/></button>
                </form>
            )}
            {freshConfession && (
                <>
                    <button className={style.red} onClick={stop}>{}<Icon.Stop/></button>
                    <div className={style.confession}>
                        {freshConfession.text}

                    </div>
                    <div className={style.actions}>
                        <button className={style.red} onClick={rejectConfession}><Icon.Reject/></button>
                        <button className={style.action} onClick={archiveConfession}><Icon.Archive/></button>
                        <button className={style.green} onClick={acceptConfession}><Icon.Accept/></button>
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
