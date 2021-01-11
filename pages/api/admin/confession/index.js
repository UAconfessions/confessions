import {verifyIdToken, getQueuedConfession, getQueuedConfessionsAmount} from '../../../../utils/firebase/firebase'

module.exports = async ({ headers: { token }}, res) => {
	try {
		await verifyIdToken(token);
	} catch (error) {
		return res.status(401).send('You are unauthorised')
	}
	try {
		const confession = await getQueuedConfession();
		const amount = await getQueuedConfessionsAmount();
		return res.status(200).json({confession, amount});
	}catch (error){
		return res.status(404).send('no queued confessions found');
	}

};
