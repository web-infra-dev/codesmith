import * as codesmith from '@modern-js/codesmith';
import * as codesmithApiApp from '@modern-js/codesmith-api-app';
import * as codesmithApiEjs from '@modern-js/codesmith-api-ejs';
import * as codesmithApiFs from '@modern-js/codesmith-api-fs';
import * as codesmithApiGit from '@modern-js/codesmith-api-git';
import * as codesmithApiHandlebars from '@modern-js/codesmith-api-handlebars';
import * as codesmithApiJson from '@modern-js/codesmith-api-json';
import * as codesmithApiNpm from '@modern-js/codesmith-api-npm';
import * as codesmithFormily from '@modern-js/codesmith-formily';
import * as codesmithUtils from '@modern-js/codesmith-utils';
import * as codesmithLodashUtils from '@modern-js/codesmith-utils/lodash';
import * as codesmithFsUtils from '@modern-js/codesmith-utils/fs-extra';
import * as codesmithChalkUtils from '@modern-js/codesmith-utils/chalk';
import * as codesmithExecaUtils from '@modern-js/codesmith-utils/execa';
import * as codesmithGlobUtils from '@modern-js/codesmith-utils/glob';
import * as codesmithNpmUtils from '@modern-js/codesmith-utils/npm';
import * as codesmithOraUtils from '@modern-js/codesmith-utils/ora';
import * as codesmithSemverUtils from '@modern-js/codesmith-utils/semver';
import * as pluginI18N from '@modern-js/plugin-i18n';

(global as any).codesmith = codesmith;
(global as any).codesmithApiApp = codesmithApiApp;
(global as any).codesmithApiJson = codesmithApiJson;
(global as any).codesmithApiGit = codesmithApiGit;
(global as any).codesmithUtils = codesmithUtils;
(global as any).codesmithGlobUtils = codesmithGlobUtils;
(global as any).codesmithLodashUtils = codesmithLodashUtils;
(global as any).codesmithFsUtils = codesmithFsUtils;
(global as any).codesmithChalkUtils = codesmithChalkUtils;
(global as any).codesmithExecaUtils = codesmithExecaUtils;
(global as any).codesmithNpmUtils = codesmithNpmUtils;
(global as any).codesmithOraUtils = codesmithOraUtils;
(global as any).codesmithSemverUtils = codesmithSemverUtils;
(global as any).codesmithFormily = codesmithFormily;
(global as any).codesmithApiNpm = codesmithApiNpm;
(global as any).codesmithApiEjs = codesmithApiEjs;
(global as any).codesmithApiFs = codesmithApiFs;
(global as any).codesmithApiHandlebars = codesmithApiHandlebars;
(global as any).pluginI18N = pluginI18N;
