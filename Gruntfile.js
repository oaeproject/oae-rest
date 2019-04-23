/* eslint-disable-file unicorn/filename-case */
import util from 'util';

export default function(grunt) {
  grunt.loadNpmTasks('grunt-release');

  grunt.initConfig({
    release: {
      options: {
        github: {
          repo: 'oaeproject/oae-rest'
        }
      }
    }
  });

  grunt.registerTask('release-config-commit', function() {
    grunt.config.set('release.options.add', true);
    grunt.config.set('release.options.bump', true);
    grunt.config.set('release.options.commit', true);
    grunt.config.set('release.options.npm', true);
    grunt.config.set('release.options.push', true);
    grunt.config.set('release.options.pushTags', true);
    grunt.config.set('release.options.tag', true);
  });

  grunt.registerTask('release-version', function(type) {
    type = type || 'prerelease';

    // Only set these in the custom release-version task because
    // we don't want to accidentally run `grunt release` and have
    // it work properly without the proper pre-release version
    // handling
    grunt.config.set('release.options.github.usernameVar', 'GITHUB_USERNAME');
    grunt.config.set('release.options.github.passwordVar', 'GITHUB_PASSWORD');

    if (type === 'prerelease') {
      // Run the standard prerelease task, which will increment the
      // prerelease version and publish it to npm
      grunt.task.run('release-config-commit');
      grunt.task.run('release:prerelease');
    } else {
      grunt.task.run('release-config-commit');
      grunt.task.run(util.format('release:%s', type));
    }
  });
}
