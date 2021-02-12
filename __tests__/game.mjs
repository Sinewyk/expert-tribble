import test from "tape";

import { parse } from "../parser.mjs";
import { tick, run_game, tick_adventurer } from "../game.mjs";

const fake_game = {
	width: 4,
	height: 4,
};

test("tick a simple game", (t) => {
	t.plan(2);

	const game = parse("C-3-4");
	const [ended, next_game] = tick(game);

	t.deepEqual(
		next_game,
		{
			width: 3,
			height: 4,
			mountains: [],
			treasures: [],
			adventurers: [],
		},
		"next game state is equal to previous"
	);
	t.true(ended, "game is ended");
});

test("tick with adventurers", (t) => {
	t.plan(2);

	const game = parse(`C-3-4
A-A1-0-0-S-A
A-A2-0-0-N-A
A-A3-0-0-E-A
A-A4-0-0-O-A
A-A5-0-0-S-D
A-A6-0-0-N-G`);
	const [ended, next_game] = tick(game);

	t.deepEqual(
		next_game,
		{
			width: 3,
			height: 4,
			mountains: [],
			treasures: [],
			adventurers: [
				[0, 1, "A1", "S", "", 0],
				[0, 0, "A2", "N", "", 0],
				[1, 0, "A3", "E", "", 0],
				[0, 0, "A4", "O", "", 0],
				[0, 0, "A5", "O", "", 0],
				[0, 0, "A6", "O", "", 0],
			],
		},
		"adventurers move around"
	);
	t.true(ended, "game is ended");
});

test("tick with adventurers", (t) => {
	t.plan(1);

	const game = parse(`C-3-4
A-A1-0-0-S-AG
A-A2-0-0-N-AD
A-A3-0-0-E-AG
A-A4-0-0-O-AD
A-A5-0-0-S-GA
A-A6-0-0-N-DA`);
	const end_game = run_game(game);

	t.deepEqual(
		end_game,
		{
			width: 3,
			height: 4,
			mountains: [],
			treasures: [],
			adventurers: [
				[0, 1, "A1", "E", "", 0],
				[0, 0, "A2", "E", "", 0],
				[1, 0, "A3", "N", "", 0],
				[0, 0, "A4", "N", "", 0],
				[1, 0, "A5", "E", "", 0],
				[1, 0, "A6", "E", "", 0],
			],
		},
		"adventurers move around"
	);
});

test("tick adventurers", (t) => {
	const testing = [
		// boundaries
		[
			[0, 0, "foo", "N", "A", 0],
			[0, 0, "foo", "N", "", 0],
		],
		[
			[0, 0, "foo", "O", "A", 0],
			[0, 0, "foo", "O", "", 0],
		],
		[
			[3, 3, "foo", "S", "A", 0],
			[3, 3, "foo", "S", "", 0],
		],
		[
			[3, 3, "foo", "E", "A", 0],
			[3, 3, "foo", "E", "", 0],
		],

		// simple_move
		[
			[1, 1, "foo", "S", "A", 0],
			[1, 2, "foo", "S", "", 0],
		],
		[
			[1, 1, "foo", "O", "A", 0],
			[0, 1, "foo", "O", "", 0],
		],
		[
			[1, 1, "foo", "N", "A", 0],
			[1, 0, "foo", "N", "", 0],
		],
		[
			[1, 1, "foo", "E", "A", 0],
			[2, 1, "foo", "E", "", 0],
		],

		// turn right
		[
			[1, 1, "foo", "S", "D", 0],
			[1, 1, "foo", "O", "", 0],
		],
		[
			[1, 1, "foo", "O", "D", 0],
			[1, 1, "foo", "N", "", 0],
		],
		[
			[1, 1, "foo", "N", "D", 0],
			[1, 1, "foo", "E", "", 0],
		],
		[
			[1, 1, "foo", "E", "D", 0],
			[1, 1, "foo", "S", "", 0],
		],

		// turn left
		[
			[1, 1, "foo", "O", "G", 0],
			[1, 1, "foo", "S", "", 0],
		],
		[
			[1, 1, "foo", "S", "G", 0],
			[1, 1, "foo", "E", "", 0],
		],
		[
			[1, 1, "foo", "E", "G", 0],
			[1, 1, "foo", "N", "", 0],
		],
		[
			[1, 1, "foo", "N", "G", 0],
			[1, 1, "foo", "O", "", 0],
		],
	];

	t.plan(testing.length);

	testing.forEach((test_case) => {
		t.deepEqual(tick_adventurer(test_case[0], fake_game), test_case[1]);
	});
});
