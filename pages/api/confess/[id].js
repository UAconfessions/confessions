import {addToQueue, getConfession, verifyIdToken} from '../../../utils/firebase/firebase';

module.exports = async ({query: { id }, method, body, headers: { token }}, res) => {
	switch (method){
		case 'GET':
			try{
				const confession = await getConfession(id);
				return res.status(200).json(confession);
			}catch (e) {
				return res.status(404).json(e);
			}
		case 'POST':
			let user = null;
			if (token){
				try{
					user = await verifyIdToken(token);
				}catch(e){}
			}
			const {confession, filename, help, triggerWarning} = body;
			const newId = await addToQueue(confession, id, filename, user?.uid, { help, triggerWarning });
			return res.json({id: newId});
		default:
			return res.status(404).json({message: `method ${method} not supported.`});
	}
};



