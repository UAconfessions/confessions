import React from "react";
import style from './Icon.module.css'

import sendSrc from './send.svg'
import imgSrc from './image.svg'
import noImgSrc from './noImage.svg'
import pollSrc from './poll.svg'
import blockedSrc  from './blocked.svg'

function send(){
    return <img src={sendSrc} alt={'versturen'} />
}

function setImage({cancel}){
    if(!cancel)
        return <img src={imgSrc} alt={'zet een afbeelding'} />
    return <img src={noImgSrc} alt={'afbeeldingselectie anuleren'} />
}

function loading(){
    return <img src={blockedSrc} alt={'wachten'} className={style.spin} />
}

function blocked({loading}){
    return <img src={blockedSrc} alt={'nog niet beschikbaar'} className={loading ? style.spin : ''} />
}

function poll(){
    return <img src={pollSrc} alt={'poll'} />
}

export default { send, setImage, loading, blocked, poll};
