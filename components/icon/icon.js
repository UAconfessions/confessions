import style from './Icon.module.css';

import sendSrc from './send.svg';
import imgSrc from './image.svg';
import noImgSrc from './noImage.svg';
import pollSrc from './poll.svg';
import blockedSrc from './blocked.svg';
import trashSrc from './trash.svg';
import publishSrc from './publish.svg';
import archiveSrc from './archive.svg';
import playSrc from './play.svg';
import stopSrc from './stop.svg';
import tagSrc from './tag.svg';
import helpSrc from './help.svg';

import angleRightSrc from './angleRight.svg';
import angleDownSrc from './angleDown.svg';
import angleLeftSrc from './angleLeft.svg';
import angleUpSrc from './angleUp.svg';

const Send = (props) => (
    <img src={sendSrc} alt={'versturen'} {...props} />
);

const SetImage = ({cancel, ...props}) => {
   if(!cancel) return <img src={imgSrc} alt={'zet een afbeelding'} {...props} />
    return <img src={noImgSrc} alt={'afbeeldingselectie anuleren'} {...props} />
}

const Loading = (props) => (
    <img src={blockedSrc} alt={'wachten'} className={style.spin} {...props} />
);

const Blocked = ({loading, ...props}) => (
    <img src={blockedSrc} alt={'nog niet beschikbaar'} className={loading ? style.spin : ''} {...props} />
);

const Poll = (props) => (
    <img src={pollSrc} alt={'poll'} {...props} />
);

const Reject = (props) => (
    <img src={trashSrc} alt={'reject'} {...props} />
);

const Accept = (props) => (
    <img src={publishSrc} alt={'publish'} {...props} />
);

const Archive = (props) => (
    <img src={archiveSrc} alt={'archive'} {...props} />
);

const Start = (props) => (
    <img src={playSrc} alt={'start'} {...props} />
);

const Stop = (props) => (
    <img src={stopSrc} alt={'stop'} {...props} />
);

const Tag = (props) => (
    <img src={tagSrc} alt={'tag'} {...props} />
);

const Help = (props) => (
    <img src={helpSrc} alt={'help'} {...props} />
);

const Angle = {
    Right: (props) => <img src={angleRightSrc} alt={'angle right'} {...props} />,
    Down: (props) => <img src={angleDownSrc} alt={'angle down'} {...props} />,
    Left: (props) => <img src={angleLeftSrc} alt={'angle left'} {...props} />,
    Up: (props) => <img src={angleUpSrc} alt={'angle up'} {...props} />
};

const icons = { Send, SetImage, Loading, Blocked, Poll, Reject, Accept, Archive, Start, Stop, Tag, Help, Angle, Trash: Reject};
export default icons;
