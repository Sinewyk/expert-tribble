import test from "tape";
import { parse } from "../parser.mjs";

test("parse a valid input", (t) => {
	t.plan(1);

	const game = parse(`
C-3-4
M-1-0
M-2-1
T-0-3-2
T-1-3-3
A-Lara-1-1-S-AADADAGGA
`);

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
		adventurers: [[1, 1, "Lara", "S", "AADADAGGA", 0]],
	});
});

test("throw on invalid input", (t) => {
	t.plan(1);

	t.throws(() => {
		parse(`
#foo
#bar
			`);
	});
});

test("throw on invalid input, adventurers same position", (t) => {
	t.plan(1);

	t.throws(() => {
		parse(`
C-3-4
M-1-0
M-2-1
T-0-3-2
T-1-3-3
A-Lara-1-1-S-AADADAGGA
A-Lara-1-1-S-AADADAGGA
			`);
	});
});

test("throw on invalid input, adventurer on mountain", (t) => {
	t.plan(1);

	t.throws(() => {
		parse(`
C-3-4
M-1-0
A-Lara-1-0-S-AADADAGGA
			`);
	});
});

test("throw on invalid input, adventurers outside map", (t) => {
	t.plan(1);

	t.throws(() => {
		parse(`
C-1-1
A-Lara-1-1-S-A
`);
	}, "entity outside map constraints");
});

// It's not invalid, it's just stupid, nothing happens ^^
test("parse an incomplete input", (t) => {
	t.plan(1);

	const game = parse(`C-1-1`);

	t.deepEqual(game, {
		width: 1,
		height: 1,
		mountains: [],
		treasures: [],
		adventurers: [],
	});
});
