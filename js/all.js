const cutOffSetttings = {
  nips: {
    totalTime: "11:23:03",
    sequencedTime: "07:05:04",
    analyzedTime: "03:46:22",
    ondellTime: "00:23:05",
    convertedTime: "00:04:51",
    incloudTime: "00:03:09",
    downloadedTime: "00:09:42",
    jobsubmittedTime: "00:40:36",
    jobcompletedTime: "00:12:05",
    backtodellTime: "00:03:17",
  },
  iona: {
    totalTime: "16:20:15",
    sequencedTime: "15:55:22",
    analyzedTime: "00:00:00",
    ondellTime: "00:08:24",
    convertedTime: "00:18:12",
    incloudTime: "00:49:53",
    downloadedTime: "00:12:19",
    jobsubmittedTime: "00:01:00",
    jobcompletedTime: "00:17:36",
    backtodellTime: "00:16:31",
  },
  sg: {
    totalTime: "16:09:05",
    sequencedTime: "15:30:10",
    analyzedTime: "00:00:00",
    ondellTime: "00:07:12",
    convertedTime: "00:00:00",
    incloudTime: "00:01:22",
    downloadedTime: "00:06:24",
    jobsubmittedTime: "00:01:01",
    jobcompletedTime: "00:37:17",
    backtodellTime: "00:03:52",
  },
  ctdna: {
    totalTime: "23:59:59",
    sequencedTime: "23:59:59",
    analyzedTime: "23:59:59",
    ondellTime: "23:59:59",
    convertedTime: "23:59:59",
    incloudTime: "23:59:59",
    downloadedTime: "23:59:59",
    jobsubmittedTime: "23:59:59",
    jobcompletedTime: "23:59:59",
    backtodellTime: "23:59:59",
  },
  arrayv2: {
    totalTime: "23:59:59",
    sequencedTime: "23:59:59",
    analyzedTime: "23:59:59",
    ondellTime: "23:59:59",
    convertedTime: "23:59:59",
    incloudTime: "23:59:59",
    downloadedTime: "23:59:59",
    jobsubmittedTime: "23:59:59",
    jobcompletedTime: "23:59:59",
    backtodellTime: "23:59:59",
  },
  arrayv3: {
    totalTime: "23:59:59",
    sequencedTime: "23:59:59",
    analyzedTime: "23:59:59",
    ondellTime: "23:59:59",
    convertedTime: "23:59:59",
    incloudTime: "23:59:59",
    downloadedTime: "23:59:59",
    jobsubmittedTime: "23:59:59",
    jobcompletedTime: "23:59:59",
    backtodellTime: "23:59:59",
  },
  csv1: {
    totalTime: "23:59:59",
    sequencedTime: "23:59:59",
    analyzedTime: "23:59:59",
    ondellTime: "23:59:59",
    convertedTime: "23:59:59",
    incloudTime: "23:59:59",
    downloadedTime: "23:59:59",
    jobsubmittedTime: "23:59:59",
    jobcompletedTime: "23:59:59",
    backtodellTime: "23:59:59",
  },
  csv2: {
    totalTime: "23:59:59",
    sequencedTime: "23:59:59",
    analyzedTime: "23:59:59",
    ondellTime: "23:59:59",
    convertedTime: "23:59:59",
    incloudTime: "23:59:59",
    downloadedTime: "23:59:59",
    jobsubmittedTime: "23:59:59",
    jobcompletedTime: "23:59:59",
    backtodellTime: "23:59:59",
  },
  csv3: {
    totalTime: "23:59:59",
    sequencedTime: "23:59:59",
    analyzedTime: "23:59:59",
    ondellTime: "23:59:59",
    convertedTime: "23:59:59",
    incloudTime: "23:59:59",
    downloadedTime: "23:59:59",
    jobsubmittedTime: "23:59:59",
    jobcompletedTime: "23:59:59",
    backtodellTime: "23:59:59",
  },
};

