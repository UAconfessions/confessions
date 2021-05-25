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

export const getPresignedUrl = async (_file, folder, userId) => {
	const file = storage.file(`${folder}/${_file}`);
	const validMinutes = 1; //  1 minute
	const options = {
		expires: Date.now() + validMinutes * 60 * 1000,
	};
	if (userId){
		options.fields = { 'x-goog-meta-user': userId };
	}
	const [response] = await file.generateSignedPostPolicyV4(options);
	return response;

};

export const getDownloadableUrl = (fileName, folder) => {
	const path = folder ? `${folder}/${fileName}` : `${fileName}`;
	return `https://firebasestorage.googleapis.com/v0/b/confessions-61611.appspot.com/o/${path.split('/').join('%2F')}?alt=media`;
};

export const listFiles = async () => {
	return storage.getFiles();
};

export const addToQueue = async (value, parentId, filename, user) => {
	const confession = {value, submitted: new Date(), archived: false};
	if (user) confession.user = user;
	if (filename) confession.filename = filename;
	const parent = await confessions.doc(`${parentId}`).get();
	if (parent.exists) {
		confession.parent = await firestore.doc(`confessions/${parentId}`);
	}
	const ref = await queue.add(confession);
	return ref.id;
};

export const resetItemInQueue = async (id) => {
	await queue.doc(`${id}`).update({archived: true});
};

// TODO: publish as reaction
export const publishItemFromQueue = async (hash) => {
	const confession = await queue.doc(`${hash}`).get();

	const { value, filename, user, submitted } = confession.data();

	const post = {
		value
	};

	if(filename){
		post.url = getDownloadableUrl(filename, `pending/${user}`);
	}

	const { docs: [{ id: prev_id }] } = await confessions.orderBy('id', 'desc').limit(1).get();
	post.id = +prev_id + 1;

	const facebook_answer = await postToFacebook(post);

	await confessions.doc(`${post.id}`).set({ value: post.value, id: post.id, ...facebook_answer, submitted, posted: new Date() });

	await bin.doc(`${hash}`).set({...confession.data(), id: post.id, handled: new Date()});
	await queue.doc(`${hash}`).delete();

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
	await bin.doc(`${id}`).set({...confession.data(), handled: new Date()});
	await queue.doc(`${id}`).delete();
};

export const getQueuedConfession = async (id) => {
	if (id) {
		try {
			const submission = await queue.doc(`${id}`).get();
			const { value, filename, user, submitted } = submission.data();
			const confession = { value, submitted: submitted?.toDate()?.toISOString() ?? 'unknown data' };
			if(filename){
				confession.url = getDownloadableUrl(filename, `pending/${user}`);
			}
			return confession;
		}catch(e){
			const submission = await bin.doc(`${id}`).get();
			const { value, filename, user, submitted, id: postId } = submission.data();

			if (postId) return await getConfession(postId);

			const confession = { value, submitted: submitted?.toDate()?.toISOString() ?? 'unknown data' };
			if(filename){
				confession.url = getDownloadableUrl(filename, `pending/${user}`);
			}

			return confession;
		}

	}
	try{
		const {docs: [post]} = await queue.where('archived', '==', false).orderBy('submitted', 'asc').limit(1).get();

		if(!post?.exists) throw new Error('No queued confessions');

		const {value, filename, user, submitted} = post.data();
		const confession = { queueId: post.id , value, submitted: submitted?.toDate()?.toISOString() ?? 'unknown data' };
		if(filename){
			confession.url = getDownloadableUrl(filename, `pending/${user}`);
		}
		return confession;
	}catch(e){
		throw(e);
	}


}

export const getArchivedConfessions = async () => {
	try{
		const {docs} = await queue.where('archived', '==', true).orderBy('submitted', 'asc').get();

		return docs?.map(post => {
			const {value, filename, user, submitted} = post.data();
			const confession = {queueId: post.id, value, submitted: submitted?.toDate()?.toISOString() ?? 'unknown data'}
			if (filename) {
				confession.url = getDownloadableUrl(filename, `pending/${user}`);
			}
			return confession;
		});
	}catch(e){
		console.log(e);
		throw(e);
	}
}

export const getQueuedConfessionsAmount = () => {
	return queue.where('archived', '==', false).get().then(snap => snap.size);
}

export const getConfession = async id => {
	const confession = await confessions.doc(`${id}`).get();
	if (confession.exists) {
		const data = confession.data();
		return {
			...data,
			posted: data.posted?.toDate()?.toISOString() ?? 'unknown data',
			submitted: data.submitted?.toDate()?.toISOString() ?? 'unknown data'
		};
	}
}
// TODO: pagination ( .startAfter(lastId) )
export const getConfessions = async (amount = 50) => {
	const posted = await confessions.orderBy('id', 'desc').limit(amount).get();
	return posted.docs.map(post => {
		const confession = post.data();
		return {
			...confession,
			posted: confession.posted?.toDate()?.toISOString() ?? 'unknown data',
			submitted: confession.submitted?.toDate()?.toISOString() ?? 'unknown data'
		}
	});
}

export const getBinnedConfessions = async () => {
	const unfiltered = await bin.orderBy('submitted', 'desc').limit(200).get();
	return unfiltered.docs.map(post => {
		const { value, user, filename } = post.data();
		if(filename){
			const url = getDownloadableUrl(filename, `pending/${user}`);
			return {value, url};
		}
		return {value};
	});
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


export const verifyIdToken = async (token) => {
	try{
		const decodedToken = await auth.verifyIdToken(token);
		const uid = decodedToken.uid;
		return await auth.getUser(uid);
	}catch(error){
		console.log('unauthorised with token: ' + token)
		throw error;
	}
}

export const verifyIdTokenIsAdmin = async (token) => {
	try{
		const userFromToken = await verifyIdToken(token);
		const userData = await getUser(userFromToken.email);
		if (!userData.isAdmin) throw new Error('User `' + userFromToken.email + '` is not an Admin.');
		return true;
	}catch(error){
		console.log(error);
		throw error;
	}
}


