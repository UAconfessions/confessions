import {addToQueue, verifyIdToken} from '../../../utils/firebase/firebase';

module.exports = async ({query, body, headers: { token }}, res) => {
	let user = null;
	if (token){
		try{
			user = await verifyIdToken(token);
		}catch(e){}
	}
	try {
		const {confession, filename} = body;
		const id = await addToQueue(confession, null, filename, user?.uid);
		return res.json({id});
	}catch(error){
		console.error(error);
		return res.status(500).json({error: 'something went wrong'});
	}
};
