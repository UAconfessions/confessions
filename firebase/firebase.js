import admin from 'firebase-admin';

try {
	admin.initializeApp({
		credential: admin.credential.cert({
			project_id: process.env.FIREBASE_PROJECT_ID,
			private_key: process.env.FIREBASE_PRIVATE_KEY,
			client_email: process.env.FIREBASE_CLIENT_EMAIL
		}),
		databaseURL: process.env.FIREBASE_CLIENT_DB_URL
	});
} catch (error) {
	/*
	 * We skip the "already exists" message which is
	 * not an actual error when we're hot-reloading.
	 */
	if (!/already exists/u.test(error.message)) {
		// eslint-disable-next-line no-console
		console.error('Firebase admin initialization error', error.stack);
	}
}

const firestore = admin.firestore();

export default firestore;
const queue = firestore.collection('queue');
const confessions = firestore.collection('confessions');

export const addToQueue = async (value, parentId) => {
	const confession = {value, submitted: new Date()};
	const parent = await confessions.doc(`${parentId}`).get();
	if (parent.exists) {
		confession.parent = await firestore.doc(`confessions/${parentId}`);
	}
	await queue.add(confession)
};

export const getConfession = async id => {
	const confession = await confessions.doc(`${id}`).get();
	if (confession.exists) {
		const data = confession.data();
		return {...data, posted: data.posted.toDate()};
	}
}

export const getConfessions = async () => {
	const posted = await confessions.get();
	return posted.docs.map(post => post.data());
}
