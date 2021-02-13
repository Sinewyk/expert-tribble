export function format(game) {
	return `#{C comme Carte}-{Largeur}-{Hauteur}
C-${game.width}-${game.height}

#{M comme montagne}-{Axe horizontal}-{Axe vertical}
${game.mountains
	.map((mountain) => `M-${mountain[0]}-${mountain[1]}`)
	.join("\n")}

#{T comme Trésor}-{Axe horizontal}-{Axe vertical}-{Trésors restants}
${game.treasures
	.map((treasure) => `T-${treasure[0]}-${treasure[1]}-${treasure[2]}`)
	.join("\n")}

#{A comme Aventurier}-{Nom de l’aventurier}-{Axe horizontal}-{Axe vertical}-{Orientation}-{Trésors ramassés}
${game.adventurers
	.map(
		(adventurer) =>
			`A-${adventurer[2]}-${adventurer[0]}-${adventurer[1]}-${adventurer[3]}-${adventurer[5]}`
	)
	.join("\n")}
`;
}
