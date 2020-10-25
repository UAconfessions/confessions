import React, {useState} from 'react';
import style from './Submit.module.css';
import Icon from '../../modules/icon';
import Api from './../../utils/api';


export default function Submit() {
    //  const [reactionId, setReactionId] = useState('');
    //  const [reactingOn, setReactingOn] = useState({});
    const [confession, setConfession] = useState('');
    //const [hasImage, setHasImage] = useState(false);
    // const [confessionId, setConfessionId] = useState(null);
    const [isFetching, setFetching] = useState(false);

    /*
     const fetchConfession = async (id) => {
         if (!id) return;
         return {
             text: `Ben ik de enige student die zijn vlekken op zijn cursus omcirkelt en er bij schrijft wat ze zijn\r\n\r\n#KoffieVlek #Appelsapje #Traan`,
             id: `@${id}`,
             timestamp: new Date()
         };
     };
     */
    const submitConfession = async () => {
        setFetching(true);
        const success = data => {
            setConfession('');
            // setConfessionId(data.id);
            setFetching(false);
        };
        Api.confession.post({confession}, success);
    };
    /*
        useEffect(() => {
            setReactionId(reactionId);
            fetchConfession(reactionId).then(
                confession => {
                    if (!confession) {
                        setReactingOn({});
                        return;
                    }
                    setReactingOn(confession);
                }
            );
        }, [reactionId])
    */
    const monthLUT = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
    const toPrintableDate = (myDate) => {
        return myDate.getDate() + ' ' + monthLUT[myDate.getMonth()] + ' ' + myDate.getFullYear();
    };
    return (
        <>
            <h1>The truth will set you free</h1>
            {/*
                <label htmlFor={'reactionId'}>
                    reageer op een confession:
                    <span className={style.at}>
                        <input
                            className={style.reactionId}
                            type={'number'}
                            id={'reactionId'}
                            name={'reactionId'}
                            placeholder={123456}
                            value={reactionId}
                            onChange={(e) => setReactionId(e.target.value)}
                        />
                    </span>
                </label>
            }
            {reactingOn.text && (
                <div className={style.reactingOn}>
                        <span
                            className={style.reactingOnInfo}>{reactingOn.id}: {toPrintableDate(reactingOn.timestamp)}</span>
                    <p>{reactingOn.text}</p>
                </div>
            )*/}
            <div className={style.confession}>
                    <textarea
                        className={style.confessionField}
                        onChange={e => setConfession(e.target.value)}
                        placeholder={'Jouw anonieme confession hier ...'}
                        value={confession}
                    />

                <div className={style.confessActions}>
                    {confession.length < 10 && (<span>- {10 - confession.length}</span>)}
                    {/* && (
                        <button className={style.action} onClick={() => setHasImage(!hasImage)}>
                            <Icon.setImage cancel={hasImage}/>
                        </button>
                    */}
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
            { /* hasImage && (
                <div className={style.imgUpload}>
                    <span>sleep hier de foto die je wenst te delen</span>
                    <input
                        type={'file'}
                    />
                </div>
            ) */}
        </>
    );
}
