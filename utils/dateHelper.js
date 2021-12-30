const months = [
	'januarie',
	'februarie',
	'maart',
	'april',
	'mei',
	'juni',
	'juli',
	'augustus',
	'september',
	'oktober',
	'november',
	'december',
]

export const dateStringToReadable = dateString => {
	const date = new Date(dateString);
	const day = date.getDate();
	const month = months[date.getMonth()];
	const year = date.getFullYear();
	return `${day} ${month} ${year}`;
}
