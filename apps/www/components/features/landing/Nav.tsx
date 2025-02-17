import React from "react";
import LoginButton from "www/components/login-button";
import { Button } from "www/components/ui/button";
import { SidebarTrigger } from "www/components/ui/sidebar";
import ThemeToggle from "www/components/ui/theme-toggle";

const Nav = ({ sidebar = true }: { sidebar?: boolean }) => {
	return (
		<div className="flex justify-between w-full my-4 px-4">
			{" "}
			{sidebar && <SidebarTrigger />} <ThemeToggle />
			<LoginButton />
		</div>
	);
};

export default Nav;
