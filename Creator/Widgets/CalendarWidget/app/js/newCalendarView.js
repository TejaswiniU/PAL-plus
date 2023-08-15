import { hotelRevenueData } from "./mockData.js";
import { e4sRevenueData } from "./mockData.js";
import { escapadeRevenueData } from "./mockData.js";
import { OMGRevenueData } from "./mockData.js";
import { Calendar } from './calendar.js';
import { emptyData } from './mockData.js';


$(document).ready(function () {

    getIncomeCategoryDetails();
    $('#incomeCategory').change(function () {
      resetCalendar();
        $('#service').empty();
        $('#serviceDiv').css("display", "none");
        $(document).unbind();
        $("#dealTable").innerHTML = "";
        $("#dealTable > tr").remove();
        $('#dealTable').css("display", "none");
        var categoryValue = $(this).find(':selected').text();
        var categoryValueID = $(this).find(':selected').val();
        //console.log("categoyrvalue::"+categoryValue);
        if (categoryValue == "Select Category") {
            $('#service').empty();
            $('#serviceDiv').css("display", "none");
            resetCalendar();
        }
        else if (categoryValue == "Hôtel Espaces4Saisons" || categoryValue == "Hôtel - Verso") {
            $('#service').empty();
            $('#serviceDiv').css("display", "none");
            populateAvailableStatusForHotel(categoryValue);
        } else if (categoryValue == "Bâteau - Escapade Memphrémagog") {
            $('#service').empty();
            getServiceList(categoryValue);
            $('#serviceDiv').css("display", "block");
            populateServiceForEscapadeOMG(categoryValue);
         } else {
            resetCalendar();
            $('#service').empty();
            getServiceList(categoryValue);
            $('#serviceDiv').css("display", "block");
            populateServiceForEscapadeOMG(categoryValue);
        }
    });
});
function populateServiceForEscapadeOMG(categoryValue){
    $(document).on('change',"#service",function (e) {
        // alert("onchange of escapade servie");
        resetCalendar();
        $("#dealTable").innerHTML = "";
        $("#dealTable > tr").remove();
        $('#dealTable').css("display", "none");
        var serviceValue = $(this).find(':selected').text();
        if(categoryValue== "OMG"){
            fetchDealRevenueDetailsOMGTotal(categoryValue, serviceValue, "Confirmé");
        }else{
            populateAvailableStatusForEscapade(categoryValue, serviceValue); // calendarViewReport
        }
       
    });
    
}

/**
 * This function is to populate available count in the calendar for Hotel verso & E4S
 * @param {} categoryValue 
 */
function populateAvailableStatusForHotel(categoryValue) {
    var status = "Confirmé";
    var propStatus = "Proposition";
    var otherCount = 0;
    var eventStatus = "";
    var otherStatusData = [];
    var otherStatus = true;
    fetchDealRevenueDetailsTotal(categoryValue, status);
    fetchDealRevenueDetailsForProposition(categoryValue, propStatus);
    fetchDealRevenueDetailsForOthers(categoryValue, status, propStatus);


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

       // console.log(config);
        var getRecords = ZOHO.CREATOR.API.getAllRecords(config);
       // console.log(getRecords);
        getRecords.then(function (response) {
           // console.log(response);
           // console.log("respFor Total::" + categoryValue + JSON.stringify(response));
            if (response.code == 3000) {
                var dataList = JSON.stringify(response.data);
                var recordsLength = Object.keys(response.data).length;
               // console.log(recordsLength);
                createEventJsonDataOMG(response.data, status);
            } else if (response.code != 3000) {
                console.log("No matching records found");
            } else {
                console.log("No Matching records found");
            }
            if (recordsLength == 200) {
                getOppRevenueDetails(parseInt(pageNum) + 1);
            }
//             else {
//                 console.log("Less than 200");
//             }
        }).catch(err => {
            
            console.log("no data exists");
            if(parseInt(pageNum) == 1)
            {
            var emptyData = [];
            var cal = Calendar('calendar');
            cal.bindData(emptyData);
            cal.render();
            }

        });
    }
}
function createEventJsonDataOMG(dataList, status) {
    OMGRevenueData.length = 0;

    var omgEventData = [];
    var index = index + 1;
    var colorCodingClass = "bg-confirm";
    var totalParticipants = 0;
    $.each(dataList, function (key, value) {
       // console.log(value.Number_of_participants);
        if (value.Event_Date != null) {
            var OMGItem = {};
            OMGItem["ID"] = index;
            OMGItem["time"] = value.Event_Date;
            OMGItem["cls"] = colorCodingClass;
            OMGItem["status"] = "Total";
            OMGItem["totalCount"] = parseInt(value.Number_of_participants);

            omgEventData.push(OMGItem);
        }
    });
    var omgData = groupAndAdd(omgEventData);
    omgData.forEach((values, keys) => {
        OMGRevenueData.push(values);
    });
   // console.log("OMGREvene total:" + OMGRevenueData);
    var cal = Calendar('calendar');
    cal.bindData(OMGRevenueData);
    cal.render();
}
/**
 * 
 * @param {*} categoryValue 
 * @param {*} serviceValue 
 * @param {*} status 
 * This function is to populate data in calendar for "Bâteau - Escapade Memphrémagog" Category
 */
