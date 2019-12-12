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

  let subjectTitle = 'Report-Tracking System Notify - ' + productType.toUpperCase();

  //引用 nodemailer
  let nodemailer = require('nodemailer');

  let maillist = {
    "nips": [
      // 'bmi.hcy@sofivagenomics.com.tw',
      'bmi.cfc@sofivagenomics.com.tw',
      'tklin@sofivagenomics.com.tw',
      'yichu@sofivagenomics.com.tw',
      'tsuling@sofivagenomics.com.tw',
      // 'nips@sofivagenomics.com.tw',
      'ying@sofivagenomics.com.tw',
      'tehyang.hwa@sofivagenomics.com.tw',
    ],
    "sg": [
      // 'bmi.hcy@sofivagenomics.com.tw',
      'bmi.cfc@sofivagenomics.com.tw',
      'tklin@sofivagenomics.com.tw',
      'yichu@sofivagenomics.com.tw',
      'tsuling@sofivagenomics.com.tw',
      // 'nips@sofivagenomics.com.tw',
      'ying@sofivagenomics.com.tw',
      'tehyang.hwa@sofivagenomics.com.tw',
    ],
    "iona": [
      // 'bmi.hcy@sofivagenomics.com.tw',
      'bmi.cfc@sofivagenomics.com.tw',
      'tklin@sofivagenomics.com.tw',
      'yichu@sofivagenomics.com.tw',
      'tsuling@sofivagenomics.com.tw',
      // 'iona@sofivagenomics.com.tw',
      'yuchen@sofivagenomics.com.tw',
      'tehyang.hwa@sofivagenomics.com.tw',
    ]
  };

  let sendList = maillist[productType];

  //宣告發信物件
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'sofiva.bmi@gmail.com',
      pass: 'zabvtgxrhahvjjqh'
    }
  });

  let options = {
    //寄件者
    from: 'sofiva.bmi@gmail.com',
    //收件者
    to: sendList,
    //副本
    // cc: 'bmi.cfc@sofivagenomics.com.tw',
    //密件副本
    bcc: 'bmi.cfc@sofivagenomics.com.tw',
    //主旨
    subject: subjectTitle, // Subject line
    //純文字
    text: 'Hello world!', // plaintext body
    //嵌入 html 的內文
    html: content,


    // '<h2>Why and How</h2> <p>The <a href="http://en.wikipedia.org/wiki/Lorem_ipsum" title="Lorem ipsum - Wikipedia, the free encyclopedia">Lorem ipsum</a> text is typically composed of pseudo-Latin words. It is commonly used as placeholder text to examine or demonstrate the visual effects of various graphic design. Since the text itself is meaningless, the viewers are therefore able to focus on the overall layout without being attracted to the text.</p>',
    //附件檔案
    // attachments: [ {
    //     filename: 'text01.txt',
    //     content: '聯候家上去工的調她者壓工，我笑它外有現，血有到同，民由快的重觀在保導然安作但。護見中城備長結現給都看面家銷先然非會生東一無中；內他的下來最書的從人聲觀說的用去生我，生節他活古視心放十壓心急我我們朋吃，毒素一要溫市歷很爾的房用聽調就層樹院少了紀苦客查標地主務所轉，職計急印形。團著先參那害沒造下至算活現興質美是為使！色社影；得良灣......克卻人過朋天點招？不族落過空出著樣家男，去細大如心發有出離問歡馬找事'
    // }, {
    //     filename: 'unnamed.jpg',
    //     path: '/Users/Weiju/Pictures/unnamed.jpg'
    // }]
    // attachments: [{
    //   filename: 'unnamed.gif',
    //   path: '../images/unnamed.gif',
    //   cid: 'unique@kreata.ee' //same cid value as in the html img src
    // }]
  };

  //發送信件方法
  transporter.sendMail(options, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('訊息發送: ' + info.response);
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

  //default cut-off
  const cutOffSetttings = {
    "nips": {
      "totalTime": 12,
      "sequencedTime": 1,
      "analyzedTime": 6,
      "ondellTime": 6,
      "convertedTime": 6,
      "incloudTime": 6,
      "downloadedTime": 6,
      "jobsubmittedTime": 6,
      "jobcompletedTime": 6,
      "backtodellTime": 6
    },
    "iona": {
      "totalTime": 12,
      "sequencedTime": 1,
      "analyzedTime": 6,
      "ondellTime": 6,
      "convertedTime": 6,
      "incloudTime": 6,
      "downloadedTime": 6,
      "jobsubmittedTime": 6,
      "jobcompletedTime": 6,
      "backtodellTime": 6
    },
    "sg": {
      "totalTime": 12,
      "sequencedTime": 1,
      "analyzedTime": 6,
      "ondellTime": 6,
      "convertedTime": 6,
      "incloudTime": 6,
      "downloadedTime": 6,
      "jobsubmittedTime": 6,
      "jobcompletedTime": 6,
      "backtodellTime": 6
    }
  };

  for (const key in sample) {
    durationName = key + "Time";

    //To find without step name. If its not match with step, ignore it. 
    if (key == "runid" || key.match(/(.*)Time/) || key == "closed" || key == "error" || key == "timeUsed") {
      continue;
    }

    let sampleHours = parseInt(sample[durationName].split(":")[0]);

    if (sample.closed != "1" && sampleHours >= cutOffSetttings[productType][durationName]) {

      let runid = sample.runid;
      let temp = {
        [productType]: {
          runid: runid,
          node: key,
          nodeTime: sample[durationName],
          totalTime: sample.totalTime
        }
      };

      newSampleRun = JSON.stringify(temp);
    }
  }
  return newSampleRun;
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
    <h2>Report-Tracking system</h2>
    <p>Some data processed longer than expected. Please confirm progress step and data status</p>
    <p>The information is summerized below:</p>
    <h4>PRODUCT: ${product}</h4>
    <table style = "border-collapse: collapse; width:800px;">
      <col width = "40%">
      <col width = "30%">
      <col width = "15%">
      <col width = "15%">
        <tr>
          <th style = "border-bottom: 1px solid #ddd; padding:10px 0px; background-color: #6bc541;"> Run ID </th> 
          <th style = "border-bottom: 1px solid #ddd; background-color: #6bc541;"> Step </th> 
          <th style = "border-bottom: 1px solid #ddd; background-color: #6bc541;"> Duration </th> 
          <th style = "border-bottom: 1px solid #ddd; background-color: #6bc541;"> Elapsed Time </th> 
        </tr>`;

  for (let index = 0; index < data.length; index++) {
    let mailInfo = JSON.parse(data[index]);

    if (typeof (mailInfo[productType]) != "undefined") {
      content += `\n<tr>\n`;
      content += `<td align='center' style='border-bottom: 1px solid #ddd; padding:10px 0px;'>${mailInfo[productType].runid}</td>\n`;
      content += `<td align='center' style='border-bottom: 1px solid #ddd;'>${mailInfo[productType].node}</td>\n`;
      content += `<td align='center' style='border-bottom: 1px solid #ddd;'>${mailInfo[productType].nodeTime}</td>\n`;
      content += `<td align='center' style='border-bottom: 1px solid #ddd;'>${mailInfo[productType].totalTime}</td>\n`;
      content += `</tr>\n`;
      flag = true;
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

function compareMailContent(alertData, writeContent, productType) {
  let finalArray = [];

  if (typeof writeContent.length == "undefined") {
    alertData.forEach((el) => {
      alertDataJSON = JSON.parse(el);
      if (alertDataJSON[productType].runid == writeContent[productType].runid && alertDataJSON[productType].node == writeContent[productType].node) {
        finalArray.push(el);
      }
    });

    if (finalArray.length == 1 && alertData.length == 1) {
      return true;
    } else {
      return false;
    }
  } else {
    alertData.forEach((el) => writeContent.forEach((el2) => {
      alertDataJSON = JSON.parse(el);

      // console.log(alertDataJSON);
      if (alertDataJSON[productType].runid == el2[productType].runid && alertDataJSON[productType].node == el2[productType].node) {
        finalArray.push(el);
      }
    }));

    if (writeContent.length == finalArray.length) {
      return true;
    } else {
      return false;
    }
  }

}

const webJSONListPath = {
  "nips": '../NIPS/nips_progress_tail.json',
  "sg": '../SG/sg_progress_tail.json',
  "iona": '../IONA/iona_progress_tail.json'
};

let data = [];
let alertData = [];
let alertCompareData = {};
let sampleRun;
const fs = require('fs');
const writeFile = (filename, content) => {
  fs.writeFile(filename, content, () => {});
};

data.nips = JSON.parse(fs.readFileSync(webJSONListPath.nips).toString());
data.sg = JSON.parse(fs.readFileSync(webJSONListPath.sg).toString());
data.iona = JSON.parse(fs.readFileSync(webJSONListPath.iona).toString());

for (let productType in data) {
  alertData = [];

  for (let index = 0; index < data[productType].length; index++) {
    if (data[productType][index].closed == "0" || data[productType][index].closed == "") {

      let sample = data[productType][index];
      sampleRun = filterSampleRun(sample, productType);

      if (typeof (sampleRun) != "undefined") {
        alertData.push(sampleRun);
      }
    }
  }


  let writeContentPath = "../mailCheckBox/" + productType + "_mailContent.txt";
  let writeCheckPath = "../mailCheckBox/" + productType + "_mailCheck.txt";
  // console.log(alertData);
  let flag = 0;
  if (fs.existsSync(writeContentPath) && fs.existsSync(writeCheckPath)) {
    let count = parseInt(fs.readFileSync(writeCheckPath).toString());
    let writeContent = JSON.parse(fs.readFileSync(writeContentPath).toString());
    let compareResult = compareMailContent(alertData, writeContent, productType);

    if (compareResult == true && count <= 2) {
      writeMailContent(alertData, productType);
      count += 1;
      writeFile(writeContentPath, alertData);
      writeFile(writeCheckPath, count);
    } else if (compareResult == true && count > 2) {
      count += 1;
      writeFile(writeCheckPath, count);
    } else if (compareResult == false) {
      writeMailContent(alertData, productType);
      writeFile(writeContentPath, alertData);
      writeFile(writeCheckPath, 1);
    }

  } else {
    writeFile(writeContentPath, alertData);
    writeFile(writeCheckPath, 1);
    writeMailContent(alertData, productType);
  }

  // for (let index = 0; index < alertData.length; index++) {
  //   let alertDataJSON = JSON.parse(alertData[index]);

  //   if (fs.existsSync(writeContentPath) && fs.existsSync(writeCheckPath)) {
  //     let count = parseInt(fs.readFileSync(writeCheckPath).toString());
  //     let writeContent = JSON.parse(fs.readFileSync(writeContentPath).toString());


  //     // console.log(fs.readFileSync(writeContentPath).toString());


  //     if (typeof alertDataJSON[productType]['runid'] !== 'undefined' && typeof writeContent[productType]['node'] !== 'undefined') {
  //       // console.log(alertDataJSON[productType]['runid']);
  //       // console.log(writeContentJSON[productType]['node']);

  //       if (alertDataJSON[productType]['node'] == writeContent[productType]['node']) {
  //         flag = 1;
  //       } else {
  //         flag = 0;
  //       }

  //       if (flag == 1 && count <= 3) {
  //         console.log(count);
  //         writeMailContent(alertData, productType);
  //         count += 1;
  //         writeFile(writeCheckPath, count);
  //         console.log("flag is 1");

  //       } else if (count > 3) {
  //         writeFile(writeCheckPath, count);
  //         console.log("count is " + count);
  //       } else {
  //         writeMailContent(alertData, productType);
  //         writeFile(writeContentPath, JSON.stringify(alertDataJSON));
  //         writeFile(writeCheckPath, 1);
  //         console.log("flag is 0");
  //       }
  //     }

  //     // if (JSON.stringify(alertData) == fs.readFileSync(writeContentPath).toString() && count <= 2) {
  //     //   writeMailContent(alertData, productType);
  //     //   writeFile(writeCheckPath, count);
  //     // } else if (JSON.stringify(alertData) != fs.readFileSync(writeContentPath).toString()) {
  //     //   writeMailContent(alertData, productType);
  //     //   writeFile(writeContentPath, JSON.stringify(alertData));
  //     //   writeFile(writeCheckPath, 1);
  //     // }
  //   } else {
  //     writeFile(writeContentPath, JSON.stringify(alertDataJSON));
  //     writeFile(writeCheckPath, 1);
  //     writeMailContent(alertData, productType);
  //   }
  // }

  // writeMailContent(alertData, productType);
}