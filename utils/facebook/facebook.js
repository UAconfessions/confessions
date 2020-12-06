export const postToFacebook = async ({value, id}) => {
	try{
		const message = `#${id} ${value}`;
		const { id } =  await request('feed', {message});
		return {facebook_post_id: id};
	}catch(error){
		console.error(error);
		return {facebook_post_error: JSON.stringify(error)};
	}
};

const request = async (endpoint, searchParams) => {
	const access_token = process.env.FACEBOOK_ACCESS_TOKEN;
	const url = new URL(`v9.0/${process.env.FACEBOOK_PAGE_ID}/${endpoint}`, `https://graph.facebook.com`);
	url.search = new URLSearchParams({...searchParams, access_token});
	return await fetch(url,{method: 'POST'}).then(res => res.json());
};