function populateAvailableStatusForEscapade(categoryValue, serviceValue) {
    // alert("inside populateAvailableStatusForEscapade");
    var status = "Confirmé";
    var propStatus = "Proposition";
    var confirmCount = 0;
    var propositionCount = 0;
    var otherCount = 0;
    var eventStatus = "";
    var creatorSdk = ZOHO.CREATOR.init();
    var otherStatus = true;
    fetchDealRevenueDetailsTotalForEscapade(categoryValue, serviceValue, status);
    fetchDealReveueTotalForEscapadeProposition(categoryValue, serviceValue, propStatus);
    fetchDealRevenueDetailsForOthersEscapade(categoryValue, serviceValue);
}

/**
 * The below functions are to populate hotel data in Calendar
 */
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
            if (response.code == 3000) {
                var dataList = JSON.stringify(response.data);
                var recordsLength = Object.keys(response.data).length;
                createEventJsonDataForTotal(response.data, categoryValue);
            } else {
                console.log("no matching records found");
            }
            if (recordsLength == 200) {
                getOppRevenueDetails(parseInt(pageNum) + 1);
            }
//             else {
//                 console.log("Less than 200");
//             }
        }).catch(err => {
            console.log(err);
            console.log("no data exists");
            if(parseInt(pageNum) == 1)
            {
            var emptyData = [];
            var cal = Calendar('calendar');
            cal.bindData(emptyData);
            cal.render();
            }

        });
    }
}
function createEventJsonDataForTotal(dataList, categoryValue) {
    var totalColorCodingClass = "bg-available";
   // console.log("dataList inside total fn:" + JSON.stringify(dataList));
    $.each(dataList, function (key, value) {
        //console.log("day1 date:" + value.Date_field);
        var sameDate = 0;
       // console.log("inside day1 date check");
        var day1Item = {};
        var day1TotalCount = 0;
        day1Item["ID"] = value.ID;
        day1Item["time"] = value.Date_field;
        day1Item["status"] = "Available";
        day1Item["cls"] = totalColorCodingClass;
        day1Item["totalCount"] = value.Total_Number_of_Rooms;
        day1Item["flag"] = "Confirm";
        hotelRevenueData.push(day1Item);

    });
   // console.log("hotelrevenue data for confirme:" + hotelRevenueData);
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
            reportName: "CalendarViewPropositionForm_Report",
            criteria: "(Income_Category == \"" + categoryValue + "\")",
            page: pageNum,
            pageSize: 200
        }
       // console.log("proposition config:" + JSON.stringify(config));
        var getRecords = ZOHO.CREATOR.API.getAllRecords(config);
        getRecords.then(function (response) {
           // console.log("respFor Total::" + categoryValue + JSON.stringify(response));
            var recordsLength = Object.keys(response.data).length;
            if (response.code == 3000) {
                createEventJsonDataForProposition(response.data, status);
            } else {
                console.log("no matching records found");
            }
            if (recordsLength == 200) {
                getOppRevenueDetails(parseInt(pageNum) + 1);
            }
//             else {
//                 console.log("Less than 200");
//             }
        }).catch(e => {
            console.log("no data exists:" + e);
            console.log("error in porposition ferch");
             if(parseInt(pageNum) == 1)
            {
            var emptyData = [];
            var cal = Calendar('calendar');
            cal.bindData(emptyData);
            cal.render();
            }

        });
    }
}
function createEventJsonDataForProposition(dataList, status) {

    var colorCodingClass = "bg-proposition";
    var eventData = [];
    $.each(dataList, function (key, value) {
       // console.log("day1 date:" + value.Date_field);
        var sameDate = 0;
        var day1Item = {};
        var day1TotalCount = 0;
        day1Item["ID"] = value.ID;
        day1Item["time"] = value.Date_field;
        day1Item["status"] = status;
        day1Item["cls"] = colorCodingClass;
        day1Item["totalCount"] = value.Total_Number_of_Rooms;
        day1Item["flag"] = "proposition";
        hotelRevenueData.push(day1Item);

    });
    var cal = Calendar('calendar');
    cal.bindData(hotelRevenueData);
    cal.render();

}
function fetchDealRevenueDetailsForOthers(categoryValue, status) {

    var eventStatus = "";
    var creatorSdk = ZOHO.CREATOR.init();
    creatorSdk.then(function (data) {
        getOppRevenueDetails("1");
    });
    function getOppRevenueDetails(pageNum) {
        var otherStatusConfig = {
            appName: "pal-plus",
            reportName: "CalendarViewOtherStatus_Report",
            criteria: "(Income_Category == \"" + categoryValue + "\" )",
            page: pageNum,
            pageSize: 200
        }
        // console.log("others config:"+JSON.stringify(otherStatusConfig));
        var getRecords = ZOHO.CREATOR.API.getAllRecords(otherStatusConfig);
        getRecords.then(function (response) {
            // console.log("respFor Total::" + categoryValue + JSON.stringify(response));
            // console.log(response);
            if (response.code == 3000) {
                // console.log(response.data);
                var recordsLength = Object.keys(response.data).length;
                populateNonConfirmAvailableData(response.data);
            } else {
                console.log("no matching records found");
            }
            if (recordsLength == 200) {
                getOppRevenueDetails(parseInt(pageNum) + 1);
            }
//             else {
//                 console.log("Less than 200");
//             }
        }).catch(e => {
            console.log("no data exists:" + e);
            console.log("error in porposition ferch");
        });
    }
}
function populateNonConfirmAvailableData(dataList, categoryValue) {
    var colorCodingClass = "bg-available";
    var eventData = [];
    var totalCount = 0;
    if (categoryValue == "Hôtel - Verso") {
        totalCount = 54;
    } else {
        totalCount = 82;
    }
    $.each(dataList, function (key, value) {
        if (value.Date_field != "") {
           // console.log("Day 1 date:" + value.Date_field);
            var day1Item = {};
            day1Item["ID"] = value.ID;
            day1Item["time"] = value.Date_field;
            day1Item["status"] = "Available";
            day1Item["cls"] = colorCodingClass;
            day1Item["totalCount"] = value.Total_No_of_Rooms;
            day1Item["flag"] = "otherstatus";
            hotelRevenueData.push(day1Item);
        }
    });
    var cal = Calendar('calendar');
    cal.bindData(hotelRevenueData);
    cal.render();
    return eventData;
}
/**
 * Below functions are to populate Escapade data in calendar
 */
