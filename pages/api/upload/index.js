import {getPresignedUrl, verifyIdToken} from "../../../utils/firebase/firebase";

module.exports = async ({query: { file, type }, headers: { token, 'x-real-ip': realIp }, connection}, res) => {
	const ip = realIp || connection.remoteAddress;
	if (type === 'voicemail'){
		try {
			const presignedUrl = await getPresignedUrl(file, `${type}`, ip);
			res.status(200).json(presignedUrl);
		}catch(e){
			res.status(401).json({message: 'Unauthorized', code: 401});
		}
	}else if(type === 'pending'){
		try {
			const user = await verifyIdToken(token);
			const presignedUrl = await getPresignedUrl(file, `${type}/${user.uid}`, user.email);
			res.status(200).json(presignedUrl);
		}catch(e){
			res.status(401).json({message: 'Unauthorized', code: 401});
		}
	}else{
		res.status(400).json({message: 'Bad request', code: 400});
	}
}
