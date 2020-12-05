export default function fetcher(url, token ) {
	return fetch(url, {
		method: 'GET',
		headers: new Headers({'Content-Type': 'application/json', token}),
		credentials: 'same-origin',
	}).then((res) => res.json());
}
