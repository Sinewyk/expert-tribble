import test from "tape";
import { format } from "../formatter.mjs";

test("format the game", (t) => {
	t.plan(1);

	const game = {
		width: 3,
		height: 4,
		mountains: [
			[1, 0],
			[2, 1],
		],
		treasures: [[1, 3, 2]],
		adventurers: [[0, 3, "Lara", "S", "", 3]],
	};

	t.equals(
		format(game),
		`#{C comme Carte}-{Largeur}-{Hauteur}
C-3-4

#{M comme montagne}-{Axe horizontal}-{Axe vertical}
M-1-0
M-2-1

#{T comme Trésor}-{Axe horizontal}-{Axe vertical}-{Trésors restants}
T-1-3-2

#{A comme Aventurier}-{Nom de l’aventurier}-{Axe horizontal}-{Axe vertical}-{Orientation}-{Trésors ramassés}
A-Lara-0-3-S-3
`
	);
});
