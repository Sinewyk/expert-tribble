import process from "process";
import { readFileSync } from "fs";
import { parse } from "./parser.mjs";
import { run_game_smart } from "./game.mjs";
import { format } from "./formatter.mjs";

const entry = process.argv[2] || "./input1.txt";

// Fail fast
const input = readFileSync(entry, { encoding: "utf-8" });

const game = parse(input);

console.log("Input:");
console.log(input);

const end_state = run_game_smart(game);

console.log("Output:");
console.log(format(end_state));
