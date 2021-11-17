// let temp_dataArry = [];

function calcStepDurationTime(data) {

  let intervalTime = 30;

  let newDurationTime;
  // console.log(data);

  if (typeof data.totalTime == "undefined") {
    // console.log("total Time not defined!");

    data.totalTime = "00:00:00";
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
    if (data.closed == "0" || data.closed == "") {
      const stepEntries = Object.entries(data);
      // console.log(stepEntries);
      let flag = 0;

      for (let i = 1; i < stepEntries.length; i++) {
        stepEntries[i][1] = stepEntries[i][1] + "";
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
          let stepTimeName = stepEntries[i][0] + "Time";

          data[stepTimeName] = calcNodeTime(data[stepEntries[i][0]], data[stepTimeName], intervalTime);
          data.totalTime = calcNodeTime(data.closed, data.totalTime, intervalTime);

          // console.log(data.totalTime);
          flag = 1;
          break;
        } else if (contentSplit.length == 2 && contentSplit[0] != contentSplit[1] && flag == 0) {
          let stepTimeName = stepEntries[i][0] + "Time";

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

function calcNodeTime(node, nodeDuration, intervalTime) {
  // console.log(node);

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

// function compareContent(dataTypeContent, key) {
//   const fs = require("fs");
//   let path = "../temp_data/" + key + "_progress_tail.json.temp";
//   let webPath = "../" + key.toUpperCase() + "/" + key + "_progress_tail.json";
//   let stats = fs.statSync(path);
//   // console.log(stats.size);
//   let tempData = [];
//   let count = 0;
//   let newData = [];
//   let flag = 0;
//   let dataTypeContentstring = JSON.stringify(dataTypeContent);
//   const writeFile = (filename, content) => {
//     fs.writeFile(filename, content, () => {});
//   };

//   tempData[key] = JSON.parse(fs.readFileSync(path).toString());
//   // console.log(tempData[key][0]);
//   if (fs.existsSync(path) && stats.size > 0) {
//     // console.log(path + " The file exists.");
//     tempData[key] = JSON.parse(fs.readFileSync(path).toString());
//     // console.log(tempData[key]);
//     for (let dataTypeIndex = 0; dataTypeIndex < dataTypeContent.length; dataTypeIndex++) {
//       for (let i = 0; i < tempData[key].length; i++) {
//         if (dataTypeContent[dataTypeIndex].runid == tempData[key][i].runid) {
//           // console.log(dataTypeContent[dataTypeIndex].runid);

//           newData[count] = tempData[key][i];

//           for (const stepItem in dataTypeContent[dataTypeIndex]) {
//             // console.log(dataTypeContent[i][stepItem]);
//             newData[count][stepItem] = dataTypeContent[dataTypeIndex][stepItem];
//           }

//           for (const timeItem in tempData[key][i]) {
//             if (timeItem.match(/,"(.*)Time":/)) {
//               newData[count][timeItem] = dataTypeContent[i][timeItem];
//             }
//           }

//           count += 1;
//           flag = 1;
//           continue;
//         }
//       }

//       if (flag == 0) {
//         newData[count] = dataTypeContent[dataTypeIndex];
//         count += 1;

//         // console.log("new Sample Run: " + newData[count]);
//       }
//       flag = 0;
//     }
//     // console.log(newData);
//   } else {
//     writeFile(path, dataTypeContentstring);
//     console.log(path + " not exists.");
//   }
//   // console.log(newData);

//   return newData;
// }

function getData(productType) {
  const MongoClient = require("mongodb").MongoClient;
  const url = "mongodb://192.168.228.18:27017/";
  let data;
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
      if (err) throw err;
      let dbo = db.db("sofiva");
      let data = dbo.collection(productType).find().sort({ runid: -1 }).limit(12);
      let temp_dataArry = [];
      
      dbo.collection('iona').deleteOne({
        "runid": "vAuto_user_YG3-1270-IONA_Test_20200721-B"
      });
      data.toArray().then((result) => {

        result.reverse().forEach((element) => {
          if (element.closed !== 1 && typeof element.sequencedStart != "undefined") {
            let nowSeconds = parseInt(new Date().getTime() / 1000);

            if (typeof element.analyzedTime == "undefined") {
              element.analyzedTime = "00:00:30";
              element.analyzedStart = element.sequencedStart;
              element.analyzedEnd = element.sequencedEnd;
            }
            
            let clockArray = element.sequencedStart.split(/[-:]/);
            const sequencedSeconds =
              new Date(
                parseInt(clockArray[0]),
                parseInt(clockArray[1]) - 1,
                parseInt(clockArray[2]),
                parseInt(clockArray[3]),
                parseInt(clockArray[4]),
                parseInt(clockArray[5])
              ).getTime() / 1000;
            let intervalSeconds = nowSeconds - sequencedSeconds;

            // console.log(clockArray, intervalSeconds, nowSeconds, sequencedSeconds);

            if (element.sequencedStart.match("-")) {
              element.totalTime = getClock(intervalSeconds);
              // console.log(element.runid, clockArray, intervalSeconds, nowSeconds, sequencedSeconds, element.totalTime);
            }
          }

          if (typeof element.sequencedStart != "undefined") { 
            temp_dataArry.push(calcStepDurationTime(element));
          }
        });

        db.close();

        if (productType === "nips") {
          temp_dataArry = getRunNo(temp_dataArry);
        }
        // console.log(temp_dataArry);
        resolve(temp_dataArry);
        // return temp_dataArry;
      });
    });
  });
}

function getRunNo(data) {
  let runidArr = [];
  const analyzedArr = data.filter(function (item, index, array) {
    return item.analyzedStart !== "00:00:30";
  });

  // console.log(data);
  analyzedArr.forEach((el) => {
    const runDate = el.runid.split("_");
    runidArr.push(runDate[0]);
  });

  const runidUni = [...new Set(runidArr)];

  runidUni.sort(function (a, b) {
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  });
  // console.log(runidUni);
  runidUni.forEach((runid) => {
    let tempArr = [];

    data.forEach((el) => {
      if (el.runid.match(runid) && el.analyzedStart !== "00:00:30") {
        let clockArray = el.analyzedStart.split(/[-:]/);
        const epoch = new Date(
          clockArray[0],
          clockArray[1],
          clockArray[2],
          clockArray[3],
          clockArray[4],
          clockArray[5]
        ).getTime();
        tempArr.push(epoch);
      }
    });
    // console.log(tempArr);
    tempArr.sort(function (a, b) {
      if (a > b) return 1;
      if (a < b) return -1;
      return 0;
    });

    // console.log(tempArr);
    let number = 0;

    tempArr.forEach((epoch, index, arr) => {
      data.forEach((el) => {
        let clockArray = el.analyzedStart.split(/[-:]/);
        let preClockArr = 0;

        if (index !== 0) {
          preClock = arr[index - 1];
        }

        const epochData = new Date(
          clockArray[0],
          clockArray[1],
          clockArray[2],
          clockArray[3],
          clockArray[4],
          clockArray[5]
        ).getTime();

        // console.log("===", el.runid, epochData, index);

        if (epochData === epoch && index === 0) {
          el.runNo = index + 1;
          // console.log("=", el.runid, el.analyzedStart, epochData, el.runNo);
        } else if (epochData === epoch && epochData - arr[index - 1] < 18000000) {
          // console.log("number: " + number);
          el.runNo = index + 1 - number;
          // console.log("<", el.runid, el.analyzedStart, epochData, arr[index - 1], epochData - arr[index - 1], el.runNo);
          // console.log(index, el.runNo);
        } else if (epochData === epoch && epochData - arr[index - 1] > 18000000) {
          // console.log(arr);
          el.runNo = 1;
          number = index;

          // console.log(">", el.runid, el.analyzedStart, epochData, arr[index - 1], epochData - arr[index - 1], el.runNo);
          // console.log(arr);
        }
      });
    });
  });
  // console.log(data);
  return data;
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

// data.nips = JSON.parse(fs.readFileSync(JSONListPath.nips).toString());
// data.sg = JSON.parse(fs.readFileSync(JSONListPath.sg).toString());
// data.iona = JSON.parse(fs.readFileSync(JSONListPath.iona).toString());
// data.ctdna = JSON.parse(fs.readFileSync(JSONListPath.ctdna).toString());

getData("nips").then((res) => {
  // console.log("123", res);

  writeFile(webJSONListPath.nips, JSON.stringify(res));
  writeFile(tempJSONListPath.nips, JSON.stringify(res));
});


getData("iona").then((res) => {
  // console.log("123", res);

  writeFile(webJSONListPath.iona, JSON.stringify(res));
  writeFile(tempJSONListPath.iona, JSON.stringify(res));
});

getData("ctdna").then((res) => {
  // console.log("123", res);

  writeFile(webJSONListPath.ctdna, JSON.stringify(res));
  writeFile(tempJSONListPath.ctdna, JSON.stringify(res));
});