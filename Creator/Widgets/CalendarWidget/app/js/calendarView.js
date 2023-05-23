import { hotelRevenueData } from "./mockData.js";
import { e4sRevenueData } from "./mockData.js";
import { escapadeRevenueData } from "./mockData.js";
import { OMGRevenueData } from "./mockData.js";
import { escapadeRevenueTableData } from "./mockData.js";
import { OMGRevenueTableData } from "./mockData.js";
import { Calendar } from './calendar.js';

$(document).ready(function () {
  var serviceList = ["Cocktail", "Lunch", "Souper", "Privatisation", "Réunion"];
  var bookingServiceList = ["Apéreau", "Lever l'Ancre", "Prendre le large", "Autre"];
  //var statusList = ["Confirmé", "Proposition", "Prospect"];
  var statusList = ["Proposition"];
  getIncomeCategoryDetails();
  $('#incomeCategory').change(function () {
    console.log($("#calendar").find('div .events').innerHTML);
    $("#calendar").find(".events").innerHTML = "";
    $("#dealTable").innerHTML = "";
    var categoryValue = $(this).find(':selected').text();
    var categoryValueID = $(this).find(':selected').val();
    if (categoryValue == "OMG") {
      $('#service').empty();
      OMGRevenueData.length = 0;
      $.each(serviceList, function (key, value) {
        $('#service').append('<option value="' + value + '">' + value + '</option>');
        $('#serviceDiv').css("display", "block");
      });
      $('#service').change(function () {
        console.log($("#calendar").find(".events").innerHTML);
        $("#calendar").find(".events").innerHTML = "";
        var serviceValue = $(this).find(':selected').text();
        fetchDealRevenueDetailsOMGTotal(categoryValue, serviceValue);
        //fetchDealRevenueDetailsWithOMGStatus(categoryValue,serviceValue,"Proposition");
      });

    } else if (categoryValue == "Bâteau - Escapade Memphrémagog") {
      $('#service').empty();
      escapadeRevenueData.length = 0;
      $.each(bookingServiceList, function (index, value) {
        $('#service').append('<option value="' + value + '">' + value + '</option>');
        $('#serviceDiv').css("display", "block");
      });
      $('#service').change(function () {
        $("#calendar").find(".events").innerHTML = "";
        var serviceValue = $(this).find(':selected').text();
        fetchDealReveueTotalForEscapade(categoryValue, serviceValue);
        fetchOppReveueDetailsForEscapade(categoryValue, serviceValue, "Proposition");
      });
    } else if (categoryValue == "Hôtel - Verso") {
      $("#calendar").find(".events").innerHTML = "";
      hotelRevenueData.length = 0;
      e4sRevenueData.length = 0;
      $('#serviceDiv').css("display", "none");
      fetchDealRevenueDetailsTotal(categoryValue);
      fetchDealRevenueDetailsWithStatus(categoryValue, "Proposition");
    } else {
      hotelRevenueData.length = 0;
      e4sRevenueData.length = 0;
      $("#calendar").find(".events").innerHTML = "";
      $('#serviceDiv').css("display", "none");
      fetchDealRevenueDetailsTotalForE4s(categoryValue);
      fetchDealRevenueDetailsWithStatusForE4s(categoryValue, "Proposition");
    }
  });
});
function fetchOppReveueDetailsForEscapade(categoryValue, serviceValue, status) {
  var creatorSdk = ZOHO.CREATOR.init();
  creatorSdk.then(function (data) {
    getOppRevenueDetailsForEscapade("1");
  });
  function getOppRevenueDetailsForEscapade(pageNum) {
    console.log("categoryValue:" + categoryValue);
    var config = {
      appName: "pal-plus",
      reportName: "Opportunities_Ventes_Report",
      criteria: "(Income_Category == \"" + categoryValue + "\" && Booking_Service == \"" + serviceValue + "\" && Sales_Stage == \"" + status + "\")",
      page: pageNum,
      pageSize: 200
    }
    console.log(config);
    var getRecords = ZOHO.CREATOR.API.getAllRecords(config);
    getRecords.then(function (response) {
      console.log(JSON.stringify(response.data));
      var recordsLength = Object.keys(response.data).length;
      // if (recordsLength == 200) {

      //   getOppRevenueDetailsForEscapade(parseInt(pageNum) + 1);
      // }
      // else {
      //   console.log("Less than 200");
      // }
      createEventJSONForEscapade(response.data, recordsLength);
    });
    // }).catch(err){
    //   console.log("No matching records");
    //   console.log("nextconsolefortesting");
    // } 
  }
}
function createEventJSONForEscapade(dataList, length) {
  console.log("inside createEvenent escapade json :" + dataList);

  var index = 0;

  $.each(dataList, function (key, value) {
    if (value.Sales_Stage.toUpperCase() === "Confirmé".toUpperCase()) {
      var colorCodingClass = "bg-confirm";
    } else if (value.Sales_Stage.toUpperCase() === "Proposition".toUpperCase()) {
      colorCodingClass = "bg-proposition";
    } else if (value.Sales_Stage.toUpperCase() === "Prospect".toUpperCase()) {
      colorCodingClass = "bg-tentatiff";
    } else if (value.Sales_Stage.toUpperCase() === "Perdu".toUpperCase()) {
      colorCodingClass = "bg-perdu";
    } else if (value.Sales_Stage.toUpperCase() === "Pas de disponibilté".toUpperCase()) {
      colorCodingClass = "bg-pasde";
    } else {
      colorCodingClass = "bg-annule";
    }
    index = index + 1;
    if (value.Event_Date != null) {

      var item = {};
      item["ID"] = value.ID;
      item["time"] = value.Event_Date;
      item["cls"] = colorCodingClass;
      item["status"] = value.Sales_Stage;
      item["totalCount"] = value.Number_of_participants;
      //hotelRevenueData.push(day1Item);
    }
    var divExists = $(".event[time='" + index + "']");
    console.log(divExists.length);
    if (divExists.length == 0) {
      escapadeRevenueTableData.push(item);
    }
  });
  console.log(escapadeRevenueTableData);
  var cal = Calendar('calendar');
  cal.bindData(escapadeRevenueTableData);
  cal.render();
}

