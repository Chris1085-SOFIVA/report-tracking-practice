/**
 *  Calculating Step duration time
 *
 * @param {*} data JSON format form product monitoring txt
 * @returns
 */
function calcStepDurationTime(data) {
  let intervalTime = 1;
  let newDurationTime;
  // console.log(data);

  if (typeof data.totalTime == "undefined") {
    // console.log("total Time not defined!");

    data.totalTime = "00:04:30";
    data.sequencedTime = "00:00:30";
    data.analyzedTime = "00:00:30";
    data.ondellTime = "00:00:30";
    data.convertedTime = "00:00:30";
    data.incloudTime = "00:00:30";
    data.downloadedTime = "00:00:30";
    data.jobsubmittedTime = "00:00:30";
    data.jobcompletedTime = "00:00:30";
    data.backtodellTime = "00:00:30";
  } else {
    // close == 0 indicated job is unfinished
    if (data.closed == "0" || data.closed == "") {
      const stepEntries = Object.entries(data);
      // console.log(stepEntries);
      let flag = 0;

      for (let i = 1; i < stepEntries.length; i++) {
        // To distinguish whether the step contains multiple samples
        let contentSplit = stepEntries[i][1].split("/");

        if (
          stepEntries[i][0].match(/timeUsed/) ||
          stepEntries[i][0].match(/(.*)Time/) ||
          stepEntries[i][0].match(/error/) ||
          stepEntries[i][0].match(/closed/) ||
          flag == 1
        ) {
          continue;
        } else if ((stepEntries[i][1] == 0 || stepEntries[i][1] == "") && flag == 0) {
          //unfinished state occurs
          let stepTimeName = stepEntries[i][0] + "Time";

          data[stepTimeName] = calcNodeTime(data[stepEntries[i][0]], data[stepTimeName], intervalTime);
          data.totalTime = calcNodeTime(data.closed, data.totalTime, intervalTime);

          // console.log(data.totalTime);
          flag = 1;
          break;
        } else if (contentSplit.length == 2 && contentSplit[0] != contentSplit[1] && flag == 0) {
          //unfinished state and also has multiple samples occurs
          let stepTimeName = stepEntries[i][0] + "Time";

          // calcuating total time and step time
          data[stepTimeName] = calcNodeTime(data[stepEntries[i][0]], data[stepTimeName], intervalTime);
          data.totalTime = calcNodeTime(data.closed, data.totalTime, intervalTime);

          flag = 1;
          break;
        }
      }
    }
  }
  return data;
}

/**
 *  Let time of unfinished state move $intervalTime secs
 *
 * @param {*} node step data
 * @param {*} nodeDuration step duration time
 * @param {*} intervalTime perSecs
 * @returns
 */
function calcNodeTime(node, nodeDuration, intervalTime) {
  // console.log(node);

  // init node
  if (typeof node === "undefined") {
    node = 1;
    nodeDuration = "00:00:30";
    // console.log("calcNodeTime node not defined: " + node);
  } else {
    let clockArray = nodeDuration.split(":");
    let seconds = parseInt(clockArray[0] * 3600) + parseInt(clockArray[1] * 60) + parseInt(clockArray[2]);

    seconds += parseInt(intervalTime);
    nodeDuration = getClock(seconds);
    // console.log(nodeDuration);
  }
  return nodeDuration;
}

/**
 *  Calculating seconds to HH:MM:SS and display '0' at Tens digit when it is an Units digit.
 *
 * @param {*} seconds
 * @returns
 */
function getClock(seconds) {
  let newHours = Math.floor(seconds / 3600);
  let newMins = Math.floor((seconds % 3600) / 60);
  let newSeconds = (seconds % 3600) % 60;

  if (newHours < 99) {
    newHours = ("0" + newHours).slice(-2);
  }
  newMins = ("0" + newMins).slice(-2);
  newSeconds = ("0" + newSeconds).slice(-2);

  let clock = newHours + ":" + newMins + ":" + newSeconds;
  // console.log(clock);

  return clock;
}