function fetchDealRevenueDetailsTotalForEscapade(categoryValue, serviceValue, status) {
    var creatorSdk = ZOHO.CREATOR.init();
    creatorSdk.then(function (data) {
        getOppEscapadeDetails("1");
    });

    function getOppEscapadeDetails(pageNum) {

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
           // console.log("respFor Total from resultForm::" + categoryValue + JSON.stringify(response));
            if (response.code == 3000) {
                var recordsLength = Object.keys(response.data).length;
                createEventJsonDataForTotalForEscapade(response.data, categoryValue);
            } else {
                console.log("no matching records found");
            }
            if (recordsLength == 200) {
                getOppEscapadeDetails(parseInt(pageNum) + 1);
            }
//             else {
//                 console.log("Less than 200");
//             }
        }).catch(err => {
            console.log(err);
            console.log("no data exists");
            // alert("Error message :"+err);
             if(parseInt(pageNum) == 1)
            {
            var emptyData = [];
            var cal = Calendar('calendar');
            cal.bindData(emptyData);
            cal.render();
            }

        });
    }
}
function createEventJsonDataForTotalForEscapade(dataList, categoryValue) {
    var totalColorCodingClass = "bg-available";
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
    var cal = Calendar('calendar');
    cal.bindData(escapadeRevenueData);
    cal.render();
}
function fetchDealReveueTotalForEscapadeProposition(categoryValue, serviceValue, status) {
    escapadeRevenueData.length = 0
    var creatorSdk = ZOHO.CREATOR.init();
    creatorSdk.then(function (data) {
        getOppEscapadePropositionDetails("1");
    });
    function getOppEscapadePropositionDetails(pageNum) {
        var config = {
            appName: "pal-plus",
            reportName: "CalendarViewPropositionForm_Report",
            criteria: "(Income_Category == \"" + categoryValue + "\" && Booking_Service == \"" + serviceValue + "\" )",
            page: pageNum,
            pageSize: 200
        }
        var getRecords = ZOHO.CREATOR.API.getAllRecords(config);
        getRecords.then(function (response) {
            if (response.code == 3000) {
                var recordsLength = Object.keys(response.data).length;
                createEventJsonForEscapadeProposition(response.data, status);
            } else {
                //alert("no matching records found");
                console.log("no matching records found");
            }
            if (recordsLength == 200) {
                getOppEscapadePropositionDetails(parseInt(pageNum) + 1);
            }
//             else {
//               console.log("Less than 200");
//             }
        }).catch(err => {
            console.log("no data exists");
            //alert("no data exists");
            if(parseInt(pageNum) == 1)
            {
            var emptyData = [];
            var cal = Calendar('calendar');
            cal.bindData(emptyData);
            cal.render();
            }

        });
    }
}
function createEventJsonForEscapadeProposition(dataList, status) {
    var statusColorCodingClass = "bg-proposition";
    var index = 0;
    var totalParticipants = 0;
    $.each(dataList, function (key, value) {
        if (value.Event_Date != "") {
            var day1Item = {};
            day1Item["ID"] = value.ID;
            day1Item["time"] = value.Date_field;
            day1Item["cls"] = statusColorCodingClass;
            day1Item["status"] = status;
            day1Item["totalCount"] = value.Total_Number_of_Rooms;

            escapadeRevenueData.push(day1Item);
        }
    });
    var cal = Calendar('calendar');
    cal.bindData(escapadeRevenueData);
    cal.render();

}
function fetchDealRevenueDetailsForOthersEscapade(categoryValue, serviceValue) {
    escapadeRevenueData.length = 0;
    var eventStatus = "";
    var creatorSdk = ZOHO.CREATOR.init();
    creatorSdk.then(function (data) {
        getOppEscapadeOtherDetails("1");
    });
    function getOppEscapadeOtherDetails(pageNum) {
        var otherStatusConfig = {
            appName: "pal-plus",
            reportName: "CalendarViewOtherStatus_Report",
            criteria: "(Income_Category == \"" + categoryValue + "\"  && Service == \"" + serviceValue + "\" )",
            page: pageNum,
            pageSize: 200
        }
        var getRecords = ZOHO.CREATOR.API.getAllRecords(otherStatusConfig);
        getRecords.then(function (response) {
          //  console.log("respFor Total::" + categoryValue + JSON.stringify(response));
            if (response.code == 3000) {
                var recordsLength = Object.keys(response.data).length;
                populateNonConfirmAvailableDataForEScapade(response.data);
            } else {
                console.log("no matching records found");
            }
            if (recordsLength == 200) {
                getOppEscapadeOtherDetails(parseInt(pageNum) + 1);
            }
//             else {
//                 console.log("Less than 200");
//             }
        }).catch(e => {
            console.log("no data exists:" + e);
            console.log("error in porposition ferch");
        });
    }
}
function populateNonConfirmAvailableDataForEScapade(dataList) {
    var colorCodingClass = "bg-available";
    var totalCount = 0;
    $.each(dataList, function (key, value) {
        if (value.Event_Date != "") {
            var day1Item = {};
            day1Item["ID"] = value.ID;
            day1Item["time"] = value.Date_field;
            day1Item["status"] = "Available";
            day1Item["cls"] = colorCodingClass;
            day1Item["totalCount"] = value.Total_No_of_Rooms;
            //console.log(day1Item);
            escapadeRevenueData.push(day1Item);
        }
    });
    var cal = Calendar('calendar');
    cal.bindData(escapadeRevenueData);
    cal.render();
}

/**This fucntion is to reset calendar on change on income category */
function resetCalendar(){
    escapadeRevenueData.length=0;
    hotelRevenueData.length=0;
    OMGRevenueData.length=0;
    var cal = Calendar('calendar');
            cal.bindData(emptyData);
            cal.render();
}
