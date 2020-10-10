import React from 'react';
import {Outlet, Route, Routes} from 'react-router-dom';
import Submit from './pages/submit';
import Dashboard from './pages/dashboard';

import logo from './logo.jpg';
import style from './App.module.css';

function Structure() {
    return (
        <>
            <header className={style.header}>
                <img className={style.logo} src={logo} alt={'fluisterlogo uantwerpen confessions'}/>
            </header>
            <section className={style.content}>
                <Outlet/>
            </section>
        </>
    );
}

export default function App() {

    return (
        <>
            <Routes>
                <Route path="/" element={<Structure />}>
                    <Route path="/" element={<Submit/>}/>
                    <Route path="admin" element={<Dashboard/>}/>
                </Route>
            </Routes>
        </>
    );
}
/*


            </section>
        </>
    );
}

export default App;
*/
