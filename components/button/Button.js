import style from './Button.module.css';

export const ICON_POSITION = {
	LEFT: 'left',
	RIGHT: 'right'
}
export const COLORS = {
	RED: { h: 0, s: 50, l: 43 },
	LIGHTBLUE: { h: 223, s: 23, l: 25 },
}

export const SIZES = {
	SMALL: style.sizeSmall,
	STRETCH: style.sizeStretch
}

const getHSLfromProp = color => {
	if (!color) return;
	if (typeof color === 'string') return COLORS[color];
	if (color.h !== undefined && color.s !== undefined && color.l !== undefined) return color;
}

const getColorVarsFromProp = color => {
	const hsl = getHSLfromProp(color);
	if (!hsl) return;
	return {
		[`--color-hue`]: hsl.h,
		[`--color-saturation`]: `${hsl.s}%`,
		[`--color-lightness`]: `${hsl.l}%`,
	}
}

export default function Button(props) {
	const {
		color,
		children,
		icon,
		iconPosition,
		disabled,
		size,
		...restProps
	} = props;

	const Wrapper = props.href && !disabled
		? props => <a {...props}  />
		: props => <button {...props}  />;

	return (
		<Wrapper
			style={getColorVarsFromProp(color)}
			className={`${style.Button} ${size}`}
			title={disabled ?? undefined}
			disabled={Boolean(disabled)}
			{...restProps}
		>
			<span className={children ? style.content : style.noContent}>
				{icon && iconPosition !== ICON_POSITION.RIGHT && (
					<span className={style.iconLeft}>{icon}</span>
				)}
				{children && <span>{children}</span>}
				{icon && iconPosition === ICON_POSITION.RIGHT && (
					<span className={style.iconRight}>{icon}</span>
				)}
			</span>
		</Wrapper>
	);
};
