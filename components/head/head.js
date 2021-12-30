import HeadWrapper from "next/head";

export default function Head({title}){
	return (
		<HeadWrapper>
			<title>{title ?? 'UA Confessions'}</title>
			<meta property="og:title" content={title ?? 'UA Confessions'} key="title" />
			<link rel="icon" href="/favicon.ico"/>
			<meta name="viewport" content="width=device-width, initial-scale=1"/>
			<link href="https://fonts.googleapis.com/css2?family=Alef:wght@700&display=swap" rel="stylesheet"/>
			<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
			<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
			<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
			<link rel="manifest" href="/site.webmanifest"/>
			<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#bd3531"/>
			<meta name="msapplication-TileColor" content="#b91d47"/>
			<meta name="theme-color" content="#161923FF" media="(min-width: 700px)"/>
			<meta name="theme-color" content="#93252CFF" media="(max-width: 700px)"/>
			<meta
				name="UAntwerpen confessions"
				content="Deel hier je diepste geheimen"
			/>
			<link rel="apple-touch-icon" href="/logo192.png"/>

		</HeadWrapper>
	);
}
