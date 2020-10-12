import React, {useState} from 'react';
import Api from "../../utils/api";

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
                <div>
                    {freshConfession.text}
                    <div>
                        <button onClick={rejectConfession}>reject</button>
                        <button onClick={acceptConfession}>accept</button>
                    </div>
                </div>
            )}
            {error && (
                <div>
                    {JSON.stringify(error)}
                </div>
            )}
        </>
    );
}
