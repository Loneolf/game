export function crash(rectA, rectB) {
	rectA.left = rectA.x;
	rectA.right = rectA.x + rectA.image.width;
	rectA.top = rectA.y;
	rectA.bottom = rectA.y + rectA.image.height;
	rectB.left = rectB.x;
	rectB.right = rectB.x + rectB.image.width;
	rectB.top = rectB.y;
	rectB.bottom = rectB.y + rectB.image.height;
	if ( rectA.left >= rectB.left && rectA.left <= rectB.right && rectA.top >= rectB.top && rectA.top <= rectB.bottom ) return true;
	if ( rectA.right >= rectB.left &&rectA.right <= rectB.right &&rectA.top >= rectB.top &&rectA.top <= rectB.bottom ) return true;
	if ( rectA.left >= rectB.left &&rectA.left <= rectB.right &&rectA.bottom >= rectB.top &&rectA.bottom <= rectB.bottom ) return true;
	if ( rectA.right >= rectB.left &&rectA.right <= rectB.right &&rectA.bottom >= rectB.top &&rectA.bottom <= rectB.bottom ) return true;
	if ( rectB.left >= rectA.left && rectB.left <= rectA.right && rectB.top >= rectA.top && rectB.top <= rectA.bottom ) return true;
	if ( rectB.right >= rectA.left &&rectB.right <= rectA.right &&rectB.top >= rectA.top &&rectB.top <= rectA.bottom ) return true;
	if ( rectB.left >= rectA.left &&rectB.left <= rectA.right &&rectB.bottom >= rectA.top &&rectB.bottom <= rectA.bottom ) return true;
	if ( rectB.right >= rectA.left &&rectB.right <= rectA.right &&rectB.bottom >= rectA.top &&rectB.bottom <= rectA.bottom ) return true;
	return false;
}

export function imgFromPath(path) {
	let img = new Image();
	img.src = path;
	return img;
}

export const levels = {
	'1': [[100, 100]],
	'2': [[100, 100,], [200, 100,2]],
	'3': [[100, 100,], [200, 100,2], [300, 100, 3]],
	'4': [[100, 100,], [200, 100,2], [300, 100, 3], [100, 200, 4]],
}

// let log = console.log.bind(console)

let log = (...params) => {
	textarea.value += '\n' + params
}
window.log = log