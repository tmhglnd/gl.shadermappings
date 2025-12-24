
const fs = require('fs');
const path = require('path');

let appPath = '/Applications/Max.app';
let shaderPath = 'Contents/Resources/C74/media/jitter/shaders/';

if (process.argv.length > 2){
	appPath = process.argv[2];
}
let loadPath = path.join(appPath, shaderPath);
let mappings = '';

loadFolder(loadPath);

function loadFolder(p){
	fs.readdirSync(p).forEach((f) => {
		let fPath = path.join(p, f);
		if (fs.lstatSync(fPath).isDirectory()){
			loadFolder(fPath);
		} else {
			let file = path.parse(fPath);
			let b = file.base;
			let n = file.name;
			let t = n.split('.')[0];
			let o;
			
			if (t.match(/cc|co|cf|gn|hdr|mrt|ssao|op|tp|td|tr/)){
				n = 'jit.gl.slab.' + n.replace(/^[^.]+\./g, '');
				o = 'jit.gl.slab';
			} else {
				n = 'jit.gl.shader.' + n.replace(/^[^.]+\./g, '');
				o = 'jit.gl.shader';
			}
			mappings += `max objectfile ${n} ${n};\n`;
			mappings += `max definesubstitution ${n} ${o} @file ${b};\n\n`;
		}
	});
}
// console.log(mappings);
fs.writeFileSync('init/gl-objectmappings.txt', mappings, 'utf-8');