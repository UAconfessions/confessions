import { verifyIdToken, getQueuedConfession } from '../../../../utils/firebase/firebase'

module.exports = async ({ headers: { token }}, res) => {
	try {
		await verifyIdToken(token);
	} catch (error) {
		return res.status(401).send('You are unauthorised')
	}
	try {
		const confession = await getQueuedConfession();
		return res.status(200).json({confession});
	}catch (error){
		return res.status(404).send('no queued confessions found');
	}

};