/**
 * Getting JSON List and Progress Status Info function
 * The info of Clicking Progress Bar Event from JSON List
 * @param {*} path //JSON List Path
 * @returns
 */
function getJSONList(path, productTypeIndex) {
  const productType = ["nips", "sg", "iona", "ctdna", "arrayv2", "arrayv3", "csv1", "csv2", "csv3"];
  let statusDetail;
  let productCount = 3;
  /* Asynchronous ajax */
  let xhr = $.getJSON(path, function (data) {
    let fileTime = String(new Date(xhr.getResponseHeader("Last-Modified")));
    let res = fileTime.split(" ");
    let numberMonth = "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(res[1]) / 3 + 1;
    numberMonth = ("0" + numberMonth).slice(-2);
    let updatedTime = res[3] + "/" + numberMonth + "/" + res[2] + " " + res[4];

    let dataStringty = JSON.stringify(data);
    // console.log(data);

    localStorage.setItem(productType[productTypeIndex], dataStringty);

    getProgressStatus(data, productTypeIndex);
    statusDetail = getStatusDetail(data, productTypeIndex);
    $("." + productType[productTypeIndex] + "-updatedTime").html("Last Updated Time: " + updatedTime);

    modifyDurationTime(data, productType[productTypeIndex] + "-");
    setTimeout(function () {
      getJSONList(path, productTypeIndex);
    }, 60000);
    // console.log("getJSONList running");
  });
}

/**
 * Function of modifing sample run duration time or initing it
 *
 * @param {Array of JSON} JSONList
 * @param {Product} productType
 */
function modifyDurationTime(JSONList, productType) {
  // console.log(JSONList);
  let temp = JSONList;
  // temp = JSON.parse(JSONList);
  let newDate = new Date();
  let second = ("0" + newDate.getSeconds()).slice(-2);

  Object.keys(temp).forEach(function (sampleRun, index) {
    if (typeof temp[sampleRun].timeUsed == "undefined") {
      //adding time-used class and text if its type is undefined!
      $("#" + productType + "timeUsed" + index)
        .find("span")
        .removeClass("badge-dark")
        .addClass("badge-warning");
      $("#" + productType + "timeUsed" + index)
        .find("span")
        .text("00:00:00");
    } else {
      let durationHour = temp[sampleRun].totalTime.split(":")[0];

      if (durationHour >= 12) {
        //adding warning class if its duration time over half a day
        $("#" + productType + "timeUsed" + index)
          .find("span")
          .removeClass("badge-dark")
          .addClass("badge-danger");
      }

      // $("#" + productType + "timeUsed" + index).find("span").text(temp[sampleRun].totalTime);
    }
  });
}

function movePseudoClock(productType, objectName) {
  setTimeout(function () {
    movePseudoClock(productType, objectName);
  }, 1000);

  let dataStorage = JSON.parse(localStorage.getItem(productType));
  let dataStorageString = [];
  let count = 0;

  for (let index = dataStorage.length - 12; index < dataStorage.length; index++) {
    if (index < 0) {
      index = 0;
    }
    let timeClock = dataStorage[index][objectName];
    // console.log(dataStorage[index][objectName]);

    // console.log(timeClock);
    if (dataStorage[index].closed == 0 || dataStorage[index].closed == "") {
      let hours = 0;
      if (parseInt(timeClock.split(":")[0]) < 10) {
        hours = parseInt(("0" + timeClock.split(":")[0]).slice(-2));
      } else {
        hours = parseInt(timeClock.split(":")[0]);
      }
      // hours = parseInt(('0' + timeClock.split(':')[0]).slice(-2));
      let mins = parseInt(("0" + timeClock.split(":")[1]).slice(-2));
      let seconds = parseInt(("0" + timeClock.split(":")[2]).slice(-2));
      let newPseudoClock;
      // console.log(timeClock);
      seconds += 1;

      if (seconds >= 60) {
        seconds = seconds - 60;
        mins += 1;
      }

      if (mins >= 60) {
        mins = mins - 60;
        hours += 1;
      }
      mins = ("0" + mins).slice(-2);
      seconds = ("0" + seconds).slice(-2);

      if (hours < 9) {
        hours = ("0" + hours).slice(-2);
      }

      newPseudoClock = hours + ":" + mins + ":" + seconds;

      if (objectName === "totalTime") {
        $("#" + productType + "-timeUsed" + index)
        .find("span")
        .text(newPseudoClock);
        
      }
      

      dataStorage[index].totalTime = newPseudoClock;
    } else {
      if (objectName === "totalTime") {
        $("#" + productType + "-timeUsed" + index)
        .find("span")
        .text(timeClock);
        
      }
      
    }

    dataStorageString[count] = dataStorage[index];
    count += 1;
  }

  localStorage.setItem(productType, JSON.stringify(dataStorageString));
}

