export default {
	input: 'src/main.js',
	plugins: [
		require('rollup-plugin-butternut')()
	],
	output: {
		intro: '\nlet source = "", position = 0;',

		/* target : Node
		format: 'cjs',
		file: 'package/fast-toml.js',
		//*/
		
		///* target : Browser
		format: 'iife',
		file: 'browser/fast-toml.js',
		name: 'TOML'
		// */
	}
}
