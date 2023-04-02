import React from "react";

// fix the settings icon
// only allow for specific sizes (for this I need tailwind config)
// maybe use this:         preserveAspectRatio="xMidYMid meet"

// TODO:
// On Icon
// Sort Icon composition
// Improve Link icon
// Loading thing add here and not as separate component (maybe?)
// Logo here as well
// Settings Icon
// Passing tailwind colors does not work
// Maybe add another wrapper for the this stuff
/* 
width={size}
height={size}
viewBox="0 0 14 16"
fill={fillColor}
stroke={borderColor}
strokeWidth={strokeWidth}
strokeLinecap="round"
strokeLinejoin="round"

*/

interface IconProps {
	size?: number;
	fillColor?: string;
	borderColor?: string;
	strokeWidth?: number;
}

/* const IconWrapper = (IconComponent) => {
	const WrappedIcon = ({
		size = 200,
		fillColor = "none",
		borderColor = "black",
		strokeWidth = 0.8,
		...props
	}: IconProps) => {
		return (
			<IconComponent
				size={size}
				fillColor={fillColor}
				borderColor={borderColor}
				strokeWidth={strokeWidth}
				{...props}
			/>
		);
	};
	return WrappedIcon;
}; */

const defaultSize = 20;
const defaultFillColor = "none";
const defaultBorderColor = "black";
const defaultStrokeWidth = 0.8;

export const BellIcon = ({
	size = defaultSize,
	fillColor = defaultFillColor,
	borderColor = defaultBorderColor,
	strokeWidth = defaultStrokeWidth,
}: IconProps) => {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 14 16"
			fill={fillColor}
			stroke={borderColor}
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M8.36133 14.3024C8.24071 14.5145 8.06759 14.6907 7.85929 14.8131C7.651 14.9356 7.41484 15 7.17446 15C6.93408 15 6.69792 14.9356 6.48963 14.8131C6.28133 14.6907 6.10821 14.5145 5.98759 14.3024M11.2908 5.20074C11.2908 4.08664 10.8571 3.01816 10.0851 2.23037C9.31317 1.44258 8.26617 1 7.17446 1C6.08275 1 5.03575 1.44258 4.26379 2.23037C3.49183 3.01816 3.05815 4.08664 3.05815 5.20074C3.05815 10.1016 1 11.5019 1 11.5019H13.3489C13.3489 11.5019 11.2908 10.1016 11.2908 5.20074Z" />
		</svg>
	);
};

