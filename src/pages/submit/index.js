import { useState } from 'react';
import style from './Submit.module.css';
import Icon from '../../modules/icon';
import Api from './../../utils/api';


export default function Submit() {
    const [confession, setConfession] = useState('');
    const [isFetching, setFetching] = useState(false);
    const [reactionId, setReactionId] = useState(null);
    const [reactingOn, setReactingOn] = useState({});
    const minimumLength = 0;

    const getConfessionForReaction = async (e) => {
        setReactionId(e.target.value);
        setReactingOn({});
        if(e.target.value){
            setFetching(true);
            const success = data => {
                setReactingOn(data);
            };
            await Api.reaction.get({urlData: {id: e.target.value}, success});
            setFetching(false);
        }
    }

    const submitConfession = async () => {
        setFetching(true);
        const success = () => {
            setConfession('');
        };
        if (reactingOn.value){
            await Api.reaction.post({postData: {confession}, urlData: {id: reactionId}, success});
        }else{
            await Api.confession.post({postData: {confession}, success});
        }
        setFetching(false);
    };
    const stringifyDate = date => {
        const monthLUT = {
          '01': 'januarie',
          '02': 'februarie',
          '03': 'maart',
          '04': 'april',
          '05': 'mei',
          '06': 'juni',
          '07': 'juli',
          '08': 'augustus',
          '09': 'september',
          '10': 'oktober',
          '11': 'november',
          '12': 'december',

        };
         return `${date.substr(8, 2)} ${monthLUT[date.substr(5, 2)]} ${date.substr(0, 4)}`;
    }
    return (
        <>
            <h1>The truth will set you free</h1>
            <div className={style.confession}>
                <div className={style.confessionData}>
                    {reactionId !== null && (
                        <>
                            <label htmlFor={'reactionId'} className={style.label}>
                                reageer op een confession:
                                <span className={style.at}>
                                <input
                                    className={style.reactionId}
                                    type={'number'}
                                    id={'reactionId'}
                                    name={'reactionId'}
                                    placeholder={123456}
                                    value={reactionId}
                                    onChange={getConfessionForReaction}
                                />
                            </span>
                            </label>
                            {reactingOn.value && (
                                <div className={style.reactingOn}>
                                <span className={style.reactingOnInfo}>
                                    {stringifyDate(reactingOn.posted)}
                                </span>
                                    <p>{reactingOn.value}</p>
                                </div>
                            )}
                        </>
                    )}

                    <textarea
                        className={style.confessionField}
                        onChange={e => setConfession(e.target.value)}
                        placeholder={'Jouw anonieme confession hier ...'}
                        value={confession}
                    />
                </div>
                <div className={style.confessActions}>
                    {confession.length < minimumLength && (<span>- {minimumLength - confession.length}</span>)}
                    <button
                        className={style.action}
                        onClick={() => {
                            if(reactionId === null){
                                setReactionId('' );
                            }else{
                                setReactionId(null );
                                setReactingOn({});
                            }
                        }}
                    >
                        @
                    </button>
                    <button
                        className={style.cta}
                        onClick={submitConfession}
                        disabled={isFetching || confession.length < minimumLength}
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
