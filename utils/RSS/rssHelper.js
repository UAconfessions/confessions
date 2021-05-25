export const getRssXml = (posts) => {
	const title = 'UAntwerpen Confessions';
	const description = '';
	const url = 'https://ua.confessions.link';

	const items = posts.map(post => `
		<item>
			<title>${esc(`#${post.id} ${post.value}`)}</title>
			<link>https://ua.confessions.link/confessions/${post.id}</link>
			<pubDate>${post.posted}</pubDate>
			<guid isPermaLink="true">${post.id}</guid>
			<description>${esc(post.value)}</description>
			<content:encoded>${esc(`#${post.id} ${post.value}`)}</content:encoded>
		</item>
	`);

	// TODO: add image -> <![CDATA[<img align="left" hspace="5" src=""/>

	return `<?xml version="1.0" ?>
		<rss
			xmlns:dc="http://purl.org/dc/elements/1.1/"
			xmlns:content="http://purl.org/rss/1.0/modules/content/"
			xmlns:atom="http://www.w3.org/2005/Atom"
			version="2.0"
		>
		<channel>
		    <title>${title}</title>
		    <link>${url}</link>
		    <description>${description}</description>
		    <lastBuildDate>${posts[0].posted}</lastBuildDate>
		    <image>
				<url>https://ua.confessions.link/images/logo.jpg</url>
				<title>${title}</title>
			    <link>${url}</link>
		    </image>
		    ${items}
		</channel>
		</rss>`;
};

const esc = (value) => `<![CDATA[${value}]]>`;
