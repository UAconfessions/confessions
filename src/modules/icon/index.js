import React from "react";
import sendSrc from './send.svg'
import imgSrc from './image.svg'
import noImgSrc from './noImage.svg'
import pollSrc from './poll.svg'
import blockedSrc  from './blocked.svg'

function send({name}){
    return <img src={sendSrc} alt={'versturen'} />
}

function setImage({cancel}){
    if(!cancel)
        return <img src={imgSrc} alt={'zet een afbeelding'} />
    return <img src={noImgSrc} alt={'afbeeldingselectie anuleren'} />
}

function loading({name}){
    return <img src={blockedSrc} alt={'wachten'} />
}

function blocked({name}){
    return <img src={blockedSrc} alt={'nog niet beschikbaar'} />
}

function poll({name}){
    return <img src={pollSrc} alt={'poll'} />
}

export default { send, setImage, loading, blocked, poll};
