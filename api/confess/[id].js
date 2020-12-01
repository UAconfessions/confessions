import {addToQueue, getConfession} from '../../firebase/firebase';
module.exports = async ({query, method, body}, res) => {
	const {id} = query;
	switch (method){
		case 'GET':
			try{
				const confession = await getConfession(id);
				return res.status(200).json(confession);
			}catch (e) {
				return res.status(404).json(e);
			}
		case 'POST':
			const { confession } = JSON.parse(body);
			await addToQueue(confession, id);
			return res.json({success: true});
		default:
			return res.status(404).json({message: `method ${method} not supported.`});
	}
};



