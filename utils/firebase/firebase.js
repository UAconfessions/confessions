import admin from 'firebase-admin';
import { postToFacebook } from "../facebook/facebook";
import { rebuildProject } from "../vercel/vercel";
import { removeNullish } from "../objectHelper";
// import {postToTwitter} from "../twitter/twitter";

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

export const addToQueue = async (value, parentId, filename, user, extras) => {
	const confession = {
		value,
		submitted: new Date(),
		archived: false,
		...extras,
		user,
		filename,
	};
	const parent = await confessions.doc(`${parentId}`).get();
	if (parent.exists) {
		confession.parent = await firestore.doc(`confessions/${parentId}`);
	}
	const ref = await queue.add(removeNullish(confession));
	return ref.id;
};

export const resetItemInQueue = async (id) => {
	await queue.doc(`${id}`).update({archived: true});
};

// TODO: publish as reaction
export const publishItemFromQueue = async (hash, triggerWarning, help) => {
	const confession = await queue.doc(`${hash}`).get();

	const { value, filename, user, submitted, poll } = confession.data();

	const post = {
		value,
		poll,
		triggerWarning,
		help
	};

	if(filename){
		post.url = getDownloadableUrl(filename, `pending/${user}`);
	}

	const { docs: [{ id: prev_id }] } = await confessions.orderBy('id', 'desc').limit(1).get();
	post.id = +prev_id + 1;

	const facebook_answer = await postToFacebook(post);
	// const twitter_answer = await postToTwitter(removeNullish(post));
	const twitter_answer = {};

	await confessions.doc(`${post.id}`).set(removeNullish({ value, id: post.id, ...facebook_answer, ...twitter_answer, submitted, posted: new Date(), triggerWarning, help, poll }));

	await bin.doc(`${hash}`).set({ ...confession.data(), id: post.id, handled: new Date() });
	await queue.doc(`${hash}`).delete();

	await rebuildProject();
};

export const saveUnsavedPosts = async (up) => {
	// TODO: fetch comments, reactions

	const requests = up.map((confession) => {
		confessions.doc(`${confession.id}`).set(removeNullish(confession));
	});
	return await Promise.all(requests);
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
			const { value, filename, user, submitted, id: postId, handled } = submission.data();

			if (postId) return await getConfession(postId);

			const confession = { value, submitted: submitted?.toDate()?.toISOString() ?? 'unknown data', handled: handled?.toDate()?.toISOString() ?? 'unknown data' };
			if(filename){
				confession.url = getDownloadableUrl(filename, `pending/${user}`);
			}

			return confession;
		}

	}
	const {docs: [post]} = await queue.where('archived', '==', false).orderBy('submitted', 'asc').limit(1).get();

	if(!post?.exists) return null;
	return convertConfession(post, 'queue');
}

export const getArchivedConfessions = async () => {
	const {docs} = await queue.where('archived', '==', true).orderBy('submitted', 'asc').get();
	return Promise.all(docs?.map(post => convertConfession(post, 'queue')));
}

export const getQueuedConfessionsAmount = () => {
	return queue.where('archived', '==', false).get().then(snap => snap.size);
}

const REACTIONS = ['LIKE', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY'];
const convertConfession = async (post, source) => {

	const { filename, user, poll, ...confession } = post.data();


	const getUrl = (filename, user) => {
		if (!filename || !user) return null;
		return getDownloadableUrl(filename, `pending/${user}`);
	}

	const getPoll = (poll, fetchReactions = true) => {
		if (!(poll?.options?.length >= 2)) return null;
		poll = poll.options.map(option => ({ option }));
		if (!confession.facebook_post_id || !fetchReactions) return poll;

		poll = Promise.all(poll.map(({ option }, index) => {
			if (!option || option.trim() === '') return {};
			return fetch(`https://graph.facebook.com/v12.0/${confession.facebook_post_id}?fields=reactions.type(${REACTIONS[index]}).summary(total_count)&access_token=${process.env.FACEBOOK_ACCESS_TOKEN}`)
				.then(res => res.json())
				.then(res => ({
					option,
					reaction: res?.reactions?.summary?.total_count ?? null
				}));
		}));
		return poll;
	}
	if (source === 'queue') {
		return removeNullish({
			...confession,
			queueId: post.id,
			poll: await getPoll(poll, false),
			url: getUrl(filename, user),
			submitted: confession.submitted?.toDate()?.toISOString() ?? null
		});
	}

	return removeNullish({
		...confession,
		poll: await getPoll(poll),
		url: getUrl(filename, user),
		posted: confession.posted?.toDate()?.toISOString() ?? null,
		submitted: confession.submitted?.toDate()?.toISOString() ?? null,
		handled: confession.handled?.toDate()?.toISOString() ?? null
	});
};

export const getConfession = async id => {
	const post = await confessions.doc(`${id}`).get();
	if (!post?.exists) return null;
	return convertConfession(post)
}

export const getConfessions = async (amount = 50, cursor) => {
	let posts;
	if (cursor) {
		posts = await confessions.orderBy('id', 'desc').startAt(cursor).limit(amount).get();
	} else {
		posts = await confessions.orderBy('id', 'desc').limit(amount).get();
	}
	return Promise.all(posts.docs.map(convertConfession));
}

export const getBinnedConfessions = async (amount = 50) => {
	const unfiltered = await bin.orderBy('submitted', 'desc').limit(amount).get();
	return Promise.all(unfiltered.docs.map(convertConfession));
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
		const { uid } = await auth.verifyIdToken(token);
		return await auth.getUser(uid);
	}catch(error){
		throw error;
	}
}

export const verifyIdTokenIsAdmin = async (token) => {
	const userFromToken = await verifyIdToken(token);
	const userData = await getUser(userFromToken.email);
	if (!userData.isAdmin) throw new Error('User `' + userFromToken.email + '` is not an Admin.');
}


