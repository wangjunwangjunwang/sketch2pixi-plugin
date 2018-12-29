
// 获取hex里面的alpha
exports.getAlphaFromHex = (hex) => {
	hex = hex.replace(/^#/, '');
	let alpha = 1;

	if (hex.length === 8) {
		alpha = parseInt(hex.slice(6, 8), 16) / 255;
	}

	return alpha
}

// 去除alpha
exports.getColor = (hex) => {
	let color = ''
	hex = hex.replace(/^#/, '')
	if (hex.length === 8) {
		color = hex.slice(0, 6)
	}

	return '0x' + color
}

// rgb to hex
exports.rgb2hex = (red, green, blue, alpha) => {
	red = parseInt(red * 255)
	green = parseInt(green * 255)
	blue = parseInt(blue * 255)
	const isPercent = (red + (alpha || '')).toString().includes('%');

	if (typeof alpha === 'number') {
		if (!isPercent && alpha >= 0 && alpha <= 1) {
			alpha = Math.round(255 * alpha);
		} else if (isPercent && alpha >= 0 && alpha <= 100) {
			alpha = Math.round(255 * alpha / 100);
		} else {
			throw new TypeError(`Expected alpha value (${alpha}) as a fraction or percentage`);
		}
		alpha = (alpha | 1 << 8).toString(16).slice(1);
	} else {
		alpha = '';
	}

	let rgb = ((blue | green << 8 | red << 16) | 1 << 24).toString(16).slice(1) + alpha
	return '0x' + rgb
}