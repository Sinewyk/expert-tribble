// Difficult to live without Algebraic Data Types anymore (Option/Result) and such ...
// So let's do a pseudo ADT Result right there
// Function will still throw ... but encapsulate the end via [bool, next_game_state]
// I'll probably rework this later ... first make it work, then make it better
export function tick(game) {
	// Game is ended when there are no adventurers that need to move
	if (game_has_ended(game)) {
		return [true, game];
	}

	const next_game = { ...game };

	next_game.adventurers = next_game.adventurers.map((adventurer) =>
		tick_adventurer(adventurer, next_game)
	);

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

	// @TODO consider mountains and treasure

	switch (next_instruction) {
		case "A":
			switch (direction) {
				case "N":
					y2 = Math.max(0, y - 1);
					break;
				case "S":
					y2 = Math.min(game.height - 1, y + 1);
					break;
				case "E":
					x2 = Math.min(game.width - 1, x + 1);
					break;
				case "O":
					x2 = Math.max(0, x - 1);
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

	return [x2, y2, name, direction2, instructions_as_array.join(""), treasures2];
}
