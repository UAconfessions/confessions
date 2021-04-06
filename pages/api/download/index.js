import { getDownloadableUrl } from "../../../utils/firebase/firebase";
import request from 'request';

module.exports = async ({query: { file: fileName, path }}, res) => {
	const url = await getDownloadableUrl(fileName, path);
	res.setHeader(`content-disposition`, `attachment; filename=${fileName}`);
	request(url).pipe(res);
	//res.status(200).json(url);
}
