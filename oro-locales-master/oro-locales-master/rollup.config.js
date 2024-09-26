
import copy from "rollup-plugin-copy";
export default {
	input: 'src/empty.js',
	output: {
		dir: 'build'
	},
  plugins: [
    copy({
      targets: [
        { src: 'src/locales', dest: 'build/' }
      ],
      verbose: true
    })
  ]
};