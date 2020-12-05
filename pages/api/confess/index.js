import { addToQueue } from '../../../utils/firebase/firebase';

module.exports = async ({query, body}, res) => {
	try {
		const {confession} = body;
		const id = await addToQueue(confession);
		return res.json({id});
	}catch(error){
		console.error(error);
		return res.status(500).json({error: 'something went wrong'});
	}
};
