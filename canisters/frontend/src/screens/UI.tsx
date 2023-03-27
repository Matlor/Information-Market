import React from "react";
import {
	DefaultButton,
	ArrowButton,
	StagesButton,
} from "../components/core/Button";
import {
	SelectedTag,
	WinnerTag,
	RewardTag,
	StyledReward,
} from "../components/core/Tag";
import { Profile } from "../components/core/Profile";
import { TimeLeft, TimeStamp } from "../components/question/Time";
import { Principal } from "@dfinity/principal";
import {
	SearchIcon,
	/* IconPaginationDec,
	IconPaginationInc, */
	IconArrowUpDown,
	IconButtonArrowRight,
	IconAnswers,
	IconDate,
	IconInfinity,
	ArrowIcon,
	DownArrowIcon,
	LinkIcon,
	NavigationSettingsIcon,
	NavigationProfileIcon,
	NavigationNotificationIcon,
	NavigationAddIcon,
	TimeIcon,
	ArrowSmall,
	FilterIcon,
	AnswersIcon,
	OnIcon,
	OngoingIcon,
	/* ClosedIcon, */
	ClearIcon,
} from "../components/core/Icons";

import Sort from "../components/browseQuestion/Sort";
import OpenToggle from "../components/browseQuestion/OpenToggle";

import RoundedCheckox from "../components/core/RoundedCheckbox";
import Loading from "../components/core/Loading";
import Divider from "../components/question/Divider";
import Menu from "../components/question/Menu";
import Settings from "../components/question/Settings";
import Solution from "../components/question/Solution";
import Logo from "../components/app/Logo";
import Filter from "../components/browseQuestion/Sort";
import NumAnswers from "../components/browseQuestion/NumAnswers";
import Pagination from "../components/browseQuestion/Pagination";
import Search from "../components/browseQuestion/Search";

const Layout = ({ children }) => {
	return <div className="my-20">{children}</div>;
};

const Row = ({ children }) => {
	return (
		<div className="flex items-center gap-10 mb-10 border-[0.5px] border-colorLines justify-start">
			{children}
		</div>
	);
};

const UI = () => {
	return (
		<Layout>
			<Row>
				{/* BUTTONS */}
				<div>
					<DefaultButton
						propFunction={() => {
							console.log("hit");
						}}
						text="press"
					/>
				</div>
				<div>
					<ArrowButton
						propFunction={() => {
							console.log("hit");
						}}
						text="press"
					/>
				</div>
				<div>
					<StagesButton
						propFunction={() => {
							console.log("hit");
						}}
						text="press"
						customLoader={<div>custom loader</div>}
					/>
				</div>
			</Row>

			<Row>
				{/* TAGS */}

				<div>
					<SelectedTag />
				</div>
				<div>
					<WinnerTag reward={2.3} />
				</div>
				<div>
					<RewardTag reward={2.3} />
				</div>
				<div>
					<StyledReward reward={2.3} />
				</div>
			</Row>

			<Row>
				{/* TIME */}
				<div className="">
					<TimeLeft minutes={Math.floor(Date.now() / 1000) / 60 + 2} />
				</div>

				<div>
					<TimeStamp minutes={Math.floor(Date.now() / 1000) / 60 - 2} />
				</div>
			</Row>

			<Row>
				<Profile
					principal={Principal.fromText("2vxsx-fae")}
					name="Peter"
					minutes={Math.floor(Date.now() / 1000) / 60 - 2}
				/>
			</Row>

			<Row>
				<div>
					<SearchIcon />
				</div>
				{/* <div>
					<IconPaginationDec />
				</div>
				<div>
					<IconPaginationInc />
				</div> */}
				<div>
					<IconArrowUpDown />
				</div>

				{/* <div>
					<IconAnswers />
				</div> */}

				{/* <div>
					<IconInfinity />
				</div> */}
				<div>
					<ArrowIcon />
				</div>
				<div>
					<DownArrowIcon />
				</div>
				<div>
					<LinkIcon />
				</div>
			</Row>
			<Row>
				{/* <div>
					<NavigationSettingsIcon />
				</div> */}
				<div>
					<NavigationProfileIcon />
				</div>
				<div>
					<NavigationNotificationIcon />
				</div>
				<div>
					<NavigationAddIcon />
				</div>
				<div>
					<TimeIcon />
				</div>
				<div>
					<ArrowSmall />
				</div>
				{/* <div>
					<FilterIcon />
				</div> */}
				<div>
					<AnswersIcon />
				</div>
				<div>
					<OnIcon />
				</div>
				<div>
					<OngoingIcon />
				</div>
				{/* 	<div>
					<ClosedIcon />
				</div> */}
				<div>
					<ClearIcon />
				</div>
			</Row>

			<Row>
				<div>
					<RoundedCheckox isChecked={true} />
				</div>
			</Row>

			<Row>
				<div>
					<Loading />
				</div>
			</Row>

			<Row>
				<div>
					<OpenToggle
						checks={{
							status: {
								pickanswer: true,
								disputable: true,
								arbitration: true,
								payout: true,
								closed: true,
							},
						}}
					/>
				</div>
				<div>
					<Sort
						order={{
							order: {
								orderBy: "REWARD",
								orderDirection: "ASCD",
							},
						}}
					/>
				</div>
			</Row>
			<Row>
				<div className="bg-colorIcon resize-x">oeirfnornfonf3o4in</div>
			</Row>
		</Layout>
	);
};

export default UI;
