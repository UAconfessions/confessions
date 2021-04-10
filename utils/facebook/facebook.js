import request from 'request';
import FormData from 'form-data';

export const postToFacebook = async ({value, id, url}) => {
	try{
		const message = `#${id} ${value}`;

		if (url){
			const res = await postPhoto(message, url);
			if (res.id) return {facebook_post_id: res.post_id};
			else throw res;
		}else{
			const res = await postText(message);
			if (res.id) return {facebook_post_id: res.id};
			else throw res;
		}

	}catch(error){
		console.error(error);
		return {facebook_post_error: JSON.stringify(error)};
	}
};

export const postText = (message) => execute('feed', {message});

export const postPhoto = async (caption, url) => {
	const file = await request(url);
	const imageData = new FormData();
	imageData.append('source', file);

	return execute('photos', { caption, published: true }, imageData);
}

const execute = async (endpoint, searchParams, body) => {
	const access_token = process.env.FACEBOOK_ACCESS_TOKEN;
	const url = new URL(`v10.0/${process.env.FACEBOOK_PAGE_ID}/${endpoint}`, `https://graph.facebook.com`);
	url.search = new URLSearchParams({...searchParams, access_token});

	const params = {method: 'POST'};
	if(body) params.body = body;

	return await fetch(url, params).then(res => res.json());
};
