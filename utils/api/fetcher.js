export default function fetcher(url, token ) {
	return fetch(url, {
		method: 'GET',
		headers: new Headers({'Content-Type': 'application/json', token}),
		credentials: 'same-origin',
	}).then((res) => {
		if(res.ok) return res.json();
		console.log(res);
		throw {code: res.status, message: res.json()};
	});
}
