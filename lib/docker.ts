import * as subProcess from './sub-process';

export { Docker };

class Docker {
  constructor(private targetImage: string) {
  }

  public run(cmd: string, args: string[] = []) {
    return subProcess.execute('docker', [
      'run', '--rm', '--entrypoint', '""', '--network', 'none',
      this.targetImage, cmd, ...args,
    ]);
  }

  public async catSafe(filename: string) {
    try {
      return await this.run('cat', [filename]);
    } catch (stderr) {
      if (typeof stderr === 'string' && stderr.indexOf('No such file') >= 0) {
        return '';
      }
      throw new Error(stderr);
    }
  }

  public async cp(destinationPath: string) {
    let workingDir;
    try {
      const workingDirRaw = await subProcess.execute('docker', [
        'inspect',
        this.targetImage,
        '--format',
        `'{{ json .Config.WorkingDir }}'`,
      ]);
      workingDir = JSON.parse(workingDirRaw);
    } catch (err) {
      console.error('docker inspect failed');
    }

    let sha;
    try {
      sha = await subProcess.execute('docker', [
        'run',
        '--rm',
        '-v',
        destinationPath + ':/tmp',
        this.targetImage,
        '/bin/sh',
        '-c',
        `"cp -r ${workingDir} /tmp"`,
        '--network',
        'none',
      ]);
      console.log(sha);
    } catch (err) {
      console.error({ err }, 'docker run failed');
    }
  }
}
