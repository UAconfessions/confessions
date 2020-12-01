import {addToQueue} from '../firebase/firebase';

module.exports = async ({query, body}, res) => {
	const { confession } = JSON.parse(body);
	await addToQueue(confession);
	return res.json({success: true});
};
