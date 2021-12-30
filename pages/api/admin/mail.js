import {verifyIdTokenIsAdmin} from "../../../utils/firebase/firebase";
import sgMail from '@sendgrid/mail';

module.exports = async ({ headers: { token }, body }, res) => {
	// maybe switch to https://www.mailgun.com in the future?
	try {
		await verifyIdTokenIsAdmin(token);
		sgMail.setApiKey(process.env.SENDGRID_API_KEY);
		const msg = {
			from: {
				email: 'admin@confessions.link',
				name: 'UAntwerpen Confessions'
			},
			...body
		};
		try {
			const sgRes = await sgMail.send(msg);
			return res.status(200).json({success: true, response: sgRes});
		}catch(error){
			return res.status(500).json(error);
		}
	} catch (error) {
		return res.status(401).json({message:'You are unauthorised.'});
	}
};
