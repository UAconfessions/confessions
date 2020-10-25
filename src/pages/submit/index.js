import {useState} from 'react';
import style from './Submit.module.css';
import Icon from '../../modules/icon';
import Api from './../../utils/api';


export default function Submit() {
    const [confession, setConfession] = useState('');
    const [isFetching, setFetching] = useState(false);


    const submitConfession = async () => {
        setFetching(true);
        const success = data => {
            setConfession('');
            setFetching(false);
        };
        Api.confession.post({confession}, success);
    };
    return (
        <>
            <h1>The truth will set you free</h1>
            <div className={style.confession}>
                    <textarea
                        className={style.confessionField}
                        onChange={e => setConfession(e.target.value)}
                        placeholder={'Jouw anonieme confession hier ...'}
                        value={confession}
                    />
                <div className={style.confessActions}>
                    {confession.length < 10 && (<span>- {10 - confession.length}</span>)}
                    <button
                        className={style.cta}
                        onClick={submitConfession}
                        disabled={isFetching || confession.length < 10}
                    >
                        <div>
                            <Icon.Send/>
                            <Icon.Blocked loading={isFetching}/>
                        </div>
                    </button>
                </div>
            </div>
        </>
    );
}
