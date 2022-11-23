export {};

declare global {
	interface Window {
		ic: any;
	}
}
beforeEach(() => {
	cy.viewport(1280, 800);
});

describe("spec.cy.js", async () => {
	it("should work", () => {
		cy.visit("", {
			onBeforeLoad(win) {
				const user =
					"tsm3f-vuuza-xfy3b-wcbrx-r4nzg-jy6o2-ydpbq-67lqa-rgq6j-ijkaa-aqe";
				win.ic = {
					plug: {
						principalId: user,
						requestConnect: () => {
							console.log("requestConnect");
							return 0;
						},
						fetchRootKey: () => {
							console.log("fetchRootKey");
							return 0;
						},
						createActor: (canisterId: any, interfaceFactory: any) => {
							console.log("create actor hit");
							return {};
						},
					},
				};
			},
		});

		cy.wait(1000);
	});
});
