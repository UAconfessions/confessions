const monthLUT = {
	'01': 'januarie',
	'02': 'februarie',
	'03': 'maart',
	'04': 'april',
	'05': 'mei',
	'06': 'juni',
	'07': 'juli',
	'08': 'augustus',
	'09': 'september',
	'10': 'oktober',
	'11': 'november',
	'12': 'december',
};

export const dateStringToReadable = date => {

	return `${date.substr(8, 2)} ${monthLUT[date.substr(5, 2)]} ${date.substr(0, 4)}`;
}
