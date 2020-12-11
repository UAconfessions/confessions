import style from './Id.module.css';

export default function Id({id, parent}) {
    if (!id && !parent) return null;
    if (parent) {
        return (
            <span 
                className={style.id}
            >
                @{parent.id}
            </span>
        );
    }
    
    return (
        <span 
            className={style.id}
        >
            #{id}
        </span>
    );
}

