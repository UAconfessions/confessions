import {verifyIdToken, setUserName, getUser} from '../../../utils/firebase/firebase';

module.exports = async ({ method, headers: { token }, body }, res) => {
	try {
		const user = await verifyIdToken(token);
		if(method === 'GET') {
			const u = await getUser(user.email);
			if (u) return res.status(200).json({user: u});

		}
		if(method === 'POST'){
			const {username} = body;
			await setUserName(user.email, username);
			return res.status(200).json({success: true});
		}
		return res.status(500).send('someting went wrong');
	} catch (error) {
		return res.status(401).send('You are unauthorised');
	}
};
