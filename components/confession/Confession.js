import style from './Confession.module.css';

export default function Confession(props) {
	return (
        <div className={style.confession}
            <Id {...props} />
            {props.value}
        </div>
	);
}

