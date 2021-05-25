import {getConfessions} from "../utils/firebase/firebase";
import {getRssXml} from "../utils/RSS/rssHelper";

export async function getServerSideProps({res}) {
	if (!res) {
		return;
	}
	const confessions = await getConfessions(100);
	res.setHeader("Content-Type", "text/xml");
	res.write(getRssXml(confessions));
	res.end();
	return ({ props: {} });
}
export default function Rss() {
	return null;
}


