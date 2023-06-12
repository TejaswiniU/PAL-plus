import { hotelRevenueData } from "./mockData.js";
import { e4sRevenueData } from "./mockData.js";
import { escapadeRevenueData } from "./mockData.js";
import { OMGRevenueData } from "./mockData.js";
import { escapadeRevenueTableData } from "./mockData.js";
import { OMGRevenueTableData } from "./mockData.js";
import { Calendar } from './calendar.js';
import { emptyData } from './mockData.js';

$(document).ready(function () {

    var serviceList = ["Cocktail", "Lunch", "Souper", "Privatisation", "Réunion"];
    var bookingServiceList = ["Apéreau", "Lever l'Ancre", "Prendre le large", "Autre"];
    getIncomeCategoryDetails();
    $('#incomeCategory').change(function () {
         $('#service').empty();
        $("#dealTable").innerHTML = "";
        $("#dealTable > tr").remove();
        $('#dealTable').css("display", "none");
        var categoryValue = $(this).find(':selected').text();
        var categoryValueID = $(this).find(':selected').val();
        if (categoryValue == "Hôtel Espaces4Saisons" || categoryValue == "Hôtel - Verso") {
            escapadeRevenueData.length = 0;
            OMGRevenueData.length = 0;
            hotelRevenueData.length = 0;
            e4sRevenueData.length = 0;
            $('#service').empty();
            $('#serviceDiv').css("display", "none");
            populateAvailableStatusForHotel(categoryValue);
        } else if (categoryValue == "Bâteau - Escapade Memphrémagog") {
            $('#service').empty();
            escapadeRevenueData.length = 0;
            OMGRevenueData.length = 0;
            hotelRevenueData.length = 0;
            e4sRevenueData.length = 0;
            $('#service').append('<option value=""> Select Service </option>');
            $.each(bookingServiceList, function (index, value) {
                $('#service').append('<option value="' + value + '">' + value + '</option>');
                $('#serviceDiv').css("display", "block");
            });
            $('#service').change(function () {
                escapadeRevenueData.length = 0;
                OMGRevenueData.length = 0;
                hotelRevenueData.length = 0;
                e4sRevenueData.length = 0;
                $("#dealTable").innerHTML = "";
                $("#dealTable > tr").remove();
                $('#dealTable').css("display", "none");
                var serviceValue = $(this).find(':selected').text();
                populateAvailableStatusForEscapade(categoryValue, serviceValue, "Confirmé"); // calendarViewReport
            });
        } else {
            escapadeRevenueData.length = 0;
            OMGRevenueData.length = 0;
            hotelRevenueData.length = 0;
            e4sRevenueData.length = 0;
            $('#service').empty();
            $('#service').append('<option value=""> Select Service </option>');
            $.each(serviceList, function (key, value) {
                $('#service').append('<option value="' + value + '">' + value + '</option>');
                $('#serviceDiv').css("display", "block");
            });
            $('#service').change(function () {
                $("#dealTable").innerHTML = "";
                $("#dealTable > tr").remove();
                $('#dealTable').css("display", "none");
                var serviceValue = $(this).find(':selected').text();
                fetchDealRevenueDetailsOMGTotal(categoryValue, serviceValue, "Confirmé");
            });
        }
    });
    // $("#dealTable").delegate("tr .confirm", "click", function(){
    //     alert("Click!");
    //     //getOpportunityIDForCRM();
    // });
});
/**
 * This function is to populate the income category on load of calendar 
 */
function getIncomeCategoryDetails() {
    ZOHO.CREATOR.init().then(function (data) {
        var config = {
            appName: "pal-plus",
            reportName: "IncomeCategory_Report"
        };
        ZOHO.CREATOR.API.getAllRecords(config).then(function (response) {
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
/**
 * This function is to populate available count in the calendar for Hotel verso & E4S
 * @param {} categoryValue 
 */
function populateAvailableStatusForHotel(categoryValue){
    var status="Confirmé";
    var propStatus = "Proposition";
    var confirmCount = 0;
    var propositionCount = 0;
    var otherCount = 0;
    hotelRevenueData.length = 0;
    var eventStatus = "";
    var creatorSdk = ZOHO.CREATOR.init();
    var otherStatus = true;
    creatorSdk.then(function (data) {
        getOppRevenueDetails("1");
    });

    function getOppRevenueDetails(pageNum) {

        var config = {
            appName: "pal-plus",
            reportName: "Opportunities_Ventes_Report",
            criteria: "(Income_Category == \"" + categoryValue + "\")",
            page: pageNum,
            pageSize: 200
        }

        //  console.log(config);
        var getRecords = ZOHO.CREATOR.API.getAllRecords(config);
        getRecords.then(function (response) {
           console.log("respFor Total from resultForm::" + categoryValue + JSON.stringify(response));
            if (response.code == 3000) {
                $.each(response.data, function (key, value) {
                    console.log("status:"+value.Sales_Stage);
                    if(value.Sales_Stage == status){
                        confirmCount = confirmCount+1;
                    }else if(value.Sales_Stage == propStatus){
                        propositionCount = propositionCount + 1;
                    }else{
                        otherCount = otherCount + 1;
                    }
                });
                console.log("confirmCount:"+ confirmCount);
                if(confirmCount>0){
                    otherStatus = false;
                    console.log("inside confirmcount")
                    fetchDealRevenueDetailsTotal(categoryValue,status);
                }if(propositionCount>0){
                    otherStatus = false;
                    fetchDealRevenueDetailsForProposition(categoryValue, propStatus);
                }if(otherStatus){
                    console.log("inside other log");
                    populateNonConfirmAvailableData(response.data,categoryValue);
                }
            } else {
                console.log("no matching records found");
            }
            // if (recordsLength == 200) {
            //   getOppRevenueDetails(parseInt(pageNum) + 1);
            // }
            // else {
            //   console.log("Less than 200");
            // }
            
        }).catch(err => {
            
            console.log("no data exists");
            console.log(err);
            var cal = Calendar('calendar');
            cal.bindData(emptyData);
            cal.render();

        });
    }
}
function populateNonConfirmAvailableData(dataList,categoryValue){
    console.log("inside non confirm data");
    var colorCodingClass = "bg-available";
    var eventData = [];
    var totalCount = 0;
    if(categoryValue == "Hôtel - Verso"){
        totalCount = 54;
    }else{
        totalCount = 82;
    }
    $.each(dataList,function(key,value){
        if(value.Sales_Stage != "Confirmé" && value.Sales_Stage != "Proposition"){
            if (value.Day_1_Date != "") {
                var day1Item = {};
                day1Item["ID"] = value.ID;
                day1Item["time"] = value.Day_1_Date;
                day1Item["status"] = "Available";
                day1Item["cls"] = colorCodingClass;
                day1Item["totalCount"] = 82;
                console.log(day1Item);
                eventData.push(day1Item);
            }
            if (value.Day_2_Date != "") {
                console.log("inside day2date");
                var day2Item = {};
                day2Item["ID"] = value.ID;
                day2Item["time"] = value.Day_2_Date;
                day2Item["cls"] = colorCodingClass;
                day2Item["status"] = "Available";
                day2Item["cls"] = colorCodingClass;
                day2Item["totalCount"] = 82;
                console.log(day2Item)
                eventData.push(day2Item);
            }
            if (value.Day_3_Date != "") {
                console.log("inside day3date");
                var day3Item = {};
                day3Item["ID"] = value.ID;
                day3Item["time"] = value.Day_3_Date;
                day3Item["cls"] = colorCodingClass;
                day3Item["status"] = "Available";
                day3Item["cls"] = colorCodingClass;
                day3Item["totalCount"] = 82;
                console.log(day3Item)
                eventData.push(day3Item);
            }
            if (value.Day_4_Date != "") {
                console.log("inside day4date");
                var day4Item = {};
                day4Item["ID"] = value.ID;
                day4Item["time"] = value.Day_4_Date;
                day4Item["cls"] = colorCodingClass;
                day4Item["status"] = "Available";
                day4Item["cls"] = colorCodingClass;
                day4Item["totalCount"] = 82;
                console.log(day4Item)
                eventData.push(day4Item);
            }
            if (value.Day_5_Date != "") {
                console.log("inside day5date");
                var day5Item = {};
                day5Item["ID"] = value.ID;
                day5Item["time"] = value.Day_5_Date;
                day5Item["cls"] = colorCodingClass;
                day5Item["status"] = "Available";
                day5Item["cls"] = colorCodingClass;
                day5Item["totalCount"] = 82;
                console.log(day5Item)
                eventData.push(day5Item);
            }
            if (value.Day_6_Date != "") {
                console.log("inside day6date");
                var day6Item = {};
                day6Item["ID"] = value.ID;
                day6Item["time"] = value.Day_6_Date;
                day6Item["cls"] = colorCodingClass;
                day6Item["status"] = "Available";
                day6Item["cls"] = colorCodingClass;
                day6Item["totalCount"] = 82;
                console.log(day6Item)
                eventData.push(day6Item);
            }
            if (value.Day_7_Date != "") {
                console.log("inside day7date");
                var day7Item = {};
                day7Item["ID"] = value.ID;
                day7Item["time"] = value.Day_7_Date;
                day7Item["cls"] = colorCodingClass;
                day7Item["status"] = "Available";
                day7Item["cls"] = colorCodingClass;
                day7Item["totalCount"] = 82;
                console.log(day7Item)
                eventData.push(day7Item);
            }
            if (value.Day_8_Date != "") {
                console.log("inside day8date");
                var day8Item = {};
                day8Item["ID"] = value.ID;
                day8Item["time"] = value.Day_8_Date;
                day8Item["cls"] = colorCodingClass;
                day8Item["status"] = "Available";
                day8Item["cls"] = colorCodingClass;
                day8Item["totalCount"] = 82;
                console.log(day8Item)
                eventData.push(day8Item);
            }
            if (value.Day_9_Date != "") {
                console.log("inside day9date");
                var day9Item = {};
                day9Item["ID"] = value.ID;
                day9Item["time"] = value.Day_9_Date;
                day9Item["cls"] = colorCodingClass;
                day9Item["status"] = "Available";
                day9Item["cls"] = colorCodingClass;
                day9Item["totalCount"] = 92;
                console.log(day9Item)
                eventData.push(day9Item);
            }
            if (value.Day_10_Date != "") {
                console.log("inside day10date");
                var day10Item = {};
                day10Item["ID"] = value.ID;
                day10Item["time"] = value.Day_10_Date;
                day10Item["cls"] = colorCodingClass;
                day10Item["status"] = "Available";
                day10Item["cls"] = colorCodingClass;
                day10Item["totalCount"] = 102;
                console.log(day10Item)
                eventData.push(day10Item);
            }
        }
      
    });
    // console.log("eventData:"+eventData['day1Item']);
    var hotelData = groupAndAddForNonconfirmStatus(eventData);
    hotelData.forEach((values, keys) => {
        hotelRevenueData.push(values);
    });
    console.log("non confimr status :"+hotelRevenueData);
    var cal = Calendar('calendar');
    cal.bindData(hotelRevenueData);
    cal.render();
}
function fetchDealRevenueDetailsTotal(categoryValue, status) {

    var eventStatus = "";
    var creatorSdk = ZOHO.CREATOR.init();
    creatorSdk.then(function (data) {
        getOppRevenueDetails("1");
    });
    var config;

    function getOppRevenueDetails(pageNum) {
            config = {
                appName: "pal-plus",
                reportName: "CalendarViewResultForm_Report",
                criteria: "(Income_Category == \"" + categoryValue + "\")",
                page: pageNum,
                pageSize: 200
            }
        //  console.log(config);
        var getRecords = ZOHO.CREATOR.API.getAllRecords(config);
        getRecords.then(function (response) {
            //console.log("respFor Total from resultForm::" + categoryValue + JSON.stringify(response));
            if (response.code == 3000) {
                var dataList = JSON.stringify(response.data);
                var recordsLength = Object.keys(response.data).length;
                createEventJsonDataForTotal(response.data, categoryValue);
            } else {
                console.log("no matching records found");
            }
            // if (recordsLength == 200) {
            //   getOppRevenueDetails(parseInt(pageNum) + 1);
            // }
            // else {
            //   console.log("Less than 200");
            // }
        }).catch(err => {
            console.log(err);
            console.log("no data exists");
            var cal = Calendar('calendar');
            cal.bindData(emptyData);
            cal.render();

        });
    }
}
function createEventJsonDataForTotal(dataList, categoryValue) {

    var totalColorCodingClass = "bg-available";
    console.log("dataList inside total fn:"+ JSON.stringify(dataList));
    $.each(dataList, function (key, value) {
        console.log("day1 date:"+value.Date_field);
        var sameDate = 0;
                console.log("inside day1 date check");
                var day1Item = {};
                var day1TotalCount = 0;
                day1Item["ID"] = value.ID;
                day1Item["time"] = value.Date_field;
                day1Item["status"] = "Available";
                day1Item["cls"] = totalColorCodingClass;
                day1Item["totalCount"] = value.Total_Number_of_Rooms;
                hotelRevenueData.push(day1Item);

    });
    console.log("hotelrevenue data for confirme:"+hotelRevenueData);
    var cal = Calendar('calendar');
    cal.bindData(hotelRevenueData);
    cal.render();
}
function fetchDealRevenueDetailsForProposition(categoryValue, status) {

    var eventStatus = "";
    var creatorSdk = ZOHO.CREATOR.init();
    creatorSdk.then(function (data) {
        getOppRevenueDetails("1");
    });
    function getOppRevenueDetails(pageNum) {
        var config = {
            appName: "pal-plus",
            reportName: "Opportunities_Ventes_Report",
            criteria: "(Income_Category == \"" + categoryValue + "\" && Sales_Stage == \"" + status + "\")",
            page: pageNum,
            pageSize: 200
        }
        console.log("proposition config:"+JSON.stringify(config));
        var getRecords = ZOHO.CREATOR.API.getAllRecords(config);
        getRecords.then(function (response) {
            console.log("respFor Total::" + categoryValue + JSON.stringify(response));
            if (response.code == 3000) {
                createEventJsonDataForProposition(response.data, status);
            } else {
                console.log("no matching records found");
            }
            // if (recordsLength == 200) {
            //   getOppRevenueDetails(parseInt(pageNum) + 1);
            // }
            // else {
            //   console.log("Less than 200");
            // }
        }).catch(e => {
            console.log("no data exists:"+e);
            console.log("error in porposition ferch");
            var cal = Calendar('calendar');
            cal.bindData(emptyData);
            cal.render();

        });
    }
}
function createEventJsonDataForProposition(dataList, status) {

    var colorCodingClass = "bg-proposition";
    var eventData = [];

    $.each(dataList, function (key, value) {
           if (value.Day_1_Date != "") {
            var day1Item = {};
            var day1TotalCount = 0;
            day1TotalCount = parseInt(value.Number_of_bedrooms_J1);
            day1Item["ID"] = value.ID;
            day1Item["time"] = value.Day_1_Date;
            day1Item["status"] = status;
            day1Item["cls"] = colorCodingClass;
            day1Item["totalCount"] = day1TotalCount;
            eventData.push(day1Item);
        }
        if (value.Day_2_Date != "") {
            var day2Item = {};
            var day2TotalCount = 0;
            day2TotalCount = parseInt(value.Number_of_bedrooms_J2);
            day2Item["ID"] = value.ID;
            day2Item["time"] = value.Day_2_Date;
            day2Item["cls"] = colorCodingClass;
            day2Item["status"] = status;
            day2Item["cls"] = colorCodingClass;
            day2Item["totalCount"] = day2TotalCount;
            eventData.push(day2Item);
        }
        if (value.Day_3_Date != "") {
            var day3Item = {};
            var day3TotalCount = 0;
            day3TotalCount = parseInt(value.Number_of_bedrooms_J3);
            day3Item["ID"] = value.ID;
            day3Item["time"] = value.Day_3_Date;
            day3Item["status"] = status;
            day3Item["cls"] = colorCodingClass;

            day3Item["totalCount"] = day3TotalCount;
            eventData.push(day3Item);
        }
        if (value.Day_4_Date != "") {
            var day4Item = {};
            var day4TotalCount = 0;
            day4TotalCount = parseInt(value.Number_of_bedrooms_J4);
            day4Item["ID"] = value.ID;
            day4Item["time"] = value.Day_4_Date;
            day4Item["status"] = status;
            day4Item["cls"] = colorCodingClass;
            day4Item["totalCount"] = day4TotalCount;
            eventData.push(day4Item);
        }
        if (value.Day_5_Date != "") {
            var day5Item = {};
            var day5TotalCount = 0;
            day5TotalCount = parseInt(value.Number_of_bedrooms_J5);
            day5Item["ID"] = value.ID;
            day5Item["time"] = value.Day_5_Date;

            day5Item["status"] = status;
            day5Item["cls"] = colorCodingClass;
            day5Item["totalCount"] = day5TotalCount;
            eventData.push(day5Item);
        }
        if (value.Day_6_Date != "") {
            var day6Item = {};
            var day6TotalCount = 0;
            day6TotalCount = parseInt(value.Number_of_bedrooms_J6);
            day6Item["ID"] = value.ID;
            day6Item["time"] = value.Day_6_Date;
            day6Item["status"] = status;
            day6Item["cls"] = colorCodingClass;
            day6Item["totalCount"] = day6TotalCount;
            eventData.push(day6Item);
        }
        if (value.Day_7_Date != "") {
            var day7Item = {};
            var day7TotalCount = 0;
            day7TotalCount = parseInt(value.Number_of_bedrooms_J7);
            day7Item["ID"] = value.ID;
            day7Item["time"] = value.Day_7_Date;
            day7Item["status"] = status;
            day7Item["cls"] = colorCodingClass;
            day7Item["totalCount"] = day7TotalCount;
            eventData.push(day7Item);
        }
        if (value.Day_8_Date != "") {
            var day8Item = {};
            var day8TotalCount = 0;
            day8TotalCount = parseInt(value.Number_of_bedrooms_J8);
            day8Item["ID"] = value.ID;
            day8Item["time"] = value.Day_8_Date;
            day8Item["status"] = status;
            day8Item["cls"] = colorCodingClass;
            day8Item["totalCount"] = day8TotalCount;
            eventData.push(day8Item);
        }
        if (value.Day_9_Date != "") {
            var day9Item = {};
            var day9TotalCount = 0;
            day9TotalCount = parseInt(value.Number_of_bedrooms_J9);
            day9Item["ID"] = value.ID;
            day9Item["time"] = value.Day_9_Date;
            day9Item["status"] = status;
            day9Item["cls"] = colorCodingClass;
            day9Item["totalCount"] = day9TotalCount;
            eventData.push(day9Item);
        }
        if (value.Day_10_Date != "") {
            var day10Item = {};
            var day10TotalCount = 0;
            day10TotalCount = parseInt(value.Number_of_bedrooms_J10);
            day10Item["ID"] = value.ID;
            day10Item["time"] = value.Day_10_Date;
            day10Item["status"] = status;
            day10Item["cls"] = colorCodingClass;
            day10Item["totalCount"] = day10TotalCount;
            eventData.push(day10Item);
        }

    });
    var hotelData = groupAndAdd(eventData);
    hotelData.forEach((values, keys) => {
        hotelRevenueData.push(values);
    });
    console.log("hotel Revenue data for proposition :" + hotelRevenueData);
    var cal = Calendar('calendar');
    cal.bindData(hotelRevenueData);
    cal.render();
}
const groupAndAdd = (arr = []) => {
    const result = new Map();
    arr.forEach(el => {
        let item = result.get(el.time) || { time: el.time, totalCount: 0, cls: el.cls, status: el.status };
        item.totalCount += el.totalCount;
        result.set(item.time, item);
    });
    return result;
};
const groupAndAddForNonconfirmStatus = (arr = []) => {
    const result = new Map();
    arr.forEach(el => {
        let item = result.get(el.time) || { time: el.time, totalCount: 0, cls: el.cls, status: el.status };
        item.totalCount = el.totalCount;
        result.set(item.time, item);
    });
    return result;
};

function fetchDealRevenueDetailsTotalForEscapade(categoryValue, serviceValue, status) {
    escapadeRevenueData.length = 0;
    var eventStatus = "";
    var creatorSdk = ZOHO.CREATOR.init();
    creatorSdk.then(function (data) {
        getOppRevenueDetails("1");
    });

    function getOppRevenueDetails(pageNum) {

        var config = {
            appName: "pal-plus",
            reportName: "CalendarViewResultForm_Report",
            criteria: "(Income_Category == \"" + categoryValue + "\" && Booking_Service == \"" + serviceValue + "\")",
            page: pageNum,
            pageSize: 200
        }

        //  console.log(config);
        var getRecords = ZOHO.CREATOR.API.getAllRecords(config);
        getRecords.then(function (response) {
            //alert(response.data)
            console.log("respFor Total from resultForm::" + categoryValue + JSON.stringify(response));
            if (response.code == 3000) {
                // var dataList = JSON.stringify(response.data);
                // var recordsLength = Object.keys(response.data).length;
                createEventJsonDataForTotalForEscapade(response.data, categoryValue);
            } else {
                console.log("no matching records found");
            }
            // if (recordsLength == 200) {
            //   getOppRevenueDetails(parseInt(pageNum) + 1);
            // }
            // else {
            //   console.log("Less than 200");
            // }
        }).catch(err => {
            console.log(err);
            console.log("no data exists");
           // alert("Error message :"+err);
            var cal = Calendar('calendar');
            cal.bindData(emptyData);
            cal.render();

        });
    }
}
function createEventJsonDataForTotalForEscapade(dataList, categoryValue) {
   // escapadeRevenueData.length = 0;
    var totalColorCodingClass = "bg-available";
    var espacadeData = [];
    $.each(dataList, function (key, value) {
        var sameDate = 0;
        if (value.Event_Date != "") {
            var day1Item = {};
            var day1TotalCount = 0;
            day1Item["ID"] = value.ID;
            day1Item["time"] = value.Date_field;
            day1Item["status"] = "Available";
            day1Item["cls"] = totalColorCodingClass;
            day1Item["totalCount"] = value.Total_Number_of_Rooms;
            escapadeRevenueData.push(day1Item);
        }
    });
    // hotelRevenueData.push(espacadeData);
    var cal = Calendar('calendar');
    cal.bindData(escapadeRevenueData);
    cal.render();
}
function fetchDealReveueTotalForEscapadeProposition(categoryValue, serviceValue, status) {
    var creatorSdk = ZOHO.CREATOR.init();
    creatorSdk.then(function (data) {
        getOppRevenueDetails("1");
    });
    function getOppRevenueDetails(pageNum) {
        var config = {
            appName: "pal-plus",
            reportName: "Opportunities_Ventes_Report",
            criteria: "(Income_Category == \"" + categoryValue + "\" && Booking_Service == \"" + serviceValue + "\" && Sales_Stage == \"" + status + "\")",
            page: pageNum,
            pageSize: 200
        }
        var getRecords = ZOHO.CREATOR.API.getAllRecords(config);
        getRecords.then(function (response) {
            if (response.code == 3000) {
                createEventJsonForEscapadeProposition(response.data, status);
            } else {
                //alert("no matching records found");
                console.log("no matching records found");
            }
            // if (recordsLength == 200) {
            //   getOppRevenueDetails(parseInt(pageNum) + 1);
            // }
            // else {
            //   console.log("Less than 200");
            // }
        }).catch(err => {
            //alert("error in proposition:"+err);
            console.log("no data exists");
            //alert("no data exists");
            // var cal = Calendar('calendar');
            // cal.bindData(emptyData);
            // cal.render();

        });
    }
}
function createEventJsonForEscapadeProposition(dataList,status) {
   // escapadeRevenueData.length = 0;
    var statusColorCodingClass = "bg-proposition";
    var index = 0;
    var escapadeData = [];
    var totalParticipants = 0;
    $.each(dataList, function (key, value) {
        console.log("value in escapade Proposition::" + dataList.length);
        console.log(value.Number_of_participants);
        index = index + 1;
        if (value.Event_Date != "") {
            var escapadeItem = {};
            escapadeItem["ID"] = index;
            escapadeItem["time"] = value.Event_Date;
            escapadeItem["cls"] = statusColorCodingClass;
            escapadeItem["status"] = status;

            escapadeItem["totalCount"] = parseInt(value.Number_of_participants);

            escapadeData.push(escapadeItem);
        }
    });
    // alert(escapadeData);
    console.log(escapadeData);
    var escapadeEventData = groupAndAdd(escapadeData);
    escapadeEventData.forEach((values, keys) => {
        escapadeRevenueData.push(values);
    });
    // alert(escapadeRevenueData);
    //console.log(hotelRevenueData);
    var cal = Calendar('calendar');
    cal.bindData(escapadeRevenueData);
    cal.render();


}
function populateNonConfirmAvailableDataForEScapade(dataList){
    console.log("inside non confirm data");
    var colorCodingClass = "bg-available";
    var eventData = [];
    var totalCount = 0;
    $.each(dataList,function(key,value){
        if(value.Sales_Stage != "Confirmé" && value.Sales_Stage != "Proposition"){
            if (value.Event_Date != "") {
                var day1Item = {};
                day1Item["ID"] = value.ID;
                day1Item["time"] = value.Day_1_Date;
                day1Item["status"] = "Available";
                day1Item["cls"] = colorCodingClass;
                day1Item["totalCount"] = 176;
                console.log(day1Item);
                eventData.push(day1Item);
            }
    }
 });
    // console.log("eventData:"+eventData['day1Item']);
    var hotelData = groupAndAddForNonconfirmStatus(eventData);
    hotelData.forEach((values, keys) => {
        escapadeRevenueData.push(values);
    });
    console.log("non confimr status :"+escapadeRevenueData);
    var cal = Calendar('calendar');
    cal.bindData(escapadeRevenueData);
    cal.render();
}
function fetchDealRevenueDetailsOMGTotal(categoryValue, serviceValue, status) {

    var eventStatus = "";
    var creatorSdk = ZOHO.CREATOR.init();
    creatorSdk.then(function (data) {
        getOppRevenueDetails("1");
    });
    function getOppRevenueDetails(pageNum) {
        var serviceValue1 = "Cocktail";
        var config = {
            appName: "pal-plus",
            reportName: "Opportunities_Ventes_Report",
            criteria: "(Income_Category == \"" + categoryValue + "\" && Service == \"" + serviceValue + "\" && Sales_Stage == \"" + status + "\")",
               page: pageNum,
            pageSize: 200
        }

        console.log(config);
        // try{
        //     console.log("inside try");
        var getRecords = ZOHO.CREATOR.API.getAllRecords(config);
        console.log(getRecords);
        getRecords.then(function (response) {
            console.log(response);
            console.log("respFor Total::" + categoryValue + JSON.stringify(response));
            if (response.code == 3000) {
                var dataList = JSON.stringify(response.data);
                var recordsLength = Object.keys(response.data).length;
                console.log(recordsLength);
                createEventJsonDataOMG(response.data, status);
            } else if (response.code != 3000) {
                console.log("No matching records found");
                //alert("No Records found");

            } else {
                console.log("No Matching records found");
            }
            // if (recordsLength == 200) {
            //   getOppRevenueDetails(parseInt(pageNum) + 1);
            // }
            // else {
            //   console.log("Less than 200");
            // }
        }).catch(err => {
            var emptyData = [];
            console.log("no data exists");
            var cal = Calendar('calendar');
            cal.bindData(emptyData);
            cal.render();

        });
        // }catch(e){
        //     console.log(e);
        // }

    }
}
function createEventJsonDataOMG(dataList, status) {
    OMGRevenueData.length = 0;

    var omgEventData = [];
    var index = index + 1;
    var colorCodingClass = "bg-confirm";
    var totalParticipants = 0;
    $.each(dataList, function (key, value) {
        console.log(value.Number_of_participants);
        if (value.Event_Date != null) {
            var OMGItem = {};
            OMGItem["ID"] = index;
            OMGItem["time"] = value.Event_Date;
            OMGItem["cls"] = colorCodingClass;
            OMGItem["status"] = "Total";
            //totalParticipants = totalParticipants +  parseInt(value.Number_of_participants);
            OMGItem["totalCount"] = parseInt(value.Number_of_participants);

            omgEventData.push(OMGItem);
        }
    });
    var omgData = groupAndAdd(omgEventData);
    omgData.forEach((values, keys) => {
        OMGRevenueData.push(values);
    });
    console.log("OMGREvene total:" + OMGRevenueData);
    var cal = Calendar('calendar');
    cal.bindData(OMGRevenueData);
    cal.render();
}
function populateAvailableStatusForEscapade(categoryValue,serviceValue,status){
    var status="Confirmé";
    var propStatus = "Proposition";
    var confirmCount = 0;
    var propositionCount = 0;
    var otherCount = 0;
    hotelRevenueData.length = 0;
    var eventStatus = "";
    var creatorSdk = ZOHO.CREATOR.init();
    var otherStatus = true;
    creatorSdk.then(function (data) {
        getOppRevenueDetails("1");
    });
    //alert(categoryValue);
    //alert(serviceValue);
    function getOppRevenueDetails(pageNum) {

        var config = {
            appName: "pal-plus",
            reportName: "Opportunities_Ventes_Report",
            criteria: "(Income_Category == \"" + categoryValue + "\" && Booking_Service == \"" + serviceValue + "\")",
            page: pageNum,
            pageSize: 200
        }

        //  console.log(config);
        var getRecords = ZOHO.CREATOR.API.getAllRecords(config);
        getRecords.then(function (response) {
           console.log("respFor Total from resultForm::" + categoryValue + JSON.stringify(response));
            if (response.code == 3000) {
                $.each(response.data, function (key, value) {
                    console.log("status:"+value.Sales_Stage);
                    if(value.Sales_Stage == status){
                        confirmCount = confirmCount+1;
                    }else if(value.Sales_Stage == propStatus){
                        propositionCount = propositionCount + 1;
                    }else{
                        otherCount = otherCount + 1;
                    }
                });
                console.log("confirmCount:"+ confirmCount);
                if(confirmCount>0){
                    otherStatus = false;
                    console.log("inside confirmcount");
                    fetchDealRevenueDetailsTotalForEscapade(categoryValue,serviceValue, status);
                }
                if(propositionCount>0){
                    otherStatus = false;
                    fetchDealReveueTotalForEscapadeProposition(categoryValue, serviceValue, propStatus);
                }
                if(otherStatus){
                    console.log("inside other log");
                    populateNonConfirmAvailableData(response.data,categoryValue);
                }
            } else {
                console.log("no matching records found");
            }
            // if (recordsLength == 200) {
            //   getOppRevenueDetails(parseInt(pageNum) + 1);
            // }
            // else {
            //   console.log("Less than 200");
            // }
            
        }).catch(err => {
            
            console.log("no data exists");
            console.log(err);
            var cal = Calendar('calendar');
            cal.bindData(emptyData);
            cal.render();

        });
    }
}