function fetchDealReveueTotalForEscapade(categoryValue, serviceValue) {
  var creatorSdk = ZOHO.CREATOR.init();
  creatorSdk.then(function (data) {
    getOppRevenueDetails("1");
  });
  function getOppRevenueDetails(pageNum) {

    var config = {
      appName: "pal-plus",
      reportName: "Opportunities_Ventes_Report",
      criteria: "(Income_Category == \"" + categoryValue + "\" && Booking_Service == \"" + serviceValue + "\" )",
      page: pageNum,
      pageSize: 200
    }
    console.log(config);
    var getRecords = ZOHO.CREATOR.API.getAllRecords(config);
    getRecords.then(function (response) {
      console.log("respFor Total::" + categoryValue + JSON.stringify(response));
      if (response.code == 3000) {
        var dataList = JSON.stringify(response.data);
        var recordsLength = Object.keys(response.data).length;
        createEventJsonForEscapade(response.data, recordsLength);
      } else {

        console.log("no matching records found");
      }
      // if (recordsLength == 200) {
      //   getOppRevenueDetails(parseInt(pageNum) + 1);
      // }
      // else {
      //   console.log("Less than 200");
      // }
    });
  }
}
function createEventJsonForEscapade(dataList, length) {
  escapadeRevenueData.length = 0;
  var colorCodingClass = "bg-green";
  var index = 0;
  var escapadeItem = {};
  var totalParticipants = 0;
  $.each(dataList, function (key, value) {
    console.log("value in escapade total::" + dataList);
    console.log(value.Number_of_participants);
    index = index + 1;
    if (value.Event_Date != "") {
      if (value.Event_Date == escapadeItem.time) {
        totalParticipants = totalParticipants + parseInt(value.Number_of_participants);
      } else {
        totalParticipants = totalParticipants + parseInt(value.Number_of_participants);
      }
      if (value.Event_Date != escapadeItem.time) {
        escapadeItem["ID"] = index;
        escapadeItem["time"] = value.Event_Date;
        escapadeItem["cls"] = colorCodingClass;
        escapadeItem["status"] = "Total";
        escapadeItem["totalCount"] = 176 - totalParticipants;
        escapadeRevenueData.push(escapadeItem);
      }
      console.log(totalParticipants);


    }
    // console.log(value.Event_Date);
    // var divExists = $(".event[time='" + value.Event_Date + "']");
    // console.log(divExists.length);
    // if (divExists.length == 0) {

    //}
  });
  console.log("total Escapade::" + escapadeRevenueData);
  var cal = Calendar('calendar');
  cal.bindData(escapadeRevenueData);
  cal.render();

}
function fetchDealRevenueDetailsWithOMGStatus(categoryValue, serviceValue, status) {
  var creatorSdk = ZOHO.CREATOR.init();
  creatorSdk.then(function (data) {
    getOppRevenueDetailsForOMG("1");
  });
  function getOppRevenueDetailsForOMG(pageNum) {
    var config = {
      appName: "pal-plus",
      reportName: "Opportunities_Ventes_Report",
      criteria: "(Income_Category == \"" + categoryValue + "\" && Service == \"" + serviceValue + "\" && Sales_Stage == \"" + status + "\")",
      page: pageNum,
      pageSize: 200
    }
    var getRecords = ZOHO.CREATOR.API.getAllRecords(config);
    getRecords.then(function (response) {
      console.log("resp omg" + JSON.stringify(response.data));
      var recordsLength = Object.keys(response.data).length;
      // if (recordsLength == 200) {
      //   getOppRevenueDetailsForOMG(parseInt(pageNum) + 1);
      // }
      // else {
      //   console.log("Less than 200");
      // }
      createEventJSONForResturant(response.data);
    });
  }
}
function createEventJSONForResturant(dataList) {

  console.log("inside createEvenent json:" + dataList);
  var index = 0;
  $.each(dataList, function (key, value) {
    index = index + 1;
    if (value.Event_Date != null) {
      var item = {};
      item["ID"] = index;
      item["time"] = value.Opportunity_ID.Event_Date;
      item["totalCount"] = value.Number_Of_participants;
      item["cls"] = "bg-black";

      var divExists = $(".event[time='" + index + "']");
      console.log(divExists.length);
      if (divExists.length == 0) {
        OMGRevenueTableData.push(item);
      }
    }
  });
  console.log(OMGRevenueTableData);
  var cal = Calendar('calendar');
  cal.bindData(OMGRevenueTableData);
  cal.render();
}

function fetchDealRevenueDetailsTotal(categoryValue) {

  var eventStatus = "";
  var creatorSdk = ZOHO.CREATOR.init();
  creatorSdk.then(function (data) {
    getOppRevenueDetails("1");
  });
  function getOppRevenueDetails(pageNum) {

    var config = {
      appName: "pal-plus",
      reportName: "Opportunities_Ventes_Report",
      criteria: "(Income_Category == \"" + categoryValue + "\" )",
      page: pageNum,
      pageSize: 200
    }
    console.log(config);
    var getRecords = ZOHO.CREATOR.API.getAllRecords(config);
    getRecords.then(function (response) {
      console.log("respFor Total::" + categoryValue + JSON.stringify(response));
      if (response.code == 3000) {
        eventStatus = "success";
        var dataList = JSON.stringify(response.data);
        var recordsLength = Object.keys(response.data).length;
        createEventJsonDataForTotal(response.data);
      } else {

        console.log("no matching records found");
      }
      // if (recordsLength == 200) {
      //   getOppRevenueDetails(parseInt(pageNum) + 1);
      // }
      // else {
      //   console.log("Less than 200");
      // }
    });
  }
  // return eventStatus;
}
function fetchDealRevenueDetailsTotalForE4s(categoryValue) {
  var eventStatus = "";
  var creatorSdk = ZOHO.CREATOR.init();
  creatorSdk.then(function (data) {
    getOppRevenueDetails("1");
  });
  function getOppRevenueDetails(pageNum) {

    var config = {
      appName: "pal-plus",
      reportName: "Opportunities_Ventes_Report",
      criteria: "(Income_Category == \"" + categoryValue + "\" )",
      page: pageNum,
      pageSize: 200
    }
    console.log(config);
    var getRecords = ZOHO.CREATOR.API.getAllRecords(config);
    getRecords.then(function (response) {
      // console.log("respFor Total::"+ categoryValue  + JSON.stringify(response));
      if (response.code == 3000) {
        eventStatus = "success";
        var dataList = JSON.stringify(response.data);
        var recordsLength = Object.keys(response.data).length;
        createEventJsonDataForTotalE4S(response.data);
      } else {

        console.log("no matching records found");
      }
      // if (recordsLength == 200) {
      //   getOppRevenueDetails(parseInt(pageNum) + 1);
      // }
      // else {
      //   console.log("Less than 200");
      // }
    });
  }
  // return eventStatus;
}
function fetchDealRevenueDetailsOMGTotal(categoryValue, serviceValue) {

  var eventStatus = "";
  var creatorSdk = ZOHO.CREATOR.init();
  creatorSdk.then(function (data) {
    getOppRevenueDetails("1");
  });
  function getOppRevenueDetails(pageNum) {
    var config = {
      appName: "pal-plus",
      reportName: "Opportunities_Ventes_Report",
      criteria: "(Income_Category == \"" + categoryValue + "\" && Service == \"" + serviceValue + "\" )",
      page: pageNum,
      pageSize: 200
    }
    console.log(config);
    try{
      console.log("inside try");
      var getRecords = ZOHO.CREATOR.API.getAllRecords(config);
      console.log(getRecords);
      getRecords.then(function (response) {
        console.log("respFor Total::"+ categoryValue  + JSON.stringify(response));
        if (response.code == 3000) {
          // var dataList = JSON.stringify(response.data);
          // var recordsLength = Object.keys(response.data).length;
          createEventJsonDataOMGTotal(response.data);
         } else {
           console.log("no matching records found");
         }
        // if (recordsLength == 200) {
        //   getOppRevenueDetails(parseInt(pageNum) + 1);
        // }
        // else {
        //   console.log("Less than 200");
        // }
      });
    }catch(err){
      consle.log("No Records found!!!!");
    } 
  }
  // return eventStatus;
}
function createEventJsonDataOMGTotal(dataList, length) {
  OMGRevenueData.length = 0;
  var OMGItem = {};
  var index = index + 1;
  var colorCodingClass = "bg-green";
  var totalParticipants = 0;
  $.each(dataList, function (key, value) {
    console.log(value.Number_of_participants);
    index = index + 1;
    if (value.Event_Date != null) {
      if (value.Event_Date == OMGItem.time) {
        totalParticipants = totalParticipants + parseInt(value.Number_of_participants);
      } else {
        OMGItem["ID"] = index;
        OMGItem["time"] = value.Event_Date;
        OMGItem["cls"] = colorCodingClass;
        OMGItem["status"] = "Total";
        totalParticipants = totalParticipants + parseInt(value.Number_of_participants);
        OMGItem["totalCount"] = totalParticipants;

        OMGRevenueData.push(OMGItem);
      }
    }
  });
  console.log("OMGREvene total:" + OMGItem);
  var cal = Calendar('calendar');
  cal.bindData(OMGRevenueData);
  cal.render();
}
/**
 * This function is to get the income category details from Opportunities Sales module
 * 
 */
