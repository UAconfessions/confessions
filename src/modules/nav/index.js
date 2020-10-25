import style from './Nav.module.css';

export default function Nav({children}) {
    return (
        <header className={style.header}>
            {children}
        </header>
    );
}
