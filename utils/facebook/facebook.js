export const postToFacebook = async ({value, id, url}) => {
	try{
		const message = `#${id} ${value}`;

		if (url){
			const res = await postPhoto(message, url);
			console.log({res, url});
			return {facebook_post_id: undefined};
		}
		const { id: facebook_post_id } = await postText(message);
		return {facebook_post_id};

	}catch(error){
		console.error(error);
		return {facebook_post_error: JSON.stringify(error)};
	}
};

export const postText = (message) => request('feed', {message});

export const postPhoto = (caption, url) => request('photos', { url, caption, published: true });

const request = async (endpoint, searchParams) => {
	const access_token = process.env.FACEBOOK_ACCESS_TOKEN;
	const url = new URL(`v10.0/${process.env.FACEBOOK_PAGE_ID}/${endpoint}`, `https://graph.facebook.com`);
	url.search = new URLSearchParams({...searchParams, access_token});
	return await fetch(url,{method: 'POST'}).then(res => res.json());

};
