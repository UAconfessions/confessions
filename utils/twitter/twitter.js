const OAuth = require('oauth');

const splitIntoTweets = (message) => {
	const blocks = message.match(/(.*\n*)?/g).filter(Boolean);
	const wordTree = blocks.map((block, blockIndex) =>
		block.match(/([^.!?]*[.!?\s])/g)
			?.map(sentence =>
				sentence?.match?.(/([^,]*[,.!?\s])/g)
					.map(section => section?.match(/([^\s]*[,.!?\s])/g))
			)
	);

	const maxLenght = 280 - ` xx/xx`.length;
	// TODO: URL's
	// TODO: calculate the maxlength dynamically
	const maxStringLenghtReducer = (sections, block) => {
		if (!sections.length) return [block];
		const lastSection = sections.slice(-1);
		const rest = sections.slice(0, -1);
		if ((lastSection + block).length <= maxLenght) {
			return [
				...rest,
				lastSection + block
			];
		}
		return [
			...sections,
			block
		];
	};

	const recursiveMaxStringLengthReducer = (acc, item) => {
		if (typeof item === 'string') return maxStringLenghtReducer(acc, item);
		const flattenedItem = item.reduce(recursiveMaxStringLengthReducer, []);
		if (flattenedItem.length > 1) return [...acc, ...flattenedItem];
		return maxStringLenghtReducer(acc, flattenedItem[0]);
	};
	const tweets = wordTree.reduce(recursiveMaxStringLengthReducer, [])
		.map(tweet => tweet.trim()).filter(Boolean);

	return tweets;
}

export const postToTwitter = async ({value, id, url, triggerWarning, help}) => {
	try{
		const message = `#${id} ${value}`;
		if (url){
			// TODO: implement twitter photo upload
		}else{
			const res = await postText(message);
			if (res[0].id) return {twitter_post_id: res[0].id };
			else throw res;
		}

	}catch(error){
		console.error(error);
		return { twitter_post_error: error };
	}
};

export const postText = async (status) => {
	const tweets = splitIntoTweets(status);
	let responses = [];

	for (let i = 0; i < tweets.length; i++) {
		const tweet = tweets[i];
		if (!responses[0]) {
			responses = [await execute('statuses/update.json', {status: tweet})];
			continue;
		}
		if (!responses[0].id) throw(responses[0]); // previous fetch failed
		responses = [
			await execute('statuses/update.json', {
				status: `@${responses[0].user.screen_name} ${tweet}`, // mentioning the user you are replying to doesn't count towards the char limit.
				in_reply_to_status_id: responses[0].id_str
			}),
			...responses
		];
	}
	return responses;
}

// export const postPhoto = async (caption, url) => {
// 	const file = await request(url);
// 	const imageData = new FormData();
// 	imageData.append('source', file);
//
// 	return execute('photos', { caption, published: true }, imageData);
// }

const execute = async (endpoint, searchParams, body) => {
	const access_token = process.env.FACEBOOK_ACCESS_TOKEN;
	const url = new URL(`1.1/${endpoint}`, `https://api.twitter.com`);
	url.search = new URLSearchParams({...searchParams})

	const oauth = new OAuth.OAuth(
		'https://api.twitter.com/oauth/request_token',
		'https://api.twitter.com/oauth/access_token',
		process.env.TWITTER_API_KEY,
		process.env.TWITTER_API_KEY_SECRET,
		'1.0A',
		null,
		'HMAC-SHA1'
	);
	return await new Promise((resolve, reject) => {
		// oauth.post(
		// 	url.href,
		// 	process.env.TWITTER_ACCESS_TOKEN, //test user token
		// 	process.env.TWITTER_ACCESS_TOKEN_SECRET, //test user secret
		// 	undefined,
		// 	undefined,
		// 	function (e, data, res){
		// 		if (e) {
		// 			JSON.parse(e.data).errors.forEach(({code, message}) => {
		// 				switch (code) {
		// 					case 186:
		// 						return; // try again with a shorter message
		// 					default:
		// 						return; // we do not know this error code, log it
		// 				}
		// 			});
		// 			return reject(e)
		// 		}else{
		// 			resolve(JSON.parse(data))
		// 		}
		//
		// 	}
		// );

	});

};