/**
 * select the description in every step
 *
 * @param {*} iconInfo
 * @returns product and its step description
 */
function selectStepID(iconInfo) {
  const productStep = {
    nips: {
      step1: "Sequenced",
      step2: "Analyzed",
      step3: "Transferred to Dell",
      step4: "Converted to Fastq",
      step5: "Transferred to Cloud",
      step6: "Transferred to Comp.Node",
      step7: "Job submitted",
      step8: "Job completed",
      step9: "Report Transferred to Dell",
    },
    sg: {
      step1: "Sequenced",
      step2: "Analyzed",
      step3: "Transferred to Dell",
      step4: "Converted to Fastq",
      step5: "Transferred to Cloud",
      step6: "Transferred to Comp.Node",
      step7: "Job submitted",
      step8: "Job completed",
      step9: "Report Transferred to Dell",
    },
    iona: {
      step1: "Sequenced",
      step2: "Analyzed",
      step3: "Transferred to Dell",
      step4: "Converted to Fastq",
      step5: "Transferred to Cloud",
      step6: "Transferred to Comp.Node",
      step7: "Job submitted",
      step8: "Job completed",
      step9: "Report Transferred to Dell",
    },
    ctdna: {
      step1: "Sequenced",
      step2: "Analyzed",
      step3: "Transferred to Dell",
      step4: "Converted to Fastq",
      step5: "Transferred to Cloud",
      step6: "Transferred to Comp.Node",
      step7: "Job submitted",
      step8: "Job completed",
      step9: "Report Transferred to Dell",
    },
    arrayv2: {
      // step1: "Sequenced",
      // step2: "Analyzed",
      // step3: "Transferred to Dell",
      // step4: "Converted to Fastq",
      // step5: "Transferred to Cloud",
      step6: "Transferred to Cloud",
      step7: "Job submitted",
      step8: "Job completed",
      step9: "Report Transferred to NAS",
    },
    arrayv3: {
      // step1: "Sequenced",
      // step2: "Analyzed",
      // step3: "Transferred to Dell",
      // step4: "Converted to Fastq",
      // step5: "Transferred to Cloud",
      step6: "Transferred to Cloud",
      step7: "Job submitted",
      step8: "Job completed",
      step9: "Report Transferred to NAS",
    },
    csv1: {
      // step1: "Sequenced",
      // step2: "Analyzed",
      // step3: "Transferred to Dell",
      // step4: "Converted to Fastq",
      // step5: "Transferred to Cloud",
      step6: "Transferred to Cloud",
      step7: "Job submitted",
      step8: "Job completed",
      step9: "Report Transferred to NAS",
    },
    csv2: {
      // step1: "Sequenced",
      // step2: "Analyzed",
      // step3: "Transferred to NAS",
      // step4: "Converted to Fastq",
      // step5: "Transferred to Cloud",
      step6: "Transferred to Cloud",
      step7: "Job submitted",
      step8: "Job completed",
      step9: "Report Transferred to NAS",
    },
    csv3: {
      // step1: "Sequenced",
      // step2: "Analyzed",
      // step3: "Transferred to NAS",
      // step4: "Converted to Fastq",
      // step5: "Transferred to Cloud",
      step6: "Transferred to Cloud",
      step7: "Job submitted",
      step8: "Job completed",
      step9: "Report Transferred to NAS",
    },
  };

  return productStep[iconInfo.productType][iconInfo.iconStepId];
}

