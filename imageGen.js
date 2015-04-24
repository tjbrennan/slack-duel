var gm = require('gm');
var randomWord = require('random-word');

module.exports = function (req, res) {
	var h = 75;
	var w = 400;
	var bg = '#ffffff';
	var color = '#00009f';


	function image (width, height, bgColor, textColor, text) {
		gm(w, h, bgColor)
			.fontSize(35)
			.fill(textColor)
			.drawText(20, h-20, text)
			.stream('png', function (error, stdout, stderr) {
				stdout.pipe(res);
			})
	}

	return image(w, h, bg, color, randomWord());
}
