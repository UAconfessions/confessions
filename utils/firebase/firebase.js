import admin from 'firebase-admin';
import {postToFacebook} from "../facebook/facebook";
import {rebuildProject} from "../vercel/vercel";

try {
	admin.initializeApp({
		credential: admin.credential.cert({
			project_id: process.env.FIREBASE_PROJECT_ID,
			private_key: process.env.FIREBASE_PRIVATE_KEY,
			client_email: process.env.FIREBASE_CLIENT_EMAIL
		}),
		databaseURL: process.env.FIREBASE_CLIENT_DB_URL,
		storageBucket: process.env.FIREBASE_STORAGE_BUCKET
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

export const firestore = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage().bucket();

const queue = firestore.collection('queue');
const bin = firestore.collection('bin');
const confessions = firestore.collection('confessions');
const users = firestore.collection('users');

export const getPresignedUrl = async (_file) => {
	const file = storage.file(_file);
	const options = {
		expires: Date.now() + 1 * 60 * 1000, //  1 minute,
		fields: { 'x-goog-meta-test': 'data' },
	};
	const [response] = await file.generateSignedPostPolicyV4(options);
	return response;

};

export const addToQueue = async (value, parentId) => {
	const confession = {value, submitted: new Date()};
	const parent = await confessions.doc(`${parentId}`).get();
	if (parent.exists) {
		confession.parent = await firestore.doc(`confessions/${parentId}`);
	}
	const ref = await queue.add(confession);
	return ref.id;
};

export const resetItemInQueue = async (id) => {
	await queue.doc(`${id}`).update({submitted: new Date()});
};

// TODO: publish as reaction
export const publishItemFromQueue = async (hash) => {
	const confession = await queue.doc(`${hash}`).get();
	const { value } = confession.data();

	const {docs: [{id: prev_id}]} = await confessions.orderBy('id', 'desc').limit(1).get();
	const id = +prev_id + 1;
	const facebook_answer = await postToFacebook({value, id});
	await confessions.doc(`${id}`).set({ value, id, ...facebook_answer });
	await removeItemFromQueue(hash);
	await rebuildProject();
};

export const saveUnsavedPosts = async (up) => {
	const requests = up.map(({message: value, facebook_post_id, id}) => {
		confessions.doc(`${id}`).set({ value, facebook_post_id, id});
	});
	await Promise.all(requests);
};

export const removeItemFromQueue = async (id) => {
	const confession = await queue.doc(`${id}`).get();
	await bin.add(confession.data());
	await queue.doc(`${id}`).delete();
};

export const getQueuedConfession = async (id) => {
	if (id) {
		try {
			const submission = await queue.doc(`${id}`).get();
			const { value } = await submission.data();
			return { value };
		}catch(e){
			return {value:''};
		}

	}
	const {docs: [post]} = await queue.orderBy('submitted', 'asc').limit(1).get();
	return { id: post.id ,value: post.data().value};
}

export const getQueuedConfessionsAmount = () => {
	return queue.get().then(snap => snap.size);
}

export const getConfession = async id => {
	const confession = await confessions.doc(`${id}`).get();
	if (confession.exists) {
		const data = confession.data();
		return {...data, posted: data.posted?.toDate() ?? 'unknown data'};
	}
}
// TODO: pagination ( .startAfter(lastId) )
export const getConfessions = async () => {
	const posted = await confessions.orderBy('id', 'desc').limit(50).get();
	return posted.docs.map(post => post.data());
}

export const getUser = async id => {
	try {
		const user = await users.doc(`${id}`).get();
		if (user.exists) {
			return user.data();
		} else {
			// user did not exist -> create the user
			await users.doc(`${id}`).set({});
			return {};
		}
	}catch(error){
		console.log('getError:');
		console.error(error);
	}
}

export const setUserName = async (id, username) => {
	try{
		await users.doc(`${id}`).update( { name: username});
	}catch(error){
		console.error(error.code);
	}
}


export const verifyIdToken = (token) => {
	return auth
		.verifyIdToken(token)
		.catch((error) => {
			console.log('unauthorised with token: ' + token)
			throw error
		})
}


