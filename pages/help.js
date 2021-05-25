import style from '../styles/Help.module.css';
import Head from "../components/head/head";

export default function Help() {

    const actions = {
        stip: {
            Description: "Heb je nood aan een babbel? \nContacteer dan gerust het STIP en leg vrijblijvend een gratis afspraak vast met een van de studentenpsychologen. Blijf niet met je zorgen zitten.\n\nDe universiteit biedt veel meer aan dan je zou verwachten, neem zeker een kijkje op het ondersteuningstablad van Blackboard.",
            url: "https://www.uantwerpen.be/nl/studeren/hulp-bij-studentenvragen/stip/"
        },
        zelfmoordlijn: {
            Description: "Vragen of gedachten over zelfmoord? \nBij de zelfmoordlijn ben je altijd welkom! Bel nu naar 1813 of ga naar 1813.be",
            url: "https://1813.be/"
        },
        samensterk: {
            Description: "Samen staan we sterk! Neem een kijkje naar het aanbod van de universiteit om nieuwe mensen te leren kennen.",
            url: "https://www.uantwerpen.be/nl/studentenleven/samen-sterk-tijdens-corona/"
        },
        JAC: {
            Description: "Bij het Jongeren Advies Centrum kan je ook altijd een luisterend oor vinden.",
            url: "https://www.caw.be/jac/contacteer-ons/"
        },
        Tejo: {
            Description: "Zie je het even niet meer zitten? Spring bij Tejo binnen en doe je verhaal!",
            url: "https://tejo.be/"
        },
        Teleonthaal: {
            Description: "Zoek je een uitweg? Praten helpt. Via Tele-onthaal kan je bellen of chatten met iemand die naar je luistert.",
            url: "https://www.tele-onthaal.be/"
        }
    };

    const advice = {
        ween: "Ween wanneer je moet wenen, iedereen heeft daar soms nood aan, ook mannen.",
        bezig: "Probeer je zo veel mogelijk bezig te houden. Wandelingetjes kunnen vaak deugd doen.",
        psycholoog: "Contacteer een van de instellingen hierboven. Je moet je er nooit voor schamen om aan je mentale gezondheid te werken en dus ook niet om naar een psycholoog te gaan.",
        gevoelensuiten: "Probeer je gevoelens op een creatieve manier te uiten. Bv. je gevoelens opschrijven kan soms helpen (je kan hiervan een gewoonte maken om elke avond drie positieve dingen op te schrijven, hoe klein ook).",
        familie: "Onthoud dat je meestal ook bij je famillie terecht kan."
    }

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

            <h1>Advice</h1>

            {Object.entries(advice).map(([key, text]) => (
                <div className={style.confession}>
                    <section>{text}</section>
                </div>
            ))}
        </>
    );
}
