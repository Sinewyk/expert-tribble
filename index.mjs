import process from "process";
import { readFileSync } from "fs";
import { parse } from "./parser.mjs";

const entry = process.argv[2] || "./input1.txt";

// Fail fast
const input = readFileSync(entry, { encoding: "utf-8" });

const game = parse(input);