function getIncomeCategoryDetails() {
  ZOHO.CREATOR.init().then(function (data) {
    var config = {
      appName: "pal-plus",
      reportName: "IncomeCategory_Report"
    };
    // console.log(config);
    ZOHO.CREATOR.API.getAllRecords(config).then(function (response) {
      // console.log("resp" + JSON.stringify(response));
      if (response.code == 3000) {
        $.each(response.data, function (index, dataList) {
          $('#incomeCategory').append('<option value="' + dataList.Category_Id + '">' + dataList.Category_Name + '</option>');
        });
      } else {
        console.log("Error Calling Creator API:" + response.code);
      }


    });
  });
}

function createEventJsonDataForTotal(dataList) {
  // hotelRevenueData.length = 0;
  // e4sRevenueData.length = 0;
  var colorCodingClass = "bg-green";
  var index = 0;

  var day1TotalCountItem = {};
  var day2TotalCountItem = {};
  var day3TotalCountItem = {};
  var day4TotalCountItem = {};
  var day5TotalCountItem = {};
  var day6TotalCountItem = {};
  var day7TotalCountItem = {};
  var day8TotalCountItem = {};
  var day9TotalCountItem = {};
  var day10TotalCountItem = {};
  var day1TotalCount = 0;
  var day2TotalCount = 0;
  var day3TotalCount = 0;
  var day4TotalCount = 0;
  var day5TotalCount = 0;
  var day6TotalCount = 0;
  var day7TotalCount = 0;
  var day8TotalCount = 0;
  var day9TotalCount = 0;
  var day10TotalCount = 0;
  $.each(dataList, function (key, value) {

    if (value.Day_1_Date != "") {
      index = index + 1;
      if (day1TotalCountItem.time == value.Day_1_Date) {
        day1TotalCount = day1TotalCount + parseInt(value.Number_of_bedrooms_J1);
        console.log("TotalCount :" + day1TotalCount);
        day1TotalCountItem["count"] = day1TotalCount;

      } else {
        day1TotalCount = day1TotalCount + parseInt(value.Number_of_bedrooms_J1);
        day1TotalCountItem["ID"] = index;
        day1TotalCountItem["time"] = value.Day_1_Date;
        day1TotalCountItem["cls"] = colorCodingClass;
        day1TotalCountItem["status"] = "Available";
        day1TotalCountItem["count"] = day1TotalCount;
      }
      console.log(day1TotalCountItem.count);
      day1TotalCountItem["totalCount"] = 54 - parseInt(day1TotalCountItem.count);
      console.log("day1TotalCountItem:" + JSON.stringify(day1TotalCountItem));
    }
    if (value.Day_2_Date != "") {
      // index = index + 1;
      if (day2TotalCountItem.time == value.Day_2_Date) {
        day2TotalCount = day2TotalCount + parseInt(value.Number_of_bedrooms_J2);
      } else {
        day2TotalCount = day2TotalCount + parseInt(value.Number_of_bedrooms_J2);
      }
      day2TotalCountItem["ID"] = index;
      day2TotalCountItem["time"] = value.Day_2_Date;
      day2TotalCountItem["cls"] = colorCodingClass;
      day2TotalCountItem["status"] = "Available";
      day2TotalCountItem["totalCount"] = 54 - day2TotalCount;
    }
    if (value.Day_3_Date != "") {
      // index = index + 1;
      if (day3TotalCountItem.time == value.Day_3_Date) {
        day3TotalCount = day3TotalCount + parseInt(value.Number_of_bedrooms_J3);
      } else {
        day3TotalCount = day3TotalCount + parseInt(value.Number_of_bedrooms_J3);
      }
      day3TotalCountItem["ID"] = index;
      day3TotalCountItem["time"] = value.Day_3_Date;
      day3TotalCountItem["cls"] = colorCodingClass;
      day3TotalCountItem["status"] = "Available";
      day3TotalCountItem["totalCount"] = 54 - day3TotalCount;
    }
    console.log(value.Day_4_Date);
    if (value.Day_4_Date != null) {
      // index = index + 1;
      console.log("value day4:" + value.Day_4_Date);
      if (day4TotalCountItem.time == value.Day_4_Date) {
        day4TotalCount = day4TotalCount + parseInt(value.Number_of_bedrooms_J4);
      } else {
        day4TotalCount = day4TotalCount + parseInt(value.Number_of_bedrooms_J4);
      }
      day4TotalCountItem["ID"] = index;
      day4TotalCountItem["time"] = value.Day_4_Date;
      day4TotalCountItem["cls"] = colorCodingClass;
      day4TotalCountItem["status"] = "Available";
      day4TotalCountItem["totalCount"] = 54 - day4TotalCount;
    }
    if (value.Day_5_Date != "") {
      // index = index + 1;
      if (day5TotalCountItem.time == value.Day_5_Date) {
        day5TotalCount = day5TotalCount + parseInt(value.Number_of_bedrooms_J5);
      } else {
        day5TotalCount = day5TotalCount + parseInt(value.Number_of_bedrooms_J5);
      }
      day5TotalCountItem["ID"] = index;
      day5TotalCountItem["time"] = value.Day_5_Date;
      day5TotalCountItem["cls"] = colorCodingClass;
      day5TotalCountItem["status"] = "Available";
      day5TotalCountItem["totalCount"] = 54 - day5TotalCount;
    }
    if (value.Day_6_Date != "") {
      // index = index + 1;
      if (day6TotalCountItem.time == value.Day_6_Date) {
        day6TotalCount = day6TotalCount + parseInt(value.Number_of_bedrooms_J6);
      } else {
        day6TotalCount = day6TotalCount + parseInt(value.Number_of_bedrooms_J6);
      }
      day6TotalCountItem["ID"] = index;
      day6TotalCountItem["time"] = value.Day_6_Date;
      day6TotalCountItem["cls"] = colorCodingClass;
      day6TotalCountItem["status"] = "Available";
      day6TotalCountItem["totalCount"] = 54 - day6TotalCount;
    }
    if (value.Day_7_Date != "") {
      // index = index + 1;
      if (day7TotalCountItem.time == value.Day_7_Date) {
        day7TotalCount = day7TotalCount + parseInt(value.Number_of_bedrooms_J7);
      } else {
        day7TotalCount = day7TotalCount + parseInt(value.Number_of_bedrooms_J7);
      }
      day7TotalCountItem["ID"] = index;
      day7TotalCountItem["time"] = value.Day_7_Date;
      day7TotalCountItem["cls"] = colorCodingClass;
      day7TotalCountItem["status"] = "Available";
      day7TotalCountItem["totalCount"] = 54 - day7TotalCount;
    }
    if (value.Day_8_Date != "") {
      // index = index + 1;
      if (day8TotalCountItem.time == value.Day_8_Date) {
        day8TotalCount = day8TotalCount + parseInt(value.Number_of_bedrooms_J8);
      } else {
        day8TotalCount = day8TotalCount + parseInt(value.Number_of_bedrooms_J8);
      }
      day8TotalCountItem["ID"] = index;
      day8TotalCountItem["time"] = value.Day_8_Date;
      day8TotalCountItem["cls"] = colorCodingClass;
      day8TotalCountItem["status"] = "Available";
      day8TotalCountItem["totalCount"] = 54 - day8TotalCount;
    }
    if (value.Day_9_Date != "") {
      // index = index + 1;
      if (day9TotalCountItem.time == value.Day_9_Date) {
        day9TotalCount = day9TotalCount + parseInt(value.Number_of_bedrooms_J9);
      } else {
        day9TotalCount = day9TotalCount + parseInt(value.Number_of_bedrooms_J9);
      }
      day9TotalCountItem["ID"] = index;
      day9TotalCountItem["time"] = value.Day_9_Date;
      day9TotalCountItem["cls"] = colorCodingClass;
      day9TotalCountItem["status"] = "Available";
      day9TotalCountItem["totalCount"] = 54 - day9TotalCount;
    }
    if (value.Day_10_Date != "") {
      // index = index + 1;
      if (day10TotalCountItem.time == value.Day_10_Date) {
        day10TotalCount = day10TotalCount + parseInt(value.Number_of_bedrooms_J10);
      } else {
        day10TotalCount = day10TotalCount + parseInt(value.Number_of_bedrooms_J10);
      }
      day10TotalCountItem["ID"] = index;
      day10TotalCountItem["time"] = value.Day_10_Date;
      day10TotalCountItem["cls"] = colorCodingClass;
      day10TotalCountItem["status"] = "Available";
      day10TotalCountItem["totalCount"] = 54 - day10TotalCount;
    }
  });
  // var divExists = $(".event");
  // console.log(divExists.length);
  // if (divExists.length == 0) {
  hotelRevenueData.push(day1TotalCountItem);
  hotelRevenueData.push(day2TotalCountItem);
  hotelRevenueData.push(day3TotalCountItem);
  hotelRevenueData.push(day4TotalCountItem);
  hotelRevenueData.push(day5TotalCountItem);
  hotelRevenueData.push(day6TotalCountItem);
  hotelRevenueData.push(day7TotalCountItem);
  hotelRevenueData.push(day8TotalCountItem);
  hotelRevenueData.push(day9TotalCountItem);
  hotelRevenueData.push(day10TotalCountItem);
  //}
  console.log("hotelRevenueData in total" + JSON.stringify(hotelRevenueData));
  var cal = Calendar('calendar');
  cal.bindData(hotelRevenueData);
  cal.render();
}
function createEventJsonDataForTotalE4S(dataList) {
  hotelRevenueData.length = 0;
  e4sRevenueData.length = 0;
  var colorCodingClass = "bg-green";
  var index = 0;

  var day1TotalCountItem = {};
  var day2TotalCountItem = {};
  var day3TotalCountItem = {};
  var day4TotalCountItem = {};
  var day5TotalCountItem = {};
  var day6TotalCountItem = {};
  var day7TotalCountItem = {};
  var day8TotalCountItem = {};
  var day9TotalCountItem = {};
  var day10TotalCountItem = {};
  var day1TotalCount = 0;
  var day2TotalCount = 0;
  var day3TotalCount = 0;
  var day4TotalCount = 0;
  var day5TotalCount = 0;
  var day6TotalCount = 0;
  var day7TotalCount = 0;
  var day8TotalCount = 0;
  var day9TotalCount = 0;
  var day10TotalCount = 0;
  $.each(dataList, function (key, value) {

    if (value.Day_1_Date != "") {
      index = index + 1;
      if (day1TotalCountItem.time == value.Day_1_Date) {
        day1TotalCount = day1TotalCount + parseInt(value.Number_of_bedrooms_J1);
        console.log("TotalCount :" + day1TotalCount);
      } else {
        day1TotalCount = day1TotalCount + parseInt(value.Number_of_bedrooms_J1);
      }
      day1TotalCountItem["ID"] = index;
      day1TotalCountItem["time"] = value.Day_1_Date;
      day1TotalCountItem["cls"] = colorCodingClass;
      day1TotalCountItem["status"] = "Total Available";
      day1TotalCountItem["totalCount"] = 82 - day1TotalCount;
      // console.log(value.Day_1_Date);
    }
    if (value.Day_2_Date != "") {
      // index = index + 1;
      if (day2TotalCountItem.time == value.Day_2_Date) {
        day2TotalCount = day2TotalCount + parseInt(value.Number_of_bedrooms_J2);
      } else {
        day2TotalCount = day2TotalCount + parseInt(value.Number_of_bedrooms_J2);
      }
      day2TotalCountItem["ID"] = index;
      day2TotalCountItem["time"] = value.Day_2_Date;
      day2TotalCountItem["cls"] = colorCodingClass;
      day2TotalCountItem["status"] = "Total Available";
      day2TotalCountItem["totalCount"] = 82 - day2TotalCount;
    }
    if (value.Day_3_Date != "") {
      // index = index + 1;
      if (day3TotalCountItem.time == value.Day_3_Date) {
        day3TotalCount = day3TotalCount + parseInt(value.Number_of_bedrooms_J3);
      } else {
        day3TotalCount = day3TotalCount + parseInt(value.Number_of_bedrooms_J3);
      }
      day3TotalCountItem["ID"] = index;
      day3TotalCountItem["time"] = value.Day_3_Date;
      day3TotalCountItem["cls"] = colorCodingClass;
      day3TotalCountItem["status"] = "Total Available";
      day3TotalCountItem["totalCount"] = 54 - day3TotalCount;
    }

    if (value.Day_4_Date != "") {
      // index = index + 1;
      // console.log("value day4:"+value.Day_4_Date);
      if (day4TotalCountItem.time == value.Day_4_Date) {
        day4TotalCount = day4TotalCount + parseInt(value.Number_of_bedrooms_J4);
      } else {
        day4TotalCount = day4TotalCount + parseInt(value.Number_of_bedrooms_J4);
      }
      day4TotalCountItem["ID"] = index;
      day4TotalCountItem["time"] = value.Day_4_Date;
      day4TotalCountItem["cls"] = colorCodingClass;
      day4TotalCountItem["status"] = "Total Available";
      day4TotalCountItem["totalCount"] = 82 - day4TotalCount;
    }
    if (value.Day_5_Date != "") {
      // index = index + 1;
      if (day5TotalCountItem.time == value.Day_5_Date) {
        day5TotalCount = day5TotalCount + parseInt(value.Number_of_bedrooms_J5);
      } else {
        day5TotalCount = day5TotalCount + parseInt(value.Number_of_bedrooms_J5);
      }
      day5TotalCountItem["ID"] = index;
      day5TotalCountItem["time"] = value.Day_5_Date;
      day5TotalCountItem["cls"] = colorCodingClass;
      day5TotalCountItem["status"] = "Total Available";
      day5TotalCountItem["totalCount"] = 82 - day5TotalCount;
    }
    if (value.Day_6_Date != "") {
      // index = index + 1;
      if (day6TotalCountItem.time == value.Day_6_Date) {
        day6TotalCount = day6TotalCount + parseInt(value.Number_of_bedrooms_J6);
      } else {
        day6TotalCount = day6TotalCount + parseInt(value.Number_of_bedrooms_J6);
      }
      day6TotalCountItem["ID"] = index;
      day6TotalCountItem["time"] = value.Day_6_Date;
      day6TotalCountItem["cls"] = colorCodingClass;
      day6TotalCountItem["status"] = "Total Available";
      day6TotalCountItem["totalCount"] = 82 - day6TotalCount;
    }
    if (value.Day_7_Date != "") {
      // index = index + 1;
      if (day7TotalCountItem.time == value.Day_7_Date) {
        day7TotalCount = day7TotalCount + parseInt(value.Number_of_bedrooms_J7);
      } else {
        day7TotalCount = day7TotalCount + parseInt(value.Number_of_bedrooms_J7);
      }
      day7TotalCountItem["ID"] = index;
      day7TotalCountItem["time"] = value.Day_7_Date;
      day7TotalCountItem["cls"] = colorCodingClass;
      day7TotalCountItem["status"] = "Total Available";
      day7TotalCountItem["totalCount"] = 82 - day7TotalCount;
    }
    if (value.Day_8_Date != "") {
      // index = index + 1;
      if (day8TotalCountItem.time == value.Day_8_Date) {
        day8TotalCount = day8TotalCount + parseInt(value.Number_of_bedrooms_J8);
      } else {
        day8TotalCount = day8TotalCount + parseInt(value.Number_of_bedrooms_J8);
      }
      day8TotalCountItem["ID"] = index;
      day8TotalCountItem["time"] = value.Day_8_Date;
      day8TotalCountItem["cls"] = colorCodingClass;
      day8TotalCountItem["status"] = "Total Available";
      day8TotalCountItem["totalCount"] = 82 - day8TotalCount;
    }
    if (value.Day_9_Date != "") {
      // index = index + 1;
      if (day9TotalCountItem.time == value.Day_9_Date) {
        day9TotalCount = day9TotalCount + parseInt(value.Number_of_bedrooms_J9);
      } else {
        day9TotalCount = day9TotalCount + parseInt(value.Number_of_bedrooms_J9);
      }
      day9TotalCountItem["ID"] = index;
      day9TotalCountItem["time"] = value.Day_9_Date;
      day9TotalCountItem["cls"] = colorCodingClass;
      day9TotalCountItem["status"] = "Total Available";
      day9TotalCountItem["totalCount"] = 82 - day9TotalCount;
    }
    if (value.Day_10_Date != "") {
      // index = index + 1;
      if (day10TotalCountItem.time == value.Day_10_Date) {
        day10TotalCount = day10TotalCount + parseInt(value.Number_of_bedrooms_J10);
      } else {
        day10TotalCount = day10TotalCount + parseInt(value.Number_of_bedrooms_J10);
      }
      day10TotalCountItem["ID"] = index;
      day10TotalCountItem["time"] = value.Day_10_Date;
      day10TotalCountItem["cls"] = colorCodingClass;
      day10TotalCountItem["status"] = "Total Available";
      day10TotalCountItem["totalCount"] = 82 - day10TotalCount;
    }
  });
  // var divExists = $(".event");
  // console.log(divExists.length);
  // if (divExists.length == 0) {
  e4sRevenueData.push(day1TotalCountItem);
  e4sRevenueData.push(day2TotalCountItem);
  // hotelRevhotelRevenueDataenueData.push(day3TotalCountItem);
  e4sRevenueData.push(day4TotalCountItem);
  e4sRevenueData.push(day5TotalCountItem);
  e4sRevenueData.push(day6TotalCountItem);
  e4sRevenueData.push(day7TotalCountItem);
  e4sRevenueData.push(day8TotalCountItem);
  e4sRevenueData.push(day9TotalCountItem);
  e4sRevenueData.push(day10TotalCountItem);
  //}
  // console.log("hotelRevenueData in total"+JSON.stringify(day3TotalCountItem));
  var cal = Calendar('calendar');
  cal.bindData(e4sRevenueData);
  cal.render();
}
function convertDateFormat(dayDate) {
  var customDate = new Date(dayDate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
  return customDate;
}
function fetchDealRevenueDetailsWithStatusForE4s(categoryValue, status) {
  var creatorSdk = ZOHO.CREATOR.init();
  creatorSdk.then(function (data) {
    getOppRevenueDetailsStatus("1");
  });
  function getOppRevenueDetailsStatus(pageNum) {
    console.log("categoryValue:" + status);
    var config = {
      appName: "pal-plus",
      reportName: "Opportunities_Ventes_Report",
      criteria: "(Income_Category == \"" + categoryValue + "\" && Sales_Stage == \"" + status + "\")",
      page: pageNum,
      pageSize: 200
    }
    console.log(config);
    var getRecords = ZOHO.CREATOR.API.getAllRecords(config);
    getRecords.then(function (response) {
      console.log("resp" + JSON.stringify(response));
      if (response.code == 3000) {
        var dataList = JSON.stringify(response.data);
        var recordsLength = Object.keys(response.data).length;
        createEventJsonDataForE4s(response.data, recordsLength);
      } else {

        console.log("no matching records found");
      }

      // if (recordsLength == 200) {

      //   getOppRevenueDetailsStatus(parseInt(pageNum) + 1);
      // }
      // else {
      //   console.log("Less than 200");
      // }

    });
  }
}
function fetchDealRevenueDetailsWithStatus(categoryValue, status) {
  var creatorSdk = ZOHO.CREATOR.init();
  creatorSdk.then(function (data) {
    getOppRevenueDetails("1");
  });
  function getOppRevenueDetails(pageNum) {
    console.log("categoryValue:" + status);
    var config = {
      appName: "pal-plus",
      reportName: "Opportunities_Ventes_Report",
      criteria: "(Income_Category == \"" + categoryValue + "\" && Sales_Stage == \"" + status + "\")",
      page: pageNum,
      pageSize: 200
    }
    console.log(config);
    var getRecords = ZOHO.CREATOR.API.getAllRecords(config);
    getRecords.then(function (response) {
      console.log("resp" + JSON.stringify(response));
      if (response.code == 3000) {
        var dataList = JSON.stringify(response.data);
        var recordsLength = Object.keys(response.data).length;
        createEventJsonData(response.data, recordsLength);
      } else {
        console.log("no matching records found");
      }

      // if (recordsLength == 200) {

      //   getOppRevenueDetails(parseInt(pageNum) + 1);
      // }
      // else {
      //   console.log("Less than 200");
      // }

    });
  }
}
function createEventJsonData(dataList, length) {

  var index = 0;
  var day1Item = {};
  var day2Item = {};
  var day3Item = {};
  var day4Item = {};
  var day5Item = {};
  var day6Item = {};
  var day7Item = {};
  var day8Item = {};
  var day9Item = {};
  var day10Item = {};
  var day1TotalCount = 0;
  var day2TotalCount = 0;
  var day3TotalCount = 0;
  var day4TotalCount = 0;
  var day5TotalCount = 0;
  var day6TotalCount = 0;
  var day7TotalCount = 0;
  var day8TotalCount = 0;
  var day9TotalCount = 0;
  var day10TotalCount = 0;
  $.each(dataList, function (key, value) {


    if (value.Sales_Stage.toUpperCase() === "Confirmé".toUpperCase()) {
      var colorCodingClass = "bg-confirm";
    } else if (value.Sales_Stage.toUpperCase() === "Proposition".toUpperCase()) {
      colorCodingClass = "bg-proposition";
    } else if (value.Sales_Stage.toUpperCase() === "Prospect".toUpperCase()) {
      colorCodingClass = "bg-tentatiff";
    } else if (value.Sales_Stage.toUpperCase() === "Perdu".toUpperCase()) {
      colorCodingClass = "bg-perdu";
    } else if (value.Sales_Stage.toUpperCase() === "Pas de disponibilté".toUpperCase()) {
      colorCodingClass = "bg-pasde";
    } else {
      colorCodingClass = "bg-annule";
    }
    if (value.Day_1_Date != "") {
      index = index + 1;
      if (day1Item.time == value.Day_1_Date) {
        day1TotalCount = day1TotalCount + parseInt(value.Number_of_bedrooms_J1);
      } else {
        day1TotalCount = day1TotalCount + parseInt(value.Number_of_bedrooms_J1);
      }
      console.log("TotalCount :" + day1TotalCount);
      day1Item["ID"] = index;
      day1Item["time"] = value.Day_1_Date;
      day1Item["cls"] = colorCodingClass;
      day1Item["status"] = value.Sales_Stage;
      day1Item["totalCount"] = day1TotalCount;
      // console.log(value.Day_1_Date);
    }
    if (value.Day_2_Date != "") {
      // index = index + 1;
      if (day2Item.time == value.Day_2_Date) {
        day2TotalCount = day2TotalCount + parseInt(value.Number_of_bedrooms_J2);
      } else {
        day2TotalCount = day2TotalCount + parseInt(value.Number_of_bedrooms_J2);
      }
      day2Item["ID"] = index;
      day2Item["time"] = value.Day_2_Date;
      day2Item["cls"] = colorCodingClass;
      day2Item["status"] = value.Sales_Stage;
      day2Item["totalCount"] = day2TotalCount;
    }
    if (value.Day_3_Date != "") {
      // index = index + 1;
      if (day3Item.time == value.Day_3_Date) {
        day3TotalCount = day3TotalCount + parseInt(value.Number_of_bedrooms_J3);
      } else {
        day3TotalCount = day3TotalCount + parseInt(value.Number_of_bedrooms_J3);
      }
      day3Item["ID"] = index;
      day3Item["time"] = value.Day_3_Date;
      day3Item["cls"] = colorCodingClass;
      day3Item["status"] = value.Sales_Stage;
      day3Item["totalCount"] = day3TotalCount;
    }
    if (value.Day_4_Date != "") {
      // index = index +1;
      if (day4Item.time == value.Day_4_Date) {
        day4TotalCount = day4TotalCount + parseInt(value.Number_of_bedrooms_J4);
      } else {
        day4TotalCount = day4TotalCount + parseInt(value.Number_of_bedrooms_J4);
      }
      day4Item["ID"] = index;
      day4Item["time"] = value.Day_4_Date;
      day4Item["cls"] = colorCodingClass;
      day4Item["status"] = value.Sales_Stage;
      day4Item["totalCount"] = day4TotalCount;
    }
    if (value.Day_5_Date != "") {
      // index = index +1;
      if (day5Item.time == value.Day_5_Date) {
        day5TotalCount = day5TotalCount + parseInt(value.Number_of_bedrooms_J5);
      } else {
        day5TotalCount = day5TotalCount + parseInt(value.Number_of_bedrooms_J5);
      }
      day5Item["ID"] = index;
      day5Item["time"] = value.Day_5_Date;
      day5Item["cls"] = colorCodingClass;
      day5Item["status"] = value.Sales_Stage;
      day5Item["totalCount"] = day5TotalCount;
    }
    if (value.Day_6_Date != "") {
      // index = index +1;
      if (day6Item.time == value.Day_6_Date) {
        day6TotalCount = day6TotalCount + parseInt(value.Number_of_bedrooms_J6);
      } else {
        day6TotalCount = day6TotalCount + parseInt(value.Number_of_bedrooms_J6);
      }
      day6Item["ID"] = index;
      day6Item["time"] = value.Day_6_Date;
      day6Item["cls"] = colorCodingClass;
      day6Item["status"] = value.Sales_Stage;
      day6Item["totalCount"] = day6TotalCount;
    }
    if (value.Day_7_Date != "") {
      //  index = index +1;
      if (day7Item.time == value.Day_7_Date) {
        day7TotalCount = day7TotalCount + parseInt(value.Number_of_bedrooms_J7);
      } else {
        day7TotalCount = day7TotalCount + parseInt(value.Number_of_bedrooms_J7);
      }
      day7Item["ID"] = index;
      day7Item["time"] = value.Day_7_Date;
      day7Item["cls"] = colorCodingClass;
      day7Item["status"] = value.Sales_Stage;
      day7Item["totalCount"] = day7TotalCount;
    }
    if (value.Day_8_Date != "") {
      //  index = index +1;
      if (day8Item.time == value.Day_8_Date) {
        day8TotalCount = day8TotalCount + parseInt(value.Number_of_bedrooms_J8);
      } else {
        day8TotalCount = day8TotalCount + parseInt(value.Number_of_bedrooms_J8);
      }
      day8Item["ID"] = index;
      day8Item["time"] = value.Day_8_Date;
      day8Item["cls"] = colorCodingClass;
      day8Item["status"] = value.Sales_Stage;
      day8Item["totalCount"] = day8TotalCount;
    }
    if (value.Day_9_Date != "") {
      //  index = index +1;
      if (day9Item.time == value.Day_9_Date) {
        day9TotalCount = day9TotalCount + parseInt(value.Number_of_bedrooms_J9);
      } else {
        day9TotalCount = day9TotalCount + parseInt(value.Number_of_bedrooms_J9);
      }
      day9Item["ID"] = index;
      day9Item["time"] = value.Day_9_Date;
      day9Item["cls"] = colorCodingClass;
      day9Item["status"] = value.Sales_Stage;
      day9Item["totalCount"] = day9TotalCount;
    }
    if (value.Day_10_Date != "") {
      // index = index +1;
      if (day10Item.time == value.Day_10_Date) {
        day10TotalCount = day10TotalCount + parseInt(value.Number_of_bedrooms_J10);
      } else {
        day10TotalCount = day10TotalCount + parseInt(value.Number_of_bedrooms_J10);
      }
      day10Item["ID"] = index;
      day10Item["time"] = value.Day_10_Date;
      day10Item["cls"] = colorCodingClass;
      day10Item["status"] = value.Sales_Stage;
      day10Item["totalCount"] = day10TotalCount;
    }
  });
  // var divExists = $(".event");
  // console.log(divExists.length);
  // if (divExists.length == 0) {
  //console.log(hotelRevenueData);
  hotelRevenueData.push(day1Item);
  hotelRevenueData.push(day2Item);
  hotelRevenueData.push(day3Item);
  hotelRevenueData.push(day4Item);
  hotelRevenueData.push(day5Item);
  hotelRevenueData.push(day6Item);
  hotelRevenueData.push(day7Item);
  hotelRevenueData.push(day8Item);
  hotelRevenueData.push(day9Item);
  hotelRevenueData.push(day10Item);
  //}
  //console.log("hotelRevenueData in status"+JSON.stringify(day3TotalCountItem));
  var cal = Calendar('calendar');
  cal.bindData(hotelRevenueData);
  cal.render();
}
function createEventJsonDataForE4s(dataList, length) {
  //var hotelRevenueDataWithStatus = [];
  var index = 0;
  var day1Item = {};
  var day2Item = {};
  var day3Item = {};
  var day4Item = {};
  var day5Item = {};
  var day6Item = {};
  var day7Item = {};
  var day8Item = {};
  var day9Item = {};
  var day10Item = {};
  var day1TotalCount = 0;
  var day2TotalCount = 0;
  var day3TotalCount = 0;
  var day4TotalCount = 0;
  var day5TotalCount = 0;
  var day6TotalCount = 0;
  var day7TotalCount = 0;
  var day8TotalCount = 0;
  var day9TotalCount = 0;
  var day10TotalCount = 0;
  $.each(dataList, function (key, value) {


    if (value.Sales_Stage.toUpperCase() === "Confirmé".toUpperCase()) {
      var colorCodingClass = "bg-confirm";
    } else if (value.Sales_Stage.toUpperCase() === "Proposition".toUpperCase()) {
      colorCodingClass = "bg-proposition";
    } else if (value.Sales_Stage.toUpperCase() === "Prospect".toUpperCase()) {
      colorCodingClass = "bg-tentatiff";
    } else if (value.Sales_Stage.toUpperCase() === "Perdu".toUpperCase()) {
      colorCodingClass = "bg-perdu";
    } else if (value.Sales_Stage.toUpperCase() === "Pas de disponibilté".toUpperCase()) {
      colorCodingClass = "bg-pasde";
    } else {
      colorCodingClass = "bg-annule";
    }
    if (value.Day_1_Date != "") {
      index = index + 1;
      if (day1Item.time == value.Day_1_Date) {
        day1TotalCount = day1TotalCount + parseInt(value.Number_of_bedrooms_J1);
        console.log("TotalCount :" + day1TotalCount);
      } else {
        day1TotalCount = day1TotalCount + parseInt(value.Number_of_bedrooms_J1);
      }
      day1Item["ID"] = index;
      day1Item["time"] = value.Day_1_Date;
      day1Item["cls"] = colorCodingClass;
      day1Item["status"] = "value.Sales_Stage";
      day1Item["totalCount"] = day1TotalCount;
      // console.log(value.Day_1_Date);
    }
    if (value.Day_2_Date != "") {
      // index = index + 1;
      if (day2Item.time == value.Day_2_Date) {
        day2TotalCount = day2TotalCount + parseInt(value.Number_of_bedrooms_J2);
      } else {
        day2TotalCount = day2TotalCount + parseInt(value.Number_of_bedrooms_J2);
      }
      day2Item["ID"] = index;
      day2Item["time"] = value.Day_2_Date;
      day2Item["cls"] = colorCodingClass;
      day2Item["status"] = value.Sales_Stage;
      day2Item["totalCount"] = day2TotalCount;
    }
    if (value.Day_3_Date != "") {
      // index = index + 1;
      if (day3Item.time == value.Day_3_Date) {
        day3TotalCount = day3TotalCount + parseInt(value.Number_of_bedrooms_J3);
      } else {
        day3TotalCount = day3TotalCount + parseInt(value.Number_of_bedrooms_J3);
      }
      day3Item["ID"] = index;
      day3Item["time"] = value.Day_3_Date;
      day3Item["cls"] = colorCodingClass;
      day3Item["status"] = value.Sales_Stage;
      day3Item["totalCount"] = day3TotalCount;
    }
    if (value.Day_4_Date != "") {
      // index = index +1;
      if (day4Item.time == value.Day_4_Date) {
        day4TotalCount = day4TotalCount + parseInt(value.Number_of_bedrooms_J4);
      } else {
        day4TotalCount = day4TotalCount + parseInt(value.Number_of_bedrooms_J4);
      }
      day4Item["ID"] = index;
      day4Item["time"] = value.Day_4_Date;
      day4Item["cls"] = colorCodingClass;
      day4Item["status"] = value.Sales_Stage;
      day4Item["totalCount"] = day4TotalCount;
    }
    if (value.Day_5_Date != "") {
      // index = index +1;
      if (day5Item.time == value.Day_5_Date) {
        day5TotalCount = day5TotalCount + parseInt(value.Number_of_bedrooms_J5);
      } else {
        day5TotalCount = day5TotalCount + parseInt(value.Number_of_bedrooms_J5);
      }
      day5Item["ID"] = index;
      day5Item["time"] = value.Day_5_Date;
      day5Item["cls"] = colorCodingClass;
      day5Item["status"] = value.Sales_Stage;
      day5Item["totalCount"] = day5TotalCount;
    }
    if (value.Day_6_Date != "") {
      // index = index +1;
      if (day6Item.time == value.Day_6_Date) {
        day6TotalCount = day6TotalCount + parseInt(value.Number_of_bedrooms_J6);
      } else {
        day6TotalCount = day6TotalCount + parseInt(value.Number_of_bedrooms_J6);
      }
      day6Item["ID"] = index;
      day6Item["time"] = value.Day_6_Date;
      day6Item["cls"] = colorCodingClass;
      day6Item["status"] = value.Sales_Stage;
      day6Item["totalCount"] = day6TotalCount;
    }
    if (value.Day_7_Date != "") {
      //  index = index +1;
      if (day7Item.time == value.Day_7_Date) {
        day7TotalCount = day7TotalCount + parseInt(value.Number_of_bedrooms_J7);
      } else {
        day7TotalCount = day7TotalCount + parseInt(value.Number_of_bedrooms_J7);
      }
      day7Item["ID"] = index;
      day7Item["time"] = value.Day_7_Date;
      day7Item["cls"] = colorCodingClass;
      day7Item["status"] = value.Sales_Stage;
      day7Item["totalCount"] = day7TotalCount;
    }
    if (value.Day_8_Date != "") {
      //  index = index +1;
      if (day8Item.time == value.Day_8_Date) {
        day8TotalCount = day8TotalCount + parseInt(value.Number_of_bedrooms_J8);
      } else {
        day8TotalCount = day8TotalCount + parseInt(value.Number_of_bedrooms_J8);
      }
      day8Item["ID"] = index;
      day8Item["time"] = value.Day_8_Date;
      day8Item["cls"] = colorCodingClass;
      day8Item["status"] = value.Sales_Stage;
      day8Item["totalCount"] = day8TotalCount;
    }
    if (value.Day_9_Date != "") {
      //  index = index +1;
      if (day9Item.time == value.Day_9_Date) {
        day9TotalCount = day9TotalCount + parseInt(value.Number_of_bedrooms_J9);
      } else {
        day9TotalCount = day9TotalCount + parseInt(value.Number_of_bedrooms_J9);
      }
      day9Item["ID"] = index;
      day9Item["time"] = value.Day_9_Date;
      day9Item["cls"] = colorCodingClass;
      day9Item["status"] = value.Sales_Stage;
      day9Item["totalCount"] = day9TotalCount;
    }
    if (value.Day_10_Date != "") {
      // index = index +1;
      if (day10Item.time == value.Day_10_Date) {
        day10TotalCount = day10TotalCount + parseInt(value.Number_of_bedrooms_J10);
      } else {
        day10TotalCount = day10TotalCount + parseInt(value.Number_of_bedrooms_J10);
      }
      day10Item["ID"] = index;
      day10Item["time"] = value.Day_10_Date;
      day10Item["cls"] = colorCodingClass;
      day10Item["status"] = value.Sales_Stage;
      day10Item["totalCount"] = day10TotalCount;
    }
  });
  // var divExists = $(".event");
  // console.log(divExists.length);
  // if (divExists.length == 0) {
  //console.log(hotelRevenueData);
  e4sRevenueData.push(day1Item);
  e4sRevenueData.push(day2Item);
  e4sRevenueData.push(day3Item);
  e4sRevenueData.push(day4Item);
  e4sRevenueData.push(day5Item);
  e4sRevenueData.push(day6Item);
  e4sRevenueData.push(day7Item);
  e4sRevenueData.push(day8Item);
  e4sRevenueData.push(day9Item);
  e4sRevenueData.push(day10Item);
  //}
  //console.log("hotelRevenueData in status"+JSON.stringify(day3TotalCountItem));
  var cal = Calendar('calendar');
  cal.bindData(e4sRevenueData);
  cal.render();
}