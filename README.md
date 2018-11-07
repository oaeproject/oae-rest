![code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/xojs/xo)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/aa6d33e526e1412793923ddd463f426f)](https://www.codacy.com/app/oaeproject/oae-rest?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=oaeproject/oae-rest&amp;utm_campaign=Badge_Grade)
[![Known Vulnerabilities](https://snyk.io/test/github/oaeproject/oae-rest/badge.svg)](https://snyk.io/test/github/oaeproject/oae-rest)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Foaeproject%2Foae-rest.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Foaeproject%2Foae-rest?ref=badge_shield)

The `rest` module for OAE.

This is a stand-alone module that can be used to communicate with a live OAE instance through its REST endpoints.

### Releasing

This module is versioned the same as the [Hilary](https://github.com/oaeproject/Hilary) project. When a new version of Hilary is released, a matching version of this module should be released. To keep the versions in sync, we do the following:

* Every release is post-fixed with `-N` starting from `-1`. Any `<hilary version>-N` release of this module will work with `<hilary version>` of Hilary. The `-N` postfix is only for maintenance things such as updating build scripts or critical package.json scripts
* Whenever there is a new Hilary release, we release a compatible version of this module with the same version

To do that, we use the [grunt-release](https://github.com/geddski/grunt-release) plugin, however we do some additional acrobatics to follow the above process:

1. To update just the pre-release version of this module, run: `grunt release-version:prerelease`
2. To do a patch-version release of this module, run: `grunt release-version:patch`
3. To do a minor-version release of this module, run: `grunt release-version:minor`
4. To do a major-version release of this module, run: `grunt release-version:major`

Therefore if you are on version `4.4.0-3` and you need to upgrade the module for a `5.0.0` release of Hilary, you run the following:

`sh release.sh`, enter your GitHub username and password, enter the release type as `major`, and that will release and publish version `5.0.0` of this module to NPM.
