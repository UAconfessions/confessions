import {getDownloadableUrl, listFiles} from "../../../utils/firebase/firebase";
import request from 'request';

module.exports = async (req, res) => {
	const files = await listFiles();
	res.status(200).json({files: files[0].map(file => file.name)});
	// const url = await getDownloadableUrl(fileName, path);
	// request(url).pipe(res);
	//res.status(200).json(url);
}
