import { Docker } from '../docker';
import { AnalyzerPkg } from './types';

export {
  analyze,
};

async function analyze(targetImage: string) {
  return new Docker(targetImage).cp()
}