/**
 * click progress icon and adding collapsed class and changing their info
 *
 * @param {*} statusDetail
 */
function clickProgressIcon(product) {
  // console.log(statusDetail);

  $(".step-body").click(function (event) {
    let data = JSON.parse(localStorage.getItem(product));

    let id = $(this).parents("div").attr("id").split("-progressId")[1];
    let productType = $(this).parents("div").attr("id").split("-progressId")[0];
    // console.log(data[id]);

    $(this)
      .parents()
      .find("#collapseStepInfo" + id)
      .children()
      .empty(); //empty their class and content

    let iconStepId = $(this).attr("id").split("icon-")[1];
    let iconInfo = {
      productType: productType,
      id: id,
      iconStepId: iconStepId,
    };
    // console.log(iconInfo, iconStepId);

    let selectedID = selectStepID(iconInfo);
    let collapaseContent = "Indicated Step: " + selectedID;
    let currentStatus = "Status: " + $(this).parents("table").attr("data-step-status");
    let currentStatusDetail = $(this).parents("td").attr("data-step");
    let currentStatusTimeName = currentStatusDetail + "Time";
    let collapseStatusDetail = "";
    let currentStatusTime = data[id][currentStatusTimeName];
    let alarmTime = cutOffSetttings[product][currentStatusTimeName];
    const runNo = data[id]["runNo"];
    // console.log(alarmTime);

    let sampleRunNumber = $(this).parents(".div-progress").find(".row-sampleRun").length;

    if (currentStatusTime === "00:00:30" && data[id][currentStatusDetail + "Start"] != "00:00:30" ) {
      const sampleYY = parseInt(data[id][currentStatusDetail + "Start"].split(/[:-]/)[0]);
      const sampleMM = parseInt(data[id][currentStatusDetail + "Start"].split(/[:-]/)[1]) - 1;
      const sampleDD = parseInt(data[id][currentStatusDetail + "Start"].split(/[:-]/)[2]);
      const sampleHours = parseInt(data[id][currentStatusDetail + "Start"].split(/[:-]/)[3]);
      const sampleMins = parseInt(data[id][currentStatusDetail + "Start"].split(/[:-]/)[4]);
      const sampleSecs = parseInt(data[id][currentStatusDetail + "Start"].split(/[:-]/)[5]);
      const totalSecs = new Date(sampleYY, sampleMM, sampleDD, sampleHours, sampleMins, sampleSecs).getTime();
      const currSecs = new Date().getTime();
      // console.log(currSecs,totalSecs);
      currentStatusTime = (currSecs - totalSecs) / 1000;
      currentStatusTime = new Date(parseInt(currentStatusTime) * 1000).toISOString().substr(11, 8);
    } else if (currentStatusTime === "00:00:30" && data[id][currentStatusDetail + "Start"] === "00:00:30") {
      const sampleHours = parseInt(data[id][currentStatusTimeName].split(/[:-]/)[0]);
      const sampleMins = parseInt(data[id][currentStatusTimeName].split(/[:-]/)[1]);
      const sampleSecs = parseInt(data[id][currentStatusTimeName].split(/[:-]/)[2]);
      console.log(sampleHours,sampleMins,sampleSecs,data[id][currentStatusTimeName],id,currentStatusTimeName);
      const newDate = new Date((sampleHours * 60 * 60 + sampleMins * 60 + sampleSecs + 1) * 1000).toISOString().substr(11, 8);
      data[id][currentStatusTimeName] = newDate;
      localStorage.setItem(productType, JSON.stringify(data));
      // movePseudoClock(product, currentStatusTimeName);
    }

    Object.keys(data[id]).some(function (key) {
      data[id][key] += "";
      if (key == currentStatusDetail && data[id][key].match(/\d+\/\d+/)) {
        collapseStatusDetail = "Data Info: " + data[id][key];
        return;
      }
    });

    /* adding collapsed Content and changing class*/
    $(this)
      .parents()
      .find("#collapseStepInfo" + id)
      .children()
      .html("<div class='col-6 text-left'><h6>" + collapaseContent + "</h6><h6>RunNo: " + runNo + "</h6></div>");
    $(this)
      .parents()
      .find("#collapseStepInfo" + id)
      .children()
      .append(
        "<div class='col-6 text-right' id='contentStatus'><h6 class='step-duration'>Step Duration: " +
        currentStatusTime +
        "</h6><h6>" +
        collapseStatusDetail +
        "</h6><h6> " +
        currentStatus +
        "</h6><h6>Alarm: " +
        alarmTime +
        "</h6></div>"
      );
    // $(this).parents().find('#collapseStepInfo' + id).children().text(collapaseContent);

    for (let i = 0; i < sampleRunNumber; i++) {
      if (id != i) {
        $(this)
          .parents()
          .find("#collapseStepInfo" + i)
          .removeClass("show");

        $(this)
          .parents()
          .find("#collapseStepInfo" + i).removeClass('notransition');
      }

    }

    if (
      $(this)
      .parents()
      .find("#collapseStepInfo" + id)
      .val() != "" &&
      $(this)
      .parents()
      .find("#collapseStepInfo" + id)
      .val() != $(this).attr("id")
    ) {
      $(this)
        .parents()
        .find("#collapseStepInfo" + id)
        .val($(this).attr("id"));

      $(this)
        .parents()
        .find("#collapseStepInfo" + id).addClass('notransition');
      $(this)
        .parents()
        .find("#collapseStepInfo" + id)
        .removeClass("show");

      // console.log($(this).parents("div").attr('id') + " " + $(this).parents().find("#collapseStepInfo" + id).val());
    } else {
      $(this)
        .parents()
        .find("#collapseStepInfo" + id)
        .val($(this).attr("id"));
      // console.log($(this).parents().find('#collapseStepInfo' + id).val());
    }
  });

  $(".progress-body").click(function (event) {
    console.log("123");
    let id = $(this).parents("div").attr("id").split("-progressId")[1];
    let productType = $(this).parents("div").attr("id").split("-progressId")[0];
    let sampleRunNumber = $(this).parents(".div-progress").find(".row-sampleRun").length;
    let collapaseContent = "Interval Time: 00:00:30";


    console.log(id, productType, sampleRunNumber);
    $(this)
      .parents()
      .find("#collapseStepInfo" + id)
      .children()
      .html("<div class='col-12 text-center'><h6>" + collapaseContent + "</h6></div>");

    for (let i = 0; i < sampleRunNumber; i++) {
      if (id != i) {
        $(this)
          .parents()
          .find("#collapseStepInfo" + i)
          .removeClass("show");

        $(this)
          .parents()
          .find("#collapseStepInfo" + i).removeClass('notransition');
      }

    }

    if (
      $(this)
      .parents()
      .find("#collapseStepInfo" + id)
      .val() != "" &&
      $(this)
      .parents()
      .find("#collapseStepInfo" + id)
      .val() != $(this).attr("id")
    ) {
      $(this)
        .parents()
        .find("#collapseStepInfo" + id)
        .val($(this).attr("id"));

      $(this)
        .parents()
        .find("#collapseStepInfo" + id).addClass('notransition');
      $(this)
        .parents()
        .find("#collapseStepInfo" + id)
        .removeClass("show");

      // console.log($(this).parents("div").attr('id') + " " + $(this).parents().find("#collapseStepInfo" + id).val());
    } else {
      $(this)
        .parents()
        .find("#collapseStepInfo" + id)
        .val($(this).attr("id"));
      // console.log($(this).parents().find('#collapseStepInfo' + id).val());
    }

  });
}