export const ClockIcon = ({
	size = defaultSize,
	fillColor = defaultFillColor,
	borderColor = defaultBorderColor,
	strokeWidth = defaultStrokeWidth,
}: IconProps) => {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 16 16"
			xmlns="http://www.w3.org/2000/svg"
		>
			{/* Clock face (circle) */}
			<path
				d="M0.999997 8.00001C0.999997 11.866 4.134 15 8 15C11.866 15 15 11.866 15 8.00001C15 4.13402 11.866 1.00001 8 1.00001C4.134 1.00001 0.999997 4.13402 0.999997 8.00001Z"
				fill={fillColor}
				stroke={borderColor}
				strokeWidth={strokeWidth}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			{/* Clock hands */}
			<path
				d="M10.36 8.55077H7.63778V4.6619"
				fill="none"
				stroke={borderColor}
				strokeWidth={strokeWidth}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export const SearchIcon = ({
	size = defaultSize,
	fillColor = defaultFillColor,
	borderColor = defaultBorderColor,
	strokeWidth = defaultStrokeWidth,
}: IconProps) => {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 18 18"
			fill={fillColor}
			stroke={borderColor}
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path
				d="M12.8725 12.7659L17 17M13.6456 7.67798C13.6456 11.3661 10.8148 14.356 7.32279 14.356C3.83081 14.356 1 11.3661 1 7.67798C1 3.98983 3.83081 1 7.32279 1C10.8148 1 13.6456 3.98983 13.6456 7.67798Z"
				fill={fillColor}
				stroke={borderColor}
				strokeWidth={strokeWidth}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export const AnswerIcon = ({
	size = defaultSize,
	fillColor = defaultFillColor,
	borderColor = defaultBorderColor,
	strokeWidth = defaultStrokeWidth,
}: IconProps) => {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 17 16"
			fill={fillColor}
			stroke={borderColor}
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path
				d="M6.26345 1C3.35653 1 1 3.35653 1 6.26345C1 9.17037 3.35653 11.5269 6.26345 11.5269H6.81682L6.79175 15L10.7251 11.5269H11.1339C14.0409 11.5269 16.3974 9.17037 16.3974 6.26345C16.3974 3.35653 14.0409 1 11.1339 1H6.26345Z"
				fill={fillColor}
				stroke={borderColor}
				strokeWidth={strokeWidth}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

// TODO: somehow this looks not coherent to the others
export const SettingsIcon = ({
	size = defaultSize,
	fillColor = defaultFillColor,
	borderColor = defaultBorderColor,
	strokeWidth = defaultStrokeWidth,
}: IconProps) => {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 14 14"
			fill={fillColor}
			stroke={borderColor}
			strokeWidth={strokeWidth}
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M1.75 0C2.7165 -4.2247e-08 3.5 0.783502 3.5 1.75C3.5 2.7165 2.7165 3.5 1.75 3.5C0.783502 3.5 4.2247e-08 2.7165 0 1.75C-4.2247e-08 0.783502 0.783502 4.2247e-08 1.75 0Z"
				fill={fillColor}
				stroke={borderColor}
				strokeWidth={strokeWidth}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M1.75 5.25C2.7165 5.25 3.5 6.0335 3.5 7C3.5 7.9665 2.7165 8.75 1.75 8.75C0.783502 8.75 4.2247e-08 7.9665 0 7C-4.2247e-08 6.0335 0.783502 5.25 1.75 5.25Z"
				fill={fillColor}
				stroke={borderColor}
				strokeWidth={strokeWidth}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M1.75 10.5C2.7165 10.5 3.5 11.2835 3.5 12.25C3.5 13.2165 2.7165 14 1.75 14C0.783502 14 4.2247e-08 13.2165 0 12.25C-4.2247e-08 11.2835 0.783502 10.5 1.75 10.5Z"
				fill={fillColor}
				stroke={borderColor}
				strokeWidth={strokeWidth}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

/* 
import React from "react";

// TODO: correct color
const Settings = () => {
	return (
		<div data-cy="settings" className="self-center ">
			<svg
				width="4"
				height="20"
				viewBox="0 0 4 20"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<circle
					cx="2"
					cy="10"
					r="2"
					transform="rotate(-90 2 10)"
					fill="#0F1318"
				/>
				<circle
					cx="2"
					cy="18"
					r="2"
					transform="rotate(-90 2 18)"
					fill="#0F1318"
				/>
				<circle
					cx="2"
					cy="2"
					r="2"
					transform="rotate(-90 2 2)"
					fill="#0F1318"
				/>
			</svg>
		</div>
	);
};

*/

export const ArrowIcon = ({
	size = defaultSize,
	fillColor = defaultFillColor,
	borderColor = defaultBorderColor,
	strokeWidth = defaultStrokeWidth,
}: IconProps) => {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 9 16"
			fill={fillColor}
			stroke={borderColor}
			strokeWidth={strokeWidth}
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M1.00015 15L7.95557 8L1.00015 1"
				fill={fillColor}
				stroke={borderColor}
				strokeWidth={strokeWidth}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export const CrossIcon = ({
	size = defaultSize,
	fillColor = defaultFillColor,
	borderColor = defaultBorderColor,
	strokeWidth = defaultStrokeWidth,
}: IconProps) => {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 16 16"
			fill={fillColor}
			stroke={borderColor}
			strokeWidth={strokeWidth}
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M1 1.00003L15 15M1 15L15 1"
				fill={fillColor}
				stroke={borderColor}
				strokeWidth={strokeWidth}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export const TriangleIcon = ({
	size = defaultSize,
	fillColor = defaultFillColor,
	borderColor = defaultBorderColor,
	strokeWidth = defaultStrokeWidth,
}: IconProps) => {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 12 12"
			fill={fillColor}
			stroke={borderColor}
			strokeWidth={strokeWidth}
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M10.7952 0.626019L5.63449 6.59998C5.63435 6.59999 5.6342 6.59999 5.63405 6.6L0.47336 0.626019L10.7952 0.626019Z"
				fill={fillColor}
				stroke={borderColor}
				strokeWidth={strokeWidth}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export const SortIcon = ({
	size,
	fillColor1,
	fillColor2,
	borderColor,
	strokeWidth,
}) => {
	return (
		<div className="flex flex-col gap-1 w-max">
			<div className="rotate-180">
				<TriangleIcon
					size={size}
					fillColor={fillColor2}
					borderColor={borderColor}
					strokeWidth={strokeWidth}
				/>
			</div>
			<TriangleIcon
				size={size}
				fillColor={fillColor1}
				borderColor={borderColor}
				strokeWidth={strokeWidth}
			/>
		</div>
	);
};

export const OnIcon = ({
	size = defaultSize,
	fillColor = defaultFillColor,
	borderColor = defaultBorderColor,
	strokeWidth = defaultStrokeWidth,
}: IconProps) => {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 16 16"
			fill={fillColor}
			stroke={borderColor}
			strokeWidth={0}
			xmlns="http://www.w3.org/2000/svg"
		>
			<svg
				width="16"
				height="16"
				viewBox="0 0 16 16"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8Z"
					fill={borderColor}
				/>
				<path
					d="M10.7422 8.37109C10.7422 9.68061 9.68061 10.7422 8.37109 10.7422C7.06157 10.7422 6 9.68061 6 8.37109C6 7.06157 7.06157 6 8.37109 6C9.68061 6 10.7422 7.06157 10.7422 8.37109Z"
					fill={fillColor}
				/>
			</svg>
		</svg>
	);
};

export const OngoingIcon = ({
	size = defaultSize,
	fillColor = defaultFillColor,
	borderColor = defaultBorderColor,
	strokeWidth = defaultStrokeWidth,
}: IconProps) => {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 16 16"
			fill={fillColor}
			stroke={borderColor}
			strokeWidth={strokeWidth}
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M15.0262 7.12336C14.8118 5.58067 14.0961 4.15126 12.9894 3.05532C11.8828 1.95938 10.4464 1.25771 8.90172 1.05839C7.35701 0.859076 5.78961 1.17317 4.44098 1.95229C3.09234 2.73142 2.03728 3.93235 1.43832 5.37009M1 1.86354V5.37009H4.50655M1 8.87664C1.21439 10.4193 1.93005 11.8487 3.03674 12.9447C4.14344 14.0406 5.57977 14.7423 7.12448 14.9416C8.66918 15.1409 10.2366 14.8268 11.5852 14.0477C12.9339 13.2686 13.9889 12.0677 14.5879 10.6299M15.0262 14.1365V10.6299H11.5196"
				fill={fillColor}
				stroke={borderColor}
				strokeWidth={strokeWidth}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export const ClosedIcon = ({
	size = defaultSize,
	fillColor = defaultFillColor,
	borderColor = defaultBorderColor,
	strokeWidth = defaultStrokeWidth,
}: IconProps) => {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 16 16"
			fill={fillColor}
			stroke={borderColor}
			strokeWidth={strokeWidth}
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M5.66667 8L7.22222 9.55556L10.3333 6.44444M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8Z"
				fill={fillColor}
				stroke={borderColor}
				strokeWidth={strokeWidth}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export const LinkIcon = ({
	size = defaultSize,
	fillColor = defaultFillColor,
	borderColor = defaultBorderColor,
	strokeWidth = defaultStrokeWidth,
}: IconProps) => {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 16 16"
			fill={fillColor}
			stroke={borderColor}
			strokeWidth={strokeWidth}
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M8.89947 12.4092C8.02624 12.4246 7.12631 12.6257 6.50791 13.2424L5.86337 13.8852C5.36385 14.3809 4.69022 14.6589 3.98833 14.6589C3.28645 14.6589 2.61281 14.3809 2.11329 13.8852C1.86977 13.6409 1.67657 13.3507 1.54475 13.0312C1.41293 12.7118 1.34507 12.3693 1.34507 12.0234C1.34507 11.6775 1.41293 11.3351 1.54475 11.0156C1.67657 10.6961 1.86977 10.4059 2.11329 10.1616L5.24281 7.04189C5.74233 6.54613 6.41596 6.26815 7.11785 6.26815C7.81973 6.26815 8.49337 6.54613 8.99288 7.04189C9.2504 7.29912 9.45023 7.60746 9.58031 7.94616C9.62333 8.05815 9.76422 8.10075 9.84032 8.008C10.3561 7.49346 10.5162 6.68064 10.0178 6.14928C9.99024 6.11989 9.96222 6.09092 9.93374 6.06236C9.18417 5.31669 8.17229 4.89844 7.11785 4.89844C6.0634 4.89844 5.05152 5.31669 4.30195 6.06236L1.16577 9.20893C0.796362 9.57751 0.503169 10.016 0.303089 10.499C0.103009 10.9821 0 11.5001 0 12.0234C0 12.5467 0.103009 13.0648 0.303089 13.5478C0.503169 14.0308 0.796362 14.4693 1.16577 14.8379C1.91533 15.5835 2.92721 16.0018 3.98166 16.0018C5.03611 16.0018 6.04799 15.5835 6.79755 14.8379L8.99685 12.6448C9.08393 12.5579 9.02243 12.4092 8.89947 12.4092Z"
				fill={fillColor}
				stroke={borderColor}
				strokeWidth={strokeWidth}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M14.8337 1.17736C14.8377 1.16934 14.8361 1.15964 14.8297 1.15334C14.0812 0.414296 13.0739 0 12.0245 0C10.97 0 9.95813 0.41825 9.20856 1.16392L7.00454 3.36175C6.91921 3.44684 6.97947 3.59262 7.09998 3.59262C7.97696 3.5924 8.88434 3.39843 9.50531 2.77916L10.1427 2.14345C10.6423 1.64769 11.3159 1.36971 12.0178 1.36971C12.7197 1.36971 13.3933 1.64769 13.8928 2.14345C14.1363 2.38775 14.3295 2.67794 14.4614 2.99741C14.5932 3.31688 14.661 3.65936 14.661 4.00523C14.661 4.35111 14.5932 4.69358 14.4614 5.01306C14.3295 5.33253 14.1363 5.62272 13.8928 5.86701L10.7633 8.98675C10.2638 9.48251 9.59015 9.76048 8.88827 9.76048C8.18639 9.76048 7.51275 9.48251 7.01323 8.98675C6.75259 8.72639 6.55104 8.41368 6.4211 8.07013C6.37904 7.95894 6.24354 7.9101 6.15912 7.9938C5.64338 8.50834 5.48325 9.32116 5.98164 9.85252C6.0092 9.88191 6.03723 9.91088 6.0657 9.93944C6.81527 10.6851 7.82715 11.1034 8.8816 11.1034C9.93605 11.1034 10.9479 10.6851 11.6975 9.93944L14.827 6.8197C15.1956 6.45067 15.4881 6.01207 15.6877 5.52909C15.8872 5.0461 15.99 4.52824 15.99 4.00523C15.99 3.48222 15.8872 2.96436 15.6877 2.48138C15.49 2.00301 15.2012 1.56819 14.8376 1.20137C14.8313 1.19502 14.8297 1.18537 14.8337 1.17736Z"
				fill={fillColor}
				stroke={borderColor}
				strokeWidth={strokeWidth}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};
