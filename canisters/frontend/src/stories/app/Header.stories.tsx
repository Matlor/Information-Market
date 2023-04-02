import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ActorContext } from "../../components/api/Context";
import Header from "../../components/app/Header";
import { Principal } from "@dfinity/principal";

export default {
	title: "app/Header",
	component: Header,
};

const loggedInUser = {
	principal: Principal.fromText("aaaaa-aa"),
};

const loggedOutUser = {
	principal: undefined,
};

const Template = (args) => (
	<BrowserRouter>
		<ActorContext.Provider value={{ user: args.user }}>
			<Header />
		</ActorContext.Provider>
	</BrowserRouter>
);

export const LoggedIn = Template.bind({});
LoggedIn.args = {
	user: loggedInUser,
};

export const LoggedOut = Template.bind({});
LoggedOut.args = {
	user: loggedOutUser,
};
