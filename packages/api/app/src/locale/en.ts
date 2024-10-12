export const EN_LOCALE = {
  environment: {
    node_version:
      'The version of Node.js is too low. Please upgrade to the LTS version: https://nodejs.org/',
    nvm_install: 'please install nvm first',
    yarn_pnpm_npm: 'please install yarn or pnpm or npm first',
  },
  install: {
    failed:
      'dependencies install failed, please execute `{command}` to install the dependencies ',
    failed_no_command: 'dependencies install failed',
    success: 'dependencies are automatically installed',
  },
  git: {
    failed:
      'git repository create failed, please check installing git and setting git username and email',
    success: 'git repository has been automatically created',
  },
  templated: {
    failed: 'forging template failed',
  },
  generator: {
    failed: 'load sub generator failed',
  },
  success: {
    info: 'Success!',
  },
};
