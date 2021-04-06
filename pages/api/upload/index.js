import {getPresignedUrl, verifyIdToken} from "../../../utils/firebase/firebase";

module.exports = async ({query: { file, type }, headers: { token, 'x-real-ip': realIp }, connection}, res) => {
	const ip = realIp || connection.remoteAddress;

	try {
		const user = await verifyIdToken(token);
		const presignedUrl = await getPresignedUrl(file, `${type}/${user.uid}`, user.email);
		res.status(200).json(presignedUrl);
	}catch(e){
		res.status(401).json({message: 'Unauthorized', code: 401});
	}

}
