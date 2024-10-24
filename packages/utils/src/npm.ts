import execa from 'execa';

export async function canUseNvm() {
  try {
    await execa('source ~/.nvm/nvm.sh', {
      env: process.env,
      shell: true,
    });
    return true;
  } catch (e) {
    return false;
  }
}

export async function canUseFnm() {
  try {
    await execa('fnm --version', {
      env: process.env,
      shell: true,
    });
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
