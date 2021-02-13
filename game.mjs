import * as R from "ramda";

// Difficult to live without Algebraic Data Types anymore (Option/Result) and such ...
// So let's do a pseudo ADT Result right there
// Function will still throw ... but encapsulate the end via [bool, next_game_state]
// I'll probably rework this later ... first make it work, then make it better
export function tick(game) {
	const next_game = {
		...game,
		// I'm going to have to mutate it in place
		// so make a copy of it to not have surprises
		adventurers: [...game.adventurers],
		// I also anticipate mutating the treasures, so ...
		treasures: [...game.treasures],
	};

	next_game.adventurers.forEach((adventurer, index, arr) => {
		const adventurer2 = tick_adventurer(adventurer, next_game);
		// mutate in place
		// each next iteration will already see results of the previous
		arr[index] = adventurer2;
	});

	return [game_has_ended(next_game), next_game];
}

// Naive implementation, no tail recursion, stack may explode if we go too deep
export function run_game(game) {
	const [ended, next_game] = tick(game);
	if (ended) {
		return next_game;
	}
	return run_game(next_game);
}

export function game_has_ended(game) {
	if (game.adventurers?.some(adventurer_still_has_instructions)) {
		return false;
	}
	return true;
}

export function adventurer_still_has_instructions(adventurer) {
	const [_, __, ___, ____, instructions] = adventurer;
	return instructions.length !== 0;
}

export function tick_adventurer(adventurer, game) {
	const [x, y, name, direction, instructions, treasures] = adventurer;
	const instructions_as_array = [...instructions];

	let x2 = x,
		y2 = y,
		direction2 = direction,
		treasures2 = treasures;

	const next_instruction = instructions_as_array.shift();

	const pos_array = R.map(R.pipe(R.take(2), R.join(",")), [
		...game.adventurers,
		...game.mountains,
	]);

	const is_obstructed = (next_pos) => R.indexOf(next_pos, pos_array) !== -1;

	let temp;

	switch (next_instruction) {
		case "A":
			switch (direction) {
				case "N":
					temp = Math.max(0, y - 1);
					if (is_obstructed(`${x},${temp}`)) {
						break;
					}
					y2 = temp;
					break;
				case "S":
					temp = Math.min(game.height - 1, y + 1);
					if (is_obstructed(`${x},${temp}`)) {
						break;
					}
					y2 = temp;
					break;
				case "E":
					temp = Math.min(game.width - 1, x + 1);
					if (is_obstructed(`${temp},${y}`)) {
						break;
					}
					x2 = temp;
					break;
				case "O":
					temp = Math.max(0, x - 1);
					if (is_obstructed(`${temp},${y}`)) {
						break;
					}
					x2 = temp;
					break;
				default:
					throw new Error("unreachable");
			}
			break;
		case "D":
			switch (direction) {
				case "N":
					direction2 = "E";
					break;
				case "S":
					direction2 = "O";
					break;
				case "E":
					direction2 = "S";
					break;
				case "O":
					direction2 = "N";
					break;
				default:
					throw new Error("unreachable");
			}
			break;
		case "G":
			switch (direction) {
				case "N":
					direction2 = "O";
					break;
				case "S":
					direction2 = "E";
					break;
				case "E":
					direction2 = "N";
					break;
				case "O":
					direction2 = "S";
					break;
				default:
					throw new Error("unreachable");
			}
			break;
		default:
			throw new Error("unreachable");
	}

	// pick up treasures only when moving
	if (next_instruction === "A") {
		let found = R.find(([x, y]) => x === x2 && y === y2, game.treasures);
		if (found) {
			found[2]--;
			treasures2++;

			game.treasures = game.treasures.filter(([_, __, nb]) => nb !== 0);
		}
	}

	return [x2, y2, name, direction2, instructions_as_array.join(""), treasures2];
}
