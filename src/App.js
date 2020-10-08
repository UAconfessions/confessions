import React, {useEffect, useState} from 'react';
import logo from './logo.jpg';
import send from './send.svg';
import image from './image.svg';
import noImage from './noImage.svg';
import poll from './poll.svg';
import loading from './loading.svg';
import style from './App.module.css';

function App() {
    const [reactionId, setReactionId] = useState('');
    const [reactingOn, setReactingOn] = useState({});
    const [confession, setConfession] = useState('');
    const [hasImage, setHasImage] = useState(false);
    const [confessionId, setConfessionId] = useState(null);
    const [isFetching, setFetching] = useState(false);

    const fetchConfession = async (id) => {
        if (!id) return;
        return {
            text: `Ben ik de enige student die zijn vlekken op zijn cursus omcirkelt en er bij schrijft wat ze zijn\r\n\r\n#KoffieVlek #Appelsapje #Traan`,
            id: `@${id}`,
            timestamp: new Date()
        };
    };

    const objectToPostBody = obj => Object.entries(obj)
        .reduce( (postBody, [key, value])  => {
            postBody.append(key, value);
            return postBody;
        }, new FormData());


    async function postData(url = '', data = {}) {
        // Default options are marked with *
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: objectToPostBody(data) // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }


    const submitConfession = async () => {
        setFetching(true);
        postData('http://confessions.link/api/confession/', { confession } )
            .then(data => {
                setConfession('');
                setConfessionId(data.id);
                setFetching(false);
            });
    };

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

    const monthLUT = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
    const toPrintableDate = (myDate) => {
        return myDate.getDate() + ' ' + monthLUT[myDate.getMonth()] + ' ' + myDate.getFullYear();
    };
    return (
        <>
            <header className={style.header}>
                <img className={style.logo} src={logo} alt={'fluisterlogo uantwerpen confessions'}/>
            </header>
            <section className={style.content}>
                <h1>The truth will set you free</h1>
                {/* <label htmlFor={'reactionId'} className={style.label}>
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
                </label> */}
                {reactingOn.text && (
                    <div className={style.reactingOn}>
                        <span
                            className={style.reactingOnInfo}>{reactingOn.id}: {toPrintableDate(reactingOn.timestamp)}</span>
                        <p>{reactingOn.text}</p>
                    </div>
                )}
                <div className={style.confession}>
                    <textarea
                        className={style.confessionField}
                        onChange={e => setConfession(e.target.value)}
                        placeholder={'Jouw anonieme confession hier ...'}
                        value={confession}
                    />

                    <div className={style.confessActions}>
                        {/* !hasImage && (
                            <button className={style.action} onClick={() => setHasImage(true)}><img src={image}/>
                            </button>)}
                        {hasImage && (
                            <button className={style.action} onClick={() => setHasImage(false)}><img src={noImage}/>
                            </button>)*/}
                        {confession.length < 10 && (<span>- {10 - confession.length}</span>)}
                        <button className={style.cta} onClick={submitConfession} disabled={isFetching || confession.length < 10} ><img className={style.send} src={send}/><img className={style.loading} src={loading}/></button>
                    </div>
                </div>
                {hasImage && (
                    <div className={style.imgUpload}>
                        <input
                            className={style.uploadInput}
                            type={'file'}
                        />
                    </div>
                )}
            </section>
        </>
    );
}

export default App;
