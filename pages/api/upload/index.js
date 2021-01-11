import {getPresignedUrl} from "../../../utils/firebase/firebase";

module.exports = async (req, res) => {
	try {
	const presignedUrl = await getPresignedUrl(req.query.file)
	res.status(200).json(presignedUrl);
	}catch(e){
		res.status(500).json({error: e});
	}

}
