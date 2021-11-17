#!/usr/bin/env node

/**
 * Sending email if we have some data status processed longer than expected.
 * Setting nodemailer module and sending info.
 *
 * @param {*} content html content for nodemailer's html(key)
 * @param {*} productType product of report-tracking system
 * @param {*} flag to determin whether table content is empty. If it's true, it represents that data details need to send mail to related person.
 * @returns
 */
function sendMail(content, productType, flag) {
  if (flag == false) {
    return;
  }

  let subjectTitle = "Report-Tracking System Notify - " + productType.toUpperCase();

  //引用 nodemailer
  let nodemailer = require("nodemailer");

  let maillist = {
    nips: [
      // 'bmi.hcy@sofivagenomics.com.tw',
      "bmi.cfc@sofivagenomics.com.tw",
      // "tklin@sofivagenomics.com.tw",
      // "yichu@sofivagenomics.com.tw",
      // "tsuling@sofivagenomics.com.tw",
      // "nips@sofivagenomics.com.tw",
      // "va@sofivagenomics.com.tw",
      "jleung@sofivagenomics.com.tw"
    ],
    sg: [
      // 'bmi.hcy@sofivagenomics.com.tw',
      "bmi.cfc@sofivagenomics.com.tw",
      "tklin@sofivagenomics.com.tw",
      "yichu@sofivagenomics.com.tw",
      "tsuling@sofivagenomics.com.tw",
      "nips@sofivagenomics.com.tw",
      "ying@sofivagenomics.com.tw",
      "tehyang.hwa@sofivagenomics.com.tw"
    ],
    iona: [
      // 'bmi.hcy@sofivagenomics.com.tw',
      "bmi.cfc@sofivagenomics.com.tw",
      // "tklin@sofivagenomics.com.tw",
      // "yichu@sofivagenomics.com.tw",
      // "tsuling@sofivagenomics.com.tw",
      // "iona@sofivagenomics.com.tw",
      // "yuchen@phoebusgenetics.com.tw",
      "jleung@sofivagenomics.com.tw"
    ]
  };

  let sendList = maillist[productType];

  //宣告發信物件
  let transporter = nodemailer.createTransport({
    // service: "Gmail",
    // auth: {
    //   user: "sofiva.bmi@gmail.com",
    //   pass: "zabvtgxrhahvjjqh"
    // }
    host: "smtp.gmail.com",
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: "bmi@sofivagenomics.com.tw",
      pass: "sofiva6615"
    }
  });

  let options = {
    //寄件者
    from: "sofiva.bmi@gmail.com",
    //收件者
    to: sendList,
    //副本
    // cc: 'bmi.cfc@sofivagenomics.com.tw',
    //密件副本
    bcc: "bmi.cfc@sofivagenomics.com.tw",
    //主旨
    subject: subjectTitle, // Subject line
    //純文字
    text: "Hello world!", // plaintext body
    //嵌入 html 的內文
    html: content
  };

  //發送信件方法
  transporter.sendMail(options, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("訊息發送: " + info.response);
    }
  });
}

/**
 * Subject: To determin sample's time of status which is higher than cut-off
 * Method: Using for-loop to find which uncompleted status we should compare
 *         with default cut-off time. If it's longer than default, assign
 *         the key-value to new JSON stringtify string.
 *
 * @param {*} sample
 * @param {*} productType
 * @returns
 */
