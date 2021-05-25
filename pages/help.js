import style from '../styles/Help.module.css';
import Head from "../components/head/head";

export default function Help() {

    const actions = {
        stip: {
            Description: "Heb je nood aan een babbel? \nContacteer dan gerust het STIP en leg vrijblijvend een gratis afspraak vast met een van de studentenpsychologen. Blijf niet met je zorgen zitten.\n\nDe universiteit biedt veel meer aan dan je zou verwachten, neem zeker een kijkje op het ondersteuningstablad ban Blackboard.",
            url: "https://www.uantwerpen.be/nl/studeren/hulp-bij-studentenvragen/stip/"
        },
        zelfmoordlijn: {
            Description: "Vragen of gedachten over zelfmoord? \nBij de zelfmoordlijn ben je altijd welkom! Bel nu naar 1813 of ga naar 1813.be",
            url: "https://1813.be/"
        },
        samensterk: {
            Description: "Samen staan we sterk! Neem een kijkje naar het aanbod van de universiteit om nieuwe mensen te leren kennen.",
            url: "https://www.uantwerpen.be/nl/studentenleven/samen-sterk-tijdens-corona/"
        }
    };

    return (
        <>
            <Head title={'Help'}/>
            <h1>You're not alone</h1>

            {Object.entries(actions).map(([action, {Description, url}]) => (

                <a href={url}>
                    <div className={style.confession}>
                        <section>{Description}</section>
                    </div>
                </a>
            ))}
        </>
    );
}
