module.exports = function(grunt){
	grunt.initConfig({
		pkg:grunt.file.readJSON('package.json'),
		concat:{
            picker: {
                src:['src/intro.js','src/lib.js','src/index.js','src/outro.js'],
                template:['template/picker.tpl','template/style.tpl'],
                dest:'dest/datepicker.js'
            }
		},
		uglify:{
			options:{
				banner:'/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			picker:{
				src:'dest/datepicker.js',
				dest:'dest/datepicker.min.js'
			}
		}
	});
	grunt.loadNpmTasks('grunt-qc-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default',['concat','uglify']);
}