function filterSampleRun(sample, productType) {
  let newSampleRun;
  let newSampleRunArr = [];
  // console.log(sample);

  const stepArr = { "nips": ["sequencedTime", "analyzedTime", "ondellTime", "convertedTime", "incloudTime","downloadedTime", "jobsubmittedTime", "jobcompletedTime", "backtodellTime"] };

  //default cut-off
  const cutOffSetttings = {
    nips: {
      totalTime: 40983,
      sequencedTime: 25504.5,
      analyzedTime: 13582.5,
      ondellTime: 1385.75,
      convertedTime: 291.25,
      incloudTime: 189.5,
      downloadedTime: 582.75,
      jobsubmittedTime: 2436.25,
      jobcompletedTime: 725.75,
      backtodellTime: 197.5
    },
    iona: {
      totalTime: 58815,
      sequencedTime: 57322,
      analyzedTime: 0,
      ondellTime: 504,
      convertedTime: 1092,
      incloudTime: 2993,
      downloadedTime: 739,
      jobsubmittedTime: 60,
      jobcompletedTime: 1056,
      backtodellTime: 991
    },
    sg: {
      totalTime: 58145,
      sequencedTime: 55810,
      analyzedTime: 0,
      ondellTime: 432,
      convertedTime: 0,
      incloudTime: 82,
      downloadedTime: 384,
      jobsubmittedTime: 61,
      jobcompletedTime: 2237,
      backtodellTime: 232
    }
  };
  // console.log(sample);

  for (const key in sample) {
    let durationName = key + "Time";

    //To find without step name. If its not match with step, ignore it.
    if (key == "runid" || key == "closed" || key == "error" || key == "timeUsed" || key == "csvondellTime" || key == "csvtransmitTime") {
      continue;
    } else if(key.match(/(.*)Start$/) && sample.closed != "1"){
      let curStepTime = RegExp.$1 + "Time";
      let preStepName = "";

      for (let i = 0; i < stepArr.nips.length + 1; i++) {
        if (sample[stepArr.nips[i]] === "00:00:30") {
          if (i !== 0) {
            preStepName = stepArr.nips[i - 1];
            curStepTime = stepArr.nips[i];
          } else if (i === 0) { 
            preStepName = stepArr.nips[i];
            curStepTime = stepArr.nips[i];
          }
          break;
        }
        
      }
      console.log(sample.runid,preStepName,curStepTime);
      
      // console.log(preStepName,curStepTime,sample.runid,RegExp.$1 + "Time");
      if (preStepName !== curStepTime && RegExp.$1 + "Time" === curStepTime) {
        // console.log(preStepName, curStepTime, sample.runid, RegExp.$1 + "Time");
        const newstr = preStepName.replace(/Time/i, 'End');

        const sampleYY = parseInt(sample[newstr].split(/[:-]/)[0]);
        const sampleMM = parseInt(sample[newstr].split(/[:-]/)[1]);
        const sampleDD = parseInt(sample[newstr].split(/[:-]/)[2]);
        
        const sampleHours = parseInt(sample[newstr].split(/[:-]/)[3]);
        const sampleMins = parseInt(sample[newstr].split(/[:-]/)[4]);
        const sampleSecs = parseInt(sample[newstr].split(/[:-]/)[5]);
        // const totalSecs = sampleHours * 60 * 60 + sampleMins * 60 + sampleSecs;
        const totalSecs = new Date(sampleYY, sampleMM - 1, sampleDD, sampleHours, sampleMins, sampleSecs).getTime();
        const currSecs = new Date().getTime();
        const cutOffTime = new Date(cutOffSetttings[productType][curStepTime] * 1000).toISOString().substr(11, 8);

        // console.log(newstr, sample[newstr], currSecs, totalSecs, (currSecs - totalSecs) / 1000, cutOffSetttings[productType][curStepTime]);
        // console.log(sampleYY, sampleMM - 1, sampleDD, sampleHours, sampleMins, sampleSecs);

        if ((currSecs - totalSecs) / 1000 > cutOffSetttings[productType][curStepTime]) {
          let curHHMMSS = getClock((currSecs - totalSecs) / 1000);
          let runid = sample.runid;
          let temp = {
            [productType]: {
              runid: runid,
              node: key,
              nodeTime: curHHMMSS,
              totalTime: sample.totalTime,
              alarmTime: cutOffTime,
              count: 1
            }
          };
          console.log(temp);
          newSampleRun = JSON.stringify(temp);
          newSampleRunArr.push(newSampleRun);

        }
      }
    }
    else if (key.match(/(.*)Time$/)) {
      // console.log(sample[key], key);

      let sampleHours = parseInt(sample[key].split(":")[0]);
      let sampleMins = parseInt(sample[key].split(":")[1]);
      let sampleSecs = parseInt(sample[key].split(":")[2]);
      let totalSecs = sampleHours * 60 * 60 + sampleMins * 60 + sampleSecs;
      // console.log(sampleHours, sampleMins, sampleSecs, totalSecs);

      // let totalSecs = 100;
      // console.log(sampleHours, sampleMins, sampleSecs, totalSecs, cutOffSetttings[productType][key]);
      // console.log(productType, totalSecs, cutOffSetttings[productType][key], key);

      let cutOffTime = new Date(cutOffSetttings[productType][key] * 1000).toISOString().substr(11, 8);

      if (sample.closed != "1" && totalSecs > cutOffSetttings[productType][key]) {
        let runid = sample.runid;
        let temp = {
          [productType]: {
            runid: runid,
            node: key,
            nodeTime: sample[key],
            totalTime: sample.totalTime,
            alarmTime: cutOffTime,
            count: 1
          }
        };
        // console.log(temp);

        newSampleRun = JSON.stringify(temp);
        newSampleRunArr.push(newSampleRun);
      }
    }
  }
  return newSampleRunArr;
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

/**
 *  Subject: To write total mail content in a variable
 *  Method: Useing += to contiue the html content string. If flag is
 *          true represents uncompleted data exists and need to send
 *          to related person. we also have template like ./test.html
 *          to test the mail content style is what we want.
 *
 * @param {*} data
 * @param {*} productType
 * @returns
 */
function writeMailContent(data, productType) {
  let flag = false;
  let product = productType.toUpperCase();
  let content = `
    <h2>Report-Tracking System Notify</h2>
    <p>Some data processed longer than expected. Please confirm progress step and data status <a href="http://192.168.0.199/report-tracking/${product}/index.html">here</a>.</p>
    <p>The information is summerized below:</p>
    <h4>PRODUCT: ${product}</h4>
    <table style = "border-collapse: collapse; width:800px;">
      <col width = "40%">
      <col width = "30%">
      <col width = "10%">
      <col width = "10%">
      <col width = "10%">
        <tr>
          <th style = "border-bottom: 1px solid #ddd; padding:10px 0px; background-color: #6bc541;"> Run ID </th>
          <th style = "border-bottom: 1px solid #ddd; background-color: #6bc541;"> Step </th>
          <th style = "border-bottom: 1px solid #ddd; background-color: #6bc541;"> Duration </th>
          <th style = "border-bottom: 1px solid #ddd; background-color: #6bc541;"> Alarm Time </th> 
          <th style = "border-bottom: 1px solid #ddd; background-color: #6bc541;"> Elapsed Time </th>
        </tr>`;

  for (let index = 0; index < data.length; index++) {
    // console.log(data[index]);
    for (let stepIndex = 0; stepIndex < data[index].length; stepIndex++) {
      // console.log(data[index][stepIndex]);
      let mailInfo = JSON.parse(data[index][stepIndex]);
      if (typeof mailInfo[productType] != "undefined") {
        content += `\n<tr>\n`;
        content += `<td align='center' style='border-bottom: 1px solid #ddd; padding:10px 0px;'>${mailInfo[productType].runid}</td>\n`;
        content += `<td align='center' style='border-bottom: 1px solid #ddd;'>${mailInfo[productType].node}</td>\n`;
        content += `<td align='center' style='border-bottom: 1px solid #ddd;'>${mailInfo[productType].nodeTime}</td>\n`;
        content += `<td align='center' style='border-bottom: 1px solid #ddd;'>${mailInfo[productType].alarmTime}</td>\n`;
        content += `<td align='center' style='border-bottom: 1px solid #ddd;'>${mailInfo[productType].totalTime}</td>\n`;
        content += `</tr>\n`;
        flag = true;
      }
    }
  }

  content += `\n</table>`;
  content += `<div  style="padding-top: 100px; display:block">
  <a class="navbar-brand"><img src="../images/unnamed.gif" width="240" height="80" alt=""></a>
  <br>
  <span>慧智基因</span>
  <br>
  <span>姜權芳 Chuan-Fang Chiang</span>
  <br>
  <span>生物資訊分析師</span>
  <br>
  <span>地址:台北市中正區寶慶路27號5樓</span>
  <br>
  <span>電話:(02)2382-6615 EXT.6503</span>
</div>`;
  sendMail(content, productType, flag);
  // console.log(data);
}

function compareMailContent(alertData, writeContent, productType, checkCount) {
  let finalArray = [];
  let writeContentCount = 0;
  let matchConut = 0;
  // console.log(writeContent);

  if (typeof writeContent.length == "undefined") {
    return false;
  } else {
    console.log("AlertData");
    console.log(alertData);
    console.log("#################");
    console.log("writeContent");
    console.log(writeContent);
    console.log("###############");

    let simpleAlert = [];
    let simpleAlertJSON = {};
    let simpleContent = [];
    let simpleContentHash = {};
    let writeContentFlag = 0;

    //將alertData的id node賦予到新的hash供writeContent比對
    for (let index = 0; index < alertData.length; index++) {
      for (let stepIndex = 0; stepIndex < alertData[index].length; stepIndex++) {
        let alertDataJSON = JSON.parse(alertData[index][stepIndex]);
        simpleAlert.push(alertDataJSON[productType].runid + "_" + alertDataJSON[productType].node);
        simpleAlertJSON[alertDataJSON[productType].runid + "_" + alertDataJSON[productType].node] =
          index + "_" + stepIndex;
      }
    }
    // console.log("simpleAlertJSON:" + JSON.stringify(simpleAlertJSON));
    //比對將alertData跟writeContent是否不一樣
    for (let index = 0; index < writeContent.length; index++) {
      let temp = [];

      for (let stepIndex = 0; stepIndex < writeContent[index].length; stepIndex++) {
        let writeContentJSON = JSON.parse(writeContent[index][stepIndex]);
        let simpleKeyName = writeContentJSON[productType].runid + "_" + writeContentJSON[productType].node;
        // console.log(writeContentJSON);

        simpleContent.push(writeContentJSON[productType].runid + "_" + writeContentJSON[productType].node);
        simpleContentHash[writeContentJSON[productType].runid + "_" + writeContentJSON[productType].node] =
          index + "_" + stepIndex;


        //假如比對到一樣的話，parse alertDataJSON，並將alertDataJSON writeContentJSON的count+1，並stringtify回原來的陣列
        if (typeof simpleAlertJSON[simpleKeyName] !== "undefined") {
          console.log("402",simpleKeyName,simpleAlertJSON[simpleKeyName]);

          let totalSteps = simpleAlertJSON[simpleKeyName].split("_");
          let alertDataJSON = JSON.parse(alertData[totalSteps[0]][totalSteps[1]]);

          alertDataJSON[productType].count = writeContentJSON[productType].count + 1;
          writeContentJSON[productType].count = writeContentJSON[productType].count + 1;
          console.log(alertDataJSON);

          alertData[index][stepIndex] = JSON.stringify(alertDataJSON);
          writeContent[index][stepIndex] = JSON.stringify(writeContentJSON);

          // console.log(simpleKeyName, alertData[index][stepIndex]);
        } else {
          console.log("416",simpleKeyName);
          console.log(simpleAlertJSON[simpleKeyName]);
          if (typeof simpleAlertJSON[simpleKeyName] !== "undefined") {
            let totalSteps = simpleAlertJSON[simpleKeyName].split("_");
            let alertDataJSON = JSON.parse(alertData[totalSteps[0]][totalSteps[1]]);

            writeContentJSON[productType].count += 1;
            writeContent[index][stepIndex] = JSON.stringify(writeContentJSON);

            if (alertDataJSON[productType].count < 2) {
              temp.push(JSON.stringify(writeContentJSON));
            }
            
          }

          
        }
      }
      if (temp.length > 0) {
        finalArray.push(temp);
      }
    }
    // console.log(alertData);

    for (let index = 0; index < alertData.length; index++) {
      let temp = [];
      for (let stepIndex = 0; stepIndex < alertData[index].length; stepIndex++) {
        let alertDataJSON = JSON.parse(alertData[index][stepIndex]);
        let simpleKeyName = alertDataJSON[productType].runid + "_" + alertDataJSON[productType].node;

        if (alertDataJSON[productType].count < 2) {
          // console.log(alertDataJSON[productType]);
          temp.push(JSON.stringify(alertDataJSON));
          if (typeof simpleContentHash[simpleKeyName] === "undefined") {
            writeContent.push(temp);
          }
        }
      }
      if (temp.length > 0) {
        finalArray.push(temp);
      }
      if (writeContent.length == 0) {
        writeContent.push(temp);
      }
    }
    console.log("finalArray");
    console.log(finalArray);

    return {
      finalArray: finalArray,
      writeContent: writeContent
    };
  }
}

const webJSONListPath = {
  nips: "../NIPS/nips_progress_tail.json",
  // sg: "../SG/sg_progress_tail.json",
  iona: "../IONA/iona_progress_tail.json"
};

let cron = require("node-cron");
let data = [];
let alertData = [];
let alertCompareData = {};
let sampleRun;
const fs = require("fs");
const writeFile = (filename, content) => {
  fs.writeFile(filename, content, () => {});
};
let datetime = new Date();
console.log("Before running a task every time - " + datetime);

cron.schedule("*/1 * * * *", function () {
  // let datetime = new Date();
  console.log("crontab running a task every time - " + datetime);
  data.nips = JSON.parse(fs.readFileSync(webJSONListPath.nips).toString());
  // data.sg = JSON.parse(fs.readFileSync(webJSONListPath.sg).toString());
  // data.iona = JSON.parse(fs.readFileSync(webJSONListPath.iona).toString());

  for (let productType in data) {
    alertData = [];

    for (let index = 0; index < data[productType].length; index++) {
      if (data[productType][index].closed == "0" || data[productType][index].closed == "") {
        let sample = data[productType][index];
        sampleRun = filterSampleRun(sample, productType);

        if (typeof sampleRun != "undefined" && sampleRun.length > 0) {
          // console.log(sampleRun, 'aaa', sampleRun.length);
          alertData.push(sampleRun);
        }
      }
    }

    let writeContentPath = "../mailCheckBox/" + productType + "_mailContent.txt";
    let writeCheckPath = "../mailCheckBox/" + productType + "_mailCheck.txt";
    // console.log(productType, alertData);
    // console.log('################');

    let flag = 0;
    if (fs.existsSync(writeContentPath) && fs.existsSync(writeCheckPath) && alertData.length > 0) {
      let count = parseInt(fs.readFileSync(writeCheckPath).toString());
      let writeContent = JSON.parse(fs.readFileSync(writeContentPath).toString());
      // console.log('WriteContent');
      // console.log(writeContent);

      let compareResult = compareMailContent(alertData, writeContent, productType, count);
      // console.log('compareResult');
      // console.log(compareResult);
      console.log(compareResult.writeContent);

      writeMailContent(compareResult.finalArray, productType);
      writeFile(writeContentPath, JSON.stringify(compareResult.writeContent));
    } else {
      if (alertData != "" && alertData.length > 0) {
        writeFile(writeContentPath, JSON.stringify(alertData));
        writeFile(writeCheckPath, 1);
        writeMailContent(alertData, productType);
      }
    }
  }
});