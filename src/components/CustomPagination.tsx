import React, { useMemo } from 'react';

/** Extracts the logic required for pagination.
 * Accepts a configuration object with two required properties:
 *
 * count (number) the number of items in the paginated list
 *
 * take (number) the number of items per page
 *
 * Note: 'count' and 'take' get passed through to avoid having to declare them
 * in the outer scope. This is entirely optional, though.
 */

export const usePagination = (config: { take: number; count: number }) => {
	const [currentPage, setCurrentPage] = React.useState(1);
	const [count, setCount] = React.useState(config.count);
	const { take } = config;

	const pageCount = useMemo(() => Math.ceil(count / take), [count, take]);
	const isLastPage = currentPage >= pageCount;
	const isFirstPage = currentPage === 1;

	const handlePaginate = (page: number) => {
		if (!isFirstPage && page < currentPage) setCurrentPage(page);
		if (!isLastPage && page > currentPage) setCurrentPage(currentPage + 1);
	};

	const skip = take * (currentPage - 1);

	return {
		currentPage,
		pageCount,
		handlePaginate,
		isLastPage,
		isFirstPage,
		setCount,
		setCurrentPage,
		skip,
		take,
		count,
	};
};

export default usePagination;
