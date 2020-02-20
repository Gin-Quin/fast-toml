import { terser as minifier } from 'rollup-plugin-terser'

export default {
	input: 'src/main.js',
	plugins: [
		minifier()
	],
	output: {
		intro: '\nlet source = "", position = 0;',

		// /* target : Node
		format: 'cjs',
		file: 'dist/node/fast-toml.js',
		//*/

		/* target : Browser
		format: 'iife',
		file: 'dist/browser/fast-toml.js',
		name: 'TOML'
		// */
	}
}
