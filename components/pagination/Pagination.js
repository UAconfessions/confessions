import style from './Pagination.module.css';

export default function Pagination(props) {
	const {
		page,
		pages,
		setPage,
		leading,
		trailing,
		around
	} = props;

	if (page >= pages) setPage(pages - 1);
	const totalButtons = leading + 1 + around + 1 + around + 1 + trailing;

	const renderButton = (pageIndex) => (
		<button
			key={pageIndex}
			onClick={() => setPage(pageIndex)}
			className={page === pageIndex ? style.selected : ''}
		>
			{pageIndex + 1}
		</button>
	);
	const renderEllipsis = (type) => (<span key={`ellipsis-${type}`} className={style.ellipsis}>· · ·</span>);

	return (
		<div className={style.container} data-selected={page}>
			<button
				className={style.arrow}
				onClick={() => setPage(page - 1)} disabled={page === 0}
				key={'back'}
			>
				{'<'}
			</button>
			{(pages <= totalButtons) && ([...Array(pages)].map((_, i) => renderButton(i)))}
			{(pages > totalButtons) && ([...Array(totalButtons)].map((_, i) => {

				if (i < leading) return renderButton(i);
				if (i === leading){
					if (page <= leading + around + 1) return renderButton(i);
					return renderEllipsis('begin');
				}
				if (i >= totalButtons - trailing){
					return renderButton((pages - trailing) + i - (totalButtons - trailing));
				}
				if (i === totalButtons - trailing - 1){
					if (page >= pages - trailing - around - 2) return renderButton((pages - trailing) + i - (totalButtons - trailing));
					return renderEllipsis('end');
				}
				if (page <= leading + 1 + around){
					return renderButton(i);
				}
				if (page >= pages - (trailing + 1 + around)){
					return renderButton(pages - (trailing + 1 + around + 1 + around) + (i - leading - 1));
				}
				return renderButton((i  - leading - 1) + page - around);
			}))}

			<button
				className={style.arrow}
				onClick={() => setPage(page + 1)}
				disabled={page === pages - 1}
				key={'forward'}
			>
				{'>'}
			</button>
		</div>
	);
};
