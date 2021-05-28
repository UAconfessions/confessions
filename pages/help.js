import Head from '../components/head/head';
import Article from '../components/article/Article';

export default function Help() {

    const sources = [
        {
            name: 'het STIP',
            hook: 'Heb je nood aan een babbel?',
            description: 'Contacteer dan gerust het STIP en leg vrijblijvend een gratis afspraak vast met een van de studentenpsychologen. Blijf niet met je zorgen zitten.\n\nDe universiteit biedt veel meer aan dan je zou verwachten, neem zeker een kijkje op het ondersteuningstablad van Blackboard.',
            url: 'https://www.uantwerpen.be/nl/studeren/hulp-bij-studentenvragen/stip/'
        },
        {
            name: 'de zelfmoordlijn',
            hook: 'Vragen of gedachten over zelfmoord?',
            description: 'Bij de zelfmoordlijn ben je altijd welkom! Bel nu naar 1813 of ga naar 1813.be',
            url: 'https://1813.be/'
        },
        {
            name: 'samen sterk',
            hook: 'Samen staan we sterk!',
            description: 'Neem een kijkje naar het aanbod van de universiteit om nieuwe mensen te leren kennen.',
            url: 'https://www.uantwerpen.be/nl/studentenleven/samen-sterk-tijdens-corona/'
        },
        {
            name: 'JAC',
            hook: 'Op zoek naar antwoorden?',
            description: 'Bij het Jongeren Advies Centrum kan je naast een luisterend oor heel wat hulpbronnen raadplegen.',
            url: 'https://www.caw.be/jac/contacteer-ons/'
        },
        {
            name: 'Tejo',
            hook: 'Zie je het even niet meer zitten?',
            description: 'Spring bij Tejo binnen en doe je verhaal!',
            url: 'https://tejo.be/'
        },
        {
            name: 'Tele-onthaal',
            hook: 'Zoek je een uitweg? Praten helpt.',
            description: 'Via Tele-onthaal kan je bellen of chatten met iemand die naar je luistert.',
            url: 'https://www.tele-onthaal.be/'
        }
    ];

    const advices = [
        'Ween wanneer je moet wenen, iedereen heeft daar soms nood aan, ook mannen.',
        'Probeer je zo veel mogelijk bezig te houden. Wandelingetjes kunnen vaak deugd doen.',
        'Contacteer een van de instellingen hierboven. Je moet je er nooit voor schamen om aan je mentale gezondheid te werken en dus ook niet om naar een psycholoog te gaan.',
        'Probeer je gevoelens op een creatieve manier te uiten. Bv. je gevoelens opschrijven kan soms helpen (je kan hiervan een gewoonte maken om elke avond drie positieve dingen op te schrijven, hoe klein ook).',
        'Onthoud dat je meestal ook bij je famillie terecht kan.'
    ];

    const toClipBoard = linkToCopy => {
        navigator.clipboard.writeText(linkToCopy)
            .then(
                () => alert('Copied link.'),
                er => alert('Could not copy link.')
            );
    };

    return (
        <>
            <Head title={'Help'}/>

            <section>
                <h1>You're not alone</h1>

                {sources.map(({ name, hook, description, url}) => (
                    <Article
                        key={name}
                        footer={
                            <span>
                            <span onClick={() => toClipBoard(url)}>copy link</span>
                            <a href={url} target="_blank">
                                naar de website van {name}
                            </a>
					    </span>
                        }
                    >
                        <h2>{hook}</h2>
                        <p>{description}</p>
                    </Article>

                ))}
            </section>

            <section>
                <h1>Advice</h1>

                {advices.map((advice, index) => (
                    <Article key={index}>
                        {advice}
                    </Article>
                ))}
            </section>

        </>
    );
}
