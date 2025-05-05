export const LegalStatusName = (statusCode: string) => {
	const status = legalStatuses.filter((status) => status.code === statusCode);

	if (status.length !== 1) return 'Unknown';
	return status[0].value;
};

type Status = {
	value: string;
	code: string;
};

export const legalStatuses: Status[] = [
	{
		code: 'S37',
		value: 'Homeless',
	},
	{
		code: 'S76',
		value: 'Looked After Child - Voluntarily Accommodated',
	},
	{
		code: 'S76',
		value: 'Looked After Child - Via a Care Order',
	},
	{
		code: 'S104',
		value: 'Careleavers',
	},
	{
		code: '0000',
		value: 'Unknown',
	},
];