/**
 * Changing Progress Status
 *
 * @param {*} [progressContent=data]
 * @param {number} [productTypeIndex=1]
 */
function getProgressStatus(progressContent = data, productTypeIndex = 1) {
  const productType = ["#nips", "#sg", "#iona", "#ctdna", "#arrayv2", "#arrayv3", "#csv1", "#csv2", "#csv3"];
  let regexp = /(\d+)\/(\d+)/;

  //NOTE To determine which run-stauts was Pending, Pass, Fail and Active and show in the collapsed content
  progressContent.forEach(function (sampleRun, index) {
    $(productType[productTypeIndex] + "-runId" + index).text(sampleRun.runid);

    if (sampleRun.closed == 0) {
      //fail, active or pending progress info added

      if (sampleRun.sequenced == 0 && sampleRun.error == 0) {
        //pending progress info added
        $(productType[productTypeIndex] + "-progressId" + index)
          .find(".stepbar-progress")
          .attr("data-current-step", "sequenced");
        $(productType[productTypeIndex] + "-progressId" + index)
          .find(".stepbar-progress")
          .attr("data-step-status", "pending");

        // movePseudoStepClock(productType[productTypeIndex].split("#")[1], "sequencedTime");
        return;
      }
      if (sampleRun.error == 1) {
        //fail progress info added
        let failStep;
        Object.keys(sampleRun).some(function (key) {
          //loop to find "fail" progress key and value
          if (sampleRun[key] == 0 && key != "error" && key != "closed") {
            failStep = key;
          }
        });
        $(productType[productTypeIndex] + "-progressId" + index)
          .find(".stepbar-progress")
          .attr("data-current-step", failStep);
        $(productType[productTypeIndex] + "-progressId" + index)
          .find(".stepbar-progress")
          .attr("data-step-status", "fail");
      } else {
        //active progress info added
        let flag = 0;
        // console.log(sampleRun);

        Object.keys(sampleRun).some(function (key) {
          sampleRun[key] += "";
          if (sampleRun[key] == 0 && key != "error" && key != "closed" && flag != 1) {
            //active
            // console.log(key + '=' + sampleRun[key]);
            $(productType[productTypeIndex] + "-progressId" + index)
              .find(".stepbar-progress")
              .attr("data-current-step", key);
            $(productType[productTypeIndex] + "-progressId" + index)
              .find(".stepbar-progress")
              .attr("data-step-status", "active");
            // console.log("null\t" + key + "\t" + sampleRun[key]);
            flag = 1;
          } else if (sampleRun[key].match(regexp) != null) {
            // console.log(sampleRun[key]);

            if (sampleRun[key].match(regexp)[1] != sampleRun[key].match(regexp)[2]) {
              // console.log(key);
              $(productType[productTypeIndex] + "-progressId" + index)
                .find(".stepbar-progress")
                .attr("data-current-step", key);
              $(productType[productTypeIndex] + "-progressId" + index)
                .find(".stepbar-progress")
                .attr("data-step-status", "active");

              flag = 1;
            }
          }
        });
      }
    } else {
      //pass progress info added
      // console.log($("#nips-progressId" + index).find(".stepbar-progress"));
      $(productType[productTypeIndex] + "-progressId" + index)
        .find(".stepbar-progress")
        .attr("data-current-step", "backtodell");
      $(productType[productTypeIndex] + "-progressId" + index)
        .find(".stepbar-progress")
        .attr("data-step-status", "pass");
    }
  });
}

