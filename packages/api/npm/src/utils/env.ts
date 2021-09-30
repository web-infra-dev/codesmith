import execa from 'execa';

export async function canUseNvm() {
  try {
    await execa(
      '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && [ -s "$NVM_DIR/bash_completion" ] && . "$NVM_DIR/bash_completion" && nvm --version',
      {
        env: process.env,
        shell: true,
      },
    );
    return true;
  } catch (e) {
    return false;
  }
}

export async function canUseNpm() {
  try {
    await execa('npm', ['--version'], {
      env: process.env,
    });
    return true;
  } catch (e) {
    return false;
  }
}

export async function canUseYarn() {
  try {
    await execa('yarn', ['--version'], {
      env: process.env,
    });
    return true;
  } catch (e) {
    return false;
  }
}

export async function canUsePnpm() {
  try {
    await execa('pnpm', ['--version'], {
      env: process.env,
    });
    return true;
  } catch (e) {
    return false;
  }
}
