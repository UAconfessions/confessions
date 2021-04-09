import {
	getArchivedConfessions,
	verifyIdTokenIsAdmin
} from '../../../utils/firebase/firebase'

module.exports = async ({ headers: { token }}, res) => {
	try {
		await verifyIdTokenIsAdmin(token);
	} catch (error) {
		return res.status(401).json({message:'You are unauthorised'});
	}
	try {
		const confessions = await getArchivedConfessions();
		return res.status(200).json({confessions});
	}catch (error){
		return res.status(404).json({message:'no archived confessions found'});
	}

};
