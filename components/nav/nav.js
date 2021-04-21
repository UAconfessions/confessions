import style from './Nav.module.css';

export default function Nav({children}) {
    return (
        <>
            <nav className={style.header}>
                {children[0]}
                {children[1]}
            </nav>
            {children[2] && (
                <nav className={style.adminHeader}>
                    {children[2]}
                </nav>
            )}
        </>
    );
}
