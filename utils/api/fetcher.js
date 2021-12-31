export default function fetcher(url, token) {
	return fetch(`${location.origin}/${url}`, {
		method: 'GET',
		headers: new Headers({'Content-Type': 'application/json', token}),
		credentials: 'same-origin',
	}).then(async (res) => {
		if(res.ok) return res.json();
		throw { http: res.status, ...(await res.json()) };
	});
}
