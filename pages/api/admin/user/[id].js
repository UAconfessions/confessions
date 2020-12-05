import { verifyIdToken, getUser, setUserName } from '../../../../utils/firebase/firebase';

module.exports = async ({ method, headers: { token }, query: { id }, body }, res) => {
	try {
		await verifyIdToken(token);
		if(method === 'GET') {
			const user = await getUser(id);
			if (user) return res.status(200).json({user});

		}
		if(method === 'POST'){
			const {username} = body;
			await setUserName(id, username);
			return res.status(200).json({success: true});
		}
		return res.status(500).send('someting went wrong');
	} catch (error) {
		return res.status(401).send('You are unauthorised');
	}

};