/**
 * Getting Something Status Detail which showed the run numbers in Json List
 *
 * @param {*} [progressContent=data]
 * @param {number} [productTypeIndex=1]
 * @returns
 */
function getStatusDetail(progressContent = data, productTypeIndex = 1) {
  const productType = ["#nips", "#sg", "#iona", "#ctdna", "#arrayv2", "#arrayv3", "#csv1", "#csv2", "#csv3"];
  let statusDetail = [];
  // console.log(productTypeIndex, data);

  let regexp = /(\d+)\/(\d+)/;
  console.log(progressContent,productType[productTypeIndex]);
  progressContent.forEach(function (sampleRun, index) {
    let incloudNumber = 0;
    let downloadedNumber = 0;
    let jobsubmittedNumber = 0;
    let jobcompletedNumber = 0;
    sampleRun.jobsubmitted += "";
    sampleRun.jobcompleted += "";
    // console.log(sampleRun.incloud, index);
    sampleRun.incloud = sampleRun.incloud.toString();
    
    if (sampleRun.incloud === "undefined"|| sampleRun.incloud === "1") {
      incloudNumber = 2;
    } else if (sampleRun.incloud.match(regexp)) {
      
      //if incloud matched the run numbers
      // console.log(sampleRun.incloud.match(regexp));
      incloudNumber = sampleRun.incloud.match(regexp)[0];
    } else {

      incloudNumber = 1;
    }

    sampleRun.downloaded = sampleRun.downloaded.toString();
    if (sampleRun.downloaded.match(regexp)) {
      //if downloaded matched the run numbers
      // console.log(sampleRun.downloaded.match(regexp));
      downloadedNumber = sampleRun.downloaded.match(regexp)[0];
      // console.log(downloadedNumber);
    } else {
      downloadedNumber = sampleRun.downloaded * 1;
    }

    if (sampleRun.jobsubmitted.match(regexp)) {
      //if jobsubmitted matched the run numbers
      // console.log(sampleRun.jobsubmitted.match(regexp));
      jobsubmittedNumber = sampleRun.jobsubmitted.match(regexp)[0];
    }

    if (sampleRun.jobcompleted.match(regexp)) {
      //if jobcompleted matched the run numbers
      // console.log(sampleRun.jobcompleted.match(regexp));
      jobcompletedNumber = sampleRun.jobcompleted.match(regexp)[0];
    }

    statusDetail.push({
      //push the JSON List
      productType: productType[productTypeIndex],
      index: index,
      incloud: incloudNumber,
      downloaded: downloadedNumber,
      jobsubmitted: jobsubmittedNumber,
      jobcompleted: jobcompletedNumber,
    });
  });
  // console.log(statusDetail);
  return statusDetail;
}

