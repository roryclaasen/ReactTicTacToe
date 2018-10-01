const NO_SECTORS = 9;
const NO_CELLS = 9;
const NO_IN_ROW = 3;

function CalculateWinner(cells) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (let i = 0; i < lines.length; i += 1) {
		const [a, b, c] = lines[i];
		if (cells[a] !== -1 && cells[a] === cells[b] && cells[a] === cells[c]) {
			return cells[a];
		}
	}
	return null;
}

module.exports = {
	NO_SECTORS,
	NO_CELLS,
	NO_IN_ROW,
	CalculateWinner
};
