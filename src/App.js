import {Link, NavLink, Outlet, Route, Routes, useLocation} from 'react-router-dom';
import Submit from './pages/submit';
import Dashboard from './pages/dashboard';
import Nav from './modules/nav';

import logo from './logo.jpg';
import style from './App.module.css';
import {useState} from "react";
import {Navigate} from "react-router";

function Structure({isAdmin}) {
    const {pathname} = useLocation();
    return (
        <>
            <Nav type={'icon links'} class={style.header}>
                <Link to={''} className={style.navItem}><img className={style.logo} src={logo} alt={'fluisterlogo uantwerpen confessions'}/></Link>
                <NavLink to={'submit'} className={style.navItem} activeClassName={style.navItemActive} end>confess</NavLink>
                { (isAdmin || pathname === '/admin') && (<NavLink to={'admin'} className={style.navItem} activeClassName={style.navItemActive} end>judge</NavLink>)}
            </Nav>
            <section className={style.content}>
                <Outlet/>
            </section>
        </>
    );
}

export default function App() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [pwd, setPwd] = useState('');
    const [usr, setUsr] = useState('');
    const [freshConfession, setFreshConfession] = useState(null);
    return (
        <>
            <Routes>
                <Route path="/" element={<Structure isAdmin={isAdmin} />}>
                    <Route path="submit" element={<Submit/>}/>
                    <Route path="admin" element={
                        <Dashboard
                            setIsAdmin={setIsAdmin}
                            pwd={pwd}
                            setPwd={setPwd}
                            usr={usr}
                            setUsr={setUsr}
                            freshConfession={freshConfession}
                            setFreshConfession={setFreshConfession}
                        />
                    }/>
                    <Route path="/" element={<Navigate to={'submit'}/>}/>
                </Route>
            </Routes>
        </>
    );
}