/**
 * To compare between log content and processing data content.
 * *If processing data content finished write in log content
 *
 * @param {*} dataTypeContent
 * @param {*} key productType
 * @returns
 */
function compareContent(dataTypeContent, key) {
  const fs = require("fs");
  let path = "../temp_data/" + key + "_progress_tail.json.temp";
  let webPath = "../" + key.toUpperCase() + "/" + key + "_progress_tail.json";
  let stats = fs.statSync(path);
  // console.log(stats.size);
  let tempData = [];
  let count = 0;
  let newData = [];
  let flag = 0;
  let dataTypeContentstring = JSON.stringify(dataTypeContent);
  const writeFile = (filename, content) => {
    fs.writeFile(filename, content, () => {});
  };

  tempData[key] = JSON.parse(fs.readFileSync(path).toString());
  // console.log(tempData[key][0]);
  if (fs.existsSync(path) && stats.size > 0) {
    // console.log(path + " The file exists.");
    tempData[key] = JSON.parse(fs.readFileSync(path).toString());
    // console.log(tempData[key]);
    for (let dataTypeIndex = 0; dataTypeIndex < dataTypeContent.length; dataTypeIndex++) {
      for (let i = 0; i < tempData[key].length; i++) {
        if (dataTypeContent[dataTypeIndex].runid == tempData[key][i].runid) {
          // console.log(dataTypeContent[dataTypeIndex].runid);

          newData[count] = tempData[key][i];

          for (const stepItem in dataTypeContent[dataTypeIndex]) {
            // console.log(dataTypeContent[i][stepItem]);
            newData[count][stepItem] = dataTypeContent[dataTypeIndex][stepItem];
          }

          for (const timeItem in tempData[key][i]) {
            if (timeItem.match(/,"(.*)Time":/)) {
              newData[count][timeItem] = dataTypeContent[i][timeItem];
            }
          }

          count += 1;
          flag = 1;
          continue;
        }
      }

      if (flag == 0) {
        newData[count] = dataTypeContent[dataTypeIndex];
        count += 1;

        // console.log("new Sample Run: " + newData[count]);
      }
      flag = 0;
    }
    // console.log(newData);
  } else {
    writeFile(path, dataTypeContentstring);
    console.log(path + " not exists.");
  }
  // console.log(newData);

  return newData;
}

const JSONListPath = {
  nips: "../source_data/nips_progress_tail.json",
  sg: "../source_data/sg_progress_tail.json",
  iona: "../source_data/iona_progress_tail.json",
  ctdna: "../source_data/ctdna_progress_tail.json",
};

const tempJSONListPath = {
  nips: "../temp_data/nips_progress_tail.json.temp",
  sg: "../temp_data/sg_progress_tail.json.temp",
  iona: "../temp_data/iona_progress_tail.json.temp",
  ctdna: "../temp_data/ctdna_progress_tail.json.temp",
};

const webJSONListPath = {
  nips: "../NIPS/nips_progress_tail.json",
  sg: "../SG/sg_progress_tail.json",
  iona: "../IONA/iona_progress_tail.json",
  ctdna: "../ctDNA/ctdna_progress_tail.json",
};

const fs = require("fs");
let data = [];
const writeFile = (filename, content) => {
  fs.writeFile(filename, content, () => {});
};

data.nips = JSON.parse(fs.readFileSync(JSONListPath.nips).toString());
data.sg = JSON.parse(fs.readFileSync(JSONListPath.sg).toString());
data.iona = JSON.parse(fs.readFileSync(JSONListPath.iona).toString());
data.ctdna = JSON.parse(fs.readFileSync(JSONListPath.ctdna).toString());

// var stats = fs.statSync(JSONListPath.nips);
// console.log(stats.size);

for (const key in data) {
  data[key] = compareContent(data[key], key);

  for (let i = 0; i < data[key].length; i++) {
    data[key][i] = calcStepDurationTime(data[key][i]);
  }

  if (JSON.stringify(data[key]) != "") {
    writeFile(webJSONListPath[key], JSON.stringify(data[key]));
    writeFile(tempJSONListPath[key], JSON.stringify(data[key]));
  }
}
