import {
	resetItemInQueue,
	publishItemFromQueue,
	removeItemFromQueue,
	verifyIdTokenIsAdmin
} from '../../../../utils/firebase/firebase';

module.exports = async ({query: { param: [id, action], triggerWarning, help }, headers: { token }}, res) => {
	try {
		await verifyIdTokenIsAdmin(token);
	}catch(error){
		return res.status(401).json({message:'You are unauthorised.'});
	}
	try {
		switch (action) {
			case 'accept': {
				await publishItemFromQueue(id, triggerWarning, help);
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
				return res.status(400).json({error: `Action \`${action}\` has not been defined.`})
		}
	}catch(error){
		console.error(error);
		return res.status(500).json({message:'Something went wrong.'});
	}
};
