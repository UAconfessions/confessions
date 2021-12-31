import {
	getQueuedConfession,
	getQueuedConfessionsAmount,
	verifyIdTokenIsAdmin
} from '../../../../utils/firebase/firebase'

module.exports = async ({ headers: { token }}, res) => {
	try {
		await verifyIdTokenIsAdmin(token);
	} catch (error) {
		return res.status(401).json({message:'You are unauthorised.'});
	}
	try {
		const confession = await getQueuedConfession();
		const amount = await getQueuedConfessionsAmount();
		return res.status(200).json({confession, amount});
	}catch (error){
		return res.status(500).json({
			message: 'Something went wrong while fetching the queued confessions.',
			error: error.message
		});
	}
};
