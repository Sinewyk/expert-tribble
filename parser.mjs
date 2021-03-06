import assert from "assert";
import * as R from "ramda";

export function parse(input) {
	// I'm not using typescript, but i'm still using these assert to both fail fast and hard
	// AND get typehint assist to develop faster because I narrowed the type
	assert(typeof input === "string", "input must be a string");

	const game = {};

	input.split("\n").forEach((line, line_nb) => {
		switch (line[0]) {
			case "C":
				// Scope by cases, not only new scope in the switch
				{
					const regex = /^C-(\d+)-(\d+)/g;
					const matches = regex.exec(line);

					if (matches === null) {
						throw_format_error(line, line_nb);
					}

					const width = parseInt(matches[1], 10);
					const height = parseInt(matches[2], 10);

					game.width = width;
					game.height = height;

					game.mountains = [];
					game.treasures = [];
					game.adventurers = [];
				}
				break;

			case "M":
				{
					const regex = /^M-(\d+)-(\d+)/g;
					const matches = regex.exec(line);

					if (matches === null) {
						throw_format_error(line, line_nb);
					}

					const mountain = [parseInt(matches[1], 10), parseInt(matches[2], 10)];
					game.mountains?.push(mountain);
				}
				break;

			case "T":
				{
					const regex = /^T-(\d+)-(\d+)-(\d+)/g;
					const matches = regex.exec(line);

					if (matches === null) {
						throw_format_error(line, line_nb);
					}

					const treasure = [
						parseInt(matches[1], 10),
						parseInt(matches[2], 10),
						parseInt(matches[3], 10),
					];
					game.treasures?.push(treasure);
				}
				break;

			case "A":
				{
					// Careful, O and not W for West/Ouest
					const regex = /^A-(\w+)-(\d+)-(\d+)-(N|S|E|O)-((?:A|D|G)+)$/g;
					const matches = regex.exec(line);

					if (matches === null) {
						throw_format_error(line, line_nb);
					}

					// pseudo type
					// [x, y, name, orientation, parcours]
					const adventurer = [
						parseInt(matches[2], 10),
						parseInt(matches[3], 10),
						matches[1],
						matches[4],
						matches[5],
						0, // treasure
					];
					game.adventurers?.push(adventurer);
				}
				break;

			default:
				// Ignore the rest
				break;
		}
	});

	if (!game.width || !game.height) {
		throw new Error(`Input file should at least have a valid "C-x-y" entry`);
	}

	// [1, 2] => '1,2' , quick position check
	const position_string = R.map((adv) => R.join(",", R.take(2, adv)));

	// Adventurers can't be on another adventurer, or on a mountain
	const positions = [
		...position_string(game.adventurers),
		...position_string(game.mountains),
	];

	if (positions.length !== R.uniq(positions).length) {
		throw new Error(
			`Input file is invalid, adventurers are on each other or on mountains`
		);
	}

	if (
		!R.all(([x, y]) => x >= 0 && x < game.width && y >= 0 && y < game.height, [
			...game.adventurers,
			...game.treasures,
			...game.mountains,
		])
	) {
		throw new Error(`Entities are not inside the map constraints`);
	}

	return game;
}

function throw_format_error(line, line_nb) {
	throw new Error(`Format error line ${line_nb}: ${line}`);
}
