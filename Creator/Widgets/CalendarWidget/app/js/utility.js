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
 * This function is to populate the services based  on the selected income category 
 */
function getServiceList(incomeCategory) {
    ZOHO.CREATOR.init().then(function (data) {
        var config = {
            appName: "pal-plus",
            reportName: "CalendarConfigurationServices_Report",
            criteria: "(Income_Category == \"" + incomeCategory + "\")",
        };
        $('#service').append('<option value=""> Select Service </option>');
        ZOHO.CREATOR.API.getAllRecords(config).then(function (response) {
            console.log("data:"+response.data);
            if (response.code == 3000) {
            $.each(response.data, function (index, dataList) {
                $('#service').append('<option value="' + dataList.Services + '">' + dataList.Services + '</option>');
            });
            } else {
                console.log("Error Calling Creator API:" + response.code);
            }
        });
    });
}
const groupAndAdd = (arr = []) => {
    const result = new Map();
    arr.forEach(el => {
        let item = result.get(el.time) || { time: el.time, totalCount: 0, cls: el.cls, status: el.status,flag:el.flag };
        item.totalCount += el.totalCount;
        result.set(item.time, item);
    });
    return result;
};
const groupAndAddForNonconfirmStatus = (arr = []) => {
    const result = new Map();
    arr.forEach(el => {
        let item = result.get(el.time) || { time: el.time, totalCount: 0, cls: el.cls, status: el.status,flag:el.flag };
        item.totalCount = el.totalCount;
        result.set(item.time, item);
    });
    return result;
};
function convertDateFormat(dayDate){
    var customDate = new Date(dayDate.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
    return customDate;
}
