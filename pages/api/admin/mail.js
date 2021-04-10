import {verifyIdTokenIsAdmin} from "../../../utils/firebase/firebase";
import sgMail from '@sendgrid/mail';

module.exports = async ({ headers: { token }, body }, res) => {
	try {
		await verifyIdTokenIsAdmin(token);
		sgMail.setApiKey(process.env.SENDGRID_API_KEY);
		const msg = {
			from: 'admin@confessions.link',
			...body
		};
		try {
			const sgRes = await sgMail.send(msg);
			return res.status(200).json({success: true, response: sgRes});
		}catch(error){
			return res.status(501).json(error);
		}
	} catch (error) {
		return res.status(401).json({message:'You are unauthorised.'});
	}
};
