function convertFormat(productType, runInfo) {
  let totalTime = getSeconds(runInfo.totalTime);
  let sequencedTime = getSeconds(runInfo.sequencedTime);
  let analyzedTime = getSeconds(runInfo.analyzedTime);
  let ondellTime = getSeconds(runInfo.ondellTime);
  let convertedTime = getSeconds(runInfo.convertedTime);
  let incloudTime = getSeconds(runInfo.incloudTime);
  let downloadedTime = getSeconds(runInfo.downloadedTime);
  let jobsubmittedTime = getSeconds(runInfo.jobsubmittedTime);
  let jobcompletedTime = getSeconds(runInfo.jobcompletedTime);
  let backtodellTime = getSeconds(runInfo.backtodellTime);

  console.log(
    `${runInfo.runid}\t${totalTime}\t${sequencedTime}\t${analyzedTime}\t${ondellTime}\t${convertedTime}\t${incloudTime}\t${downloadedTime}\t${jobsubmittedTime}\t${jobcompletedTime}\t${backtodellTime}`
  );
}

function getSeconds(time) {
  let clockArray = time.split(':');
  let seconds = parseInt(clockArray[0] * 3600) + parseInt(clockArray[1] * 60) + parseInt(clockArray[2]);
  return seconds;
}

const logJSONListPath = {
  nips: '/data1/lampp/htdocs/report-tracking/log/nips_progress.log',
  sg: '/data1/lampp/htdocs/report-tracking/log/sg_progress.log',
  iona: '/data1/lampp/htdocs/report-tracking/log/iona_progress.log'
};

const convertJSONListPath = {
  nips: '../log_convert/nips_progress.log',
  sg: '../log_convert/sg_progress.log',
  iona: '../log_convert/iona_progress.log'
};

const fs = require('fs');
let data = [];
let logTime = {
  nips: [],
  sg: [],
  iona: []
};

const writeFile = (filename, content) => {
  fs.writeFile(filename, content, () => {});
};

console.log(
  '\ttotalTime\tsequencedTime\tanalyzedTime\tondellTime\tconvertedTime\tincloudTime\tdownloadedTime\tjobsubmittedTime\tjobcompletedTime\tbacktodellTime'
);

Object.keys(logJSONListPath).forEach(productType => {
  // console.log(productType + ' - ' + logJSONListPath[productType]); // key - value
  if (fs.existsSync(logJSONListPath[productType])) {
    data = JSON.parse(fs.readFileSync(logJSONListPath[productType], 'utf8'));
    data.forEach(el => convertFormat(productType, el));
  }
});
