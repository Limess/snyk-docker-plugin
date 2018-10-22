import { Docker } from '../docker';
import { AnalyzerPkg } from './types';
import * as resolveNpmDeps from 'snyk-resolve-deps';

export {
  analyze,
};

async function analyze(targetImage: string) {
  // TODO some hardcoded path
  const path = '/tmp/foo';

  await new Docker(targetImage).cp(path)

  return resolveNpmDeps(path)
    .then(tree => {
      tree.targetFile = 'package.json';
      tree.type = 'npm';
      return tree;
    });
}
