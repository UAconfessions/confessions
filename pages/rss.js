export async function getServerSideProps(context) {

	const res = context.res;
	if (!res) {
		return;
	}
	// fetch your RSS data from somewhere here
	const blogPosts = `<?xml version="1.0" ?>
      <rss
        xmlns:dc="http://purl.org/dc/elements/1.1/"
        xmlns:content="http://purl.org/rss/1.0/modules/content/"
        xmlns:atom="http://www.w3.org/2005/Atom"
        version="2.0"
      >
        <channel>
            <title><![CDATA[Frontend development articles by Rob Kendal]]></title>
            <link>https://myamazingwebsite.com</link>
            <description>
              <![CDATA[A description about your own website that really shows off what it's all about]]>
            </description>
            <language>en</language>
            <lastBuildDate></lastBuildDate>
            <item></item>
        </channel>
      </rss>`;
	res.setHeader("Content-Type", "text/xml");
	res.write(blogPosts);
	res.end();
	return ({});
}
export default function Rss() {
	return null;
}