function fixScroll() {
  window.onscroll = function () {
    var header = document.getElementById("scroll-fix");
    var sticky = header.offsetTop;

    if (window.pageYOffset > 460) {
      header.classList.remove("fadeOutDown");
      header.classList.add("fadeInUp");
    } else {
      header.classList.remove("fadeInUp");
      header.classList.add("fadeOutDown");
    }
  };
}

function fixStepCircle(stepArray) {
  $(".step-body").click(function (event) {
    if ($(this).hasClass("step-choose-circle")) {
      $(this).removeClass("step-choose-circle");
      return;
    }
    for (let index = 0; index < stepArray.length; index++) {
      stepArray[index].classList.remove("step-choose-circle");
    }

    $(this).addClass("step-choose-circle");
  });
}

function addInfo() {
  content = `<span class="authorInfo">Designed by: 姜權芳 #6503</span>`;
  $("footer").append(content);
}

$(document).ready(function myfunction() {
  let product = $(document)[0].title.split(" ")[0];

  const JSONListPath = [
    "../NIPS/nips_progress_tail.json",
    "../SG/sg_progress_tail.json",
    "../IONA/iona_progress_tail.json",
    "../ctDNA/ctdna_progress_tail.json",
  ];

  if (product == "NIPS") {
    getJSONList(JSONListPath[0], 0);
  } else if (product == "SG") {
    getJSONList(JSONListPath[1], 1);
  } else if (product == "IONA") {
    getJSONList(JSONListPath[2], 2);
  } else if (product == "ctDNA") {
    getJSONList(JSONListPath[3], 3);
  }

  clickProgressIcon(product.toLowerCase());
  movePseudoClock(product.toLowerCase(), "totalTime");

  var el = document.getElementsByClassName("step-body");
  fixStepCircle(el);
  fixScroll();
  addInfo();
});