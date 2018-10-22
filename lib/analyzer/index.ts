import * as osReleaseDetector from './os-release-detector';
import * as imageIdDetector from './image-id-detector';
import * as apkAnalyzer from './apk-analyzer';
import * as aptAnalyzer from './apt-analyzer';
import * as rpmAnalyzer from './rpm-analyzer';
import { analyze as workdirAnalyze } from './workdir-artifacts-analyzer';

export {
  analyze,
};

function analyze(targetImage: string) {
  return Promise.all([
    imageIdDetector.detect(targetImage),
    osReleaseDetector.detect(targetImage),
    Promise.all([
      apkAnalyzer.analyze(targetImage),
      aptAnalyzer.analyze(targetImage),
      rpmAnalyzer.analyze(targetImage),
      workdirAnalyze(targetImage),
    ]),
  ])
  .then(res => ({
    imageId: res[0],
    osRelease: res[1],
    results: res[2],
  }));
}
