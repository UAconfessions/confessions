export const removeNullish = obj =>
	Object.fromEntries(Object.entries(obj)
			.filter(([, value]) => value != undefined
	));
