export default {
	input: 'src/main.js',
	plugins: [
		require('rollup-plugin-butternut')()
	],
	output: {
		file: 'package/fast-toml.js',
		intro: '\nlet source = "", position = 0;',
		format: 'cjs',
		compact: true
	}
}
