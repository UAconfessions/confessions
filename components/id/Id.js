import style from './Id.module.css';

export default function Id({ id, parent, name }) {
    if (!id && !parent && !name) return null;

    if (name) {
        return (
            <span
                className={style.id}
            >
                {name}
            </span>
        );
    }

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

