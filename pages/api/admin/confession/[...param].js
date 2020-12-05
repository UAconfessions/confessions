import {resetItemInQueue, verifyIdToken, publishItemFromQueue, removeItemFromQueue} from '../../../../utils/firebase/firebase';

module.exports = async ({query: { param: [id, action] }, headers: { token }}, res) => {
	try {
		await verifyIdToken(token);
	}catch(error){
		return res.status(401).send('You are unauthorised')
	}
	try {
		switch (action) {
			case 'accept': {
				await publishItemFromQueue(id);
				return res.status(200).json({});
			} // post to facebook now
			case 'reject': {
				await removeItemFromQueue(id);
				return res.status(200).json({});
			} // remove from queue
			case 'archive': {
				await resetItemInQueue(id);
				return res.status(200).json({});
			} // change date to now
			//case 'schedule': return res.status(200).json({}); // post to facebook at time
			//case 'respond': return res.status(200).json({}); // post to facebook and post reaction as admin
			//case 'shedule_and_respond': return res.status(200).json({}); // post to facebook at time and post reaction as admin
			default:
				return res.status(400).json({error: `action \`${action}\` has not been defined.`})
		}
	}catch(error){
		console.error(error);
		return res.status(500).send('Something went wrong');
	}
};
