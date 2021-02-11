const test = require("tape");

(async function () {
	const { parse } = await import("../parser.mjs");

	test("parse a valid input", (t) => {
		t.plan(1);

		const input = `
C-3-4
M-1-0
M-2-1
T-0-3-2
T-1-3-3
A-Lara-1-1-S-AADADAGGA
`;

		const game = parse(input);

		t.deepEqual(game, {
			width: 3,
			height: 4,
			mountains: [
				[1, 0],
				[2, 1],
			],
			treasures: [
				[0, 3, 2],
				[1, 3, 3],
			],
			adventurers: [[1, 1, "Lara", "S", "AADADAGGA"]],
		});
	});

	test("throw on invalid input", (t) => {
		t.plan(1);

		const input = `
#foo
#bar`;

		t.throws(() => {
			parse(input);
		});
	});

	// It's not invalid, it's just stupid, nothing happens ^^
	test("parse an incomplete input", (t) => {
		t.plan(1);

		const input = `C-1-1`;

		const game = parse(input);

		t.deepEqual(game, {
			width: 1,
			height: 1,
			mountains: [],
			treasures: [],
			adventurers: [],
		});
	});
})().catch((e) => {
	console.error(e);
});
