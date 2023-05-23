import {testData} from "./mockData.js";
$(document).ready(function () {
    var eventData = [];
    
    
    $.each(testData,function(key,value){
        var sameDate = 0;
        if(value.Day_1_Date !=""){
            var day1Item = {};
            var day1TotalCount = 0;
              day1TotalCount = parseInt(value.Number_of_bedrooms_J1);
              day1Item["ID"] = value.ID;
                day1Item["time"] = value.Day_1_Date;
                day1Item["cls"] = "colorCodingClass";
                day1Item["status"] = "Available";
                day1Item["totalCount"] = day1TotalCount;
                eventData.push(day1Item);  
        }
        if(value.Day_2_Date !=""){
            var day2Item = {};
            var day2TotalCount = 0;
              day2TotalCount = parseInt(value.Number_of_bedrooms_J2);
              day2Item["ID"] = value.ID;
              day2Item["time"] = value.Day_2_Date;
              day2Item["cls"] = "colorCodingClass";
              day2Item["status"] = "Available";
              day2Item["totalCount"] = day2TotalCount;
                eventData.push(day2Item);  
        }
        if(value.Day_3_Date !=""){
            var day3Item = {};
            var day3TotalCount = 0;
              day3TotalCount = parseInt(value.Number_of_bedrooms_J3);
              day3Item["ID"] = value.ID;
              day3Item["time"] = value.Day_3_Date;
              day3Item["cls"] = "colorCodingClass";
              day3Item["status"] = "Available";
              day3Item["totalCount"] = day3TotalCount;
              eventData.push(day3Item);  
        }
        if(value.Day_4_Date !=""){
            var day4Item = {};
            var day4TotalCount = 0;
              day4TotalCount = parseInt(value.Number_of_bedrooms_J4);
              day4Item["ID"] = value.ID;
                day4Item["time"] = value.Day_4_Date;
                day4Item["cls"] = "colorCodingClass";
                day4Item["status"] = "Available";
                day4Item["totalCount"] = day4TotalCount;
                eventData.push(day4Item);  
        }
        if(value.Day_5_Date !=""){
            var day5Item = {};
            var day5TotalCount = 0;
              day5TotalCount = parseInt(value.Number_of_bedrooms_J5);
              day5Item["ID"] = value.ID;
                day5Item["time"] = value.Day_5_Date;
                day5Item["cls"] = "colorCodingClass";
                day5Item["status"] = "Available";
                day5Item["totalCount"] = day5TotalCount;
                eventData.push(day5Item);  
        }
        if(value.Day_6_Date !=""){
            var day6Item = {};
            var day6TotalCount = 0;
              day6TotalCount = parseInt(value.Number_of_bedrooms_J6);
              day6Item["ID"] = value.ID;
                day6Item["time"] = value.Day_6_Date;
                day6Item["cls"] = "colorCodingClass";
                day6Item["status"] = "Available";
                day6Item["totalCount"] = day6TotalCount;
                eventData.push(day6Item);  
        }
        if(value.Day_7_Date !=""){
            var day7Item = {};
            var day7TotalCount = 0;
              day7TotalCount = parseInt(value.Number_of_bedrooms_J7);
              day7Item["ID"] = value.ID;
                day7Item["time"] = value.Day_7_Date;
                day7Item["cls"] = "colorCodingClass";
                day7Item["status"] = "Available";
                day7Item["totalCount"] = day7TotalCount;
                eventData.push(day7Item);  
        }
        if(value.Day_8_Date !=""){
            var day8Item = {};
            var day8TotalCount = 0;
              day8TotalCount = parseInt(value.Number_of_bedrooms_J8);
              day8Item["ID"] = value.ID;
                day8Item["time"] = value.Day_8_Date;
                day8Item["cls"] = "colorCodingClass";
                day8Item["status"] = "Available";
                day8Item["totalCount"] = day8TotalCount;
                eventData.push(day8Item);  
        }
        if(value.Day_9_Date !=""){
            var day9Item = {};
            var day9TotalCount = 0;
              day9TotalCount = parseInt(value.Number_of_bedrooms_J9);
              day9Item["ID"] = value.ID;
                day9Item["time"] = value.Day_9_Date;
                day9Item["cls"] = "colorCodingClass";
                day9Item["status"] = "Available";
                day9Item["totalCount"] = day9TotalCount;
                eventData.push(day9Item);  
        }
        if(value.Day_10_Date !=""){
            var day10Item = {};
            var day10TotalCount = 0;
              day10TotalCount = parseInt(value.Number_of_bedrooms_J10);
              day10Item["ID"] = value.ID;
                day10Item["time"] = value.Day_10_Date;
                day10Item["cls"] = "colorCodingClass";
                day10Item["status"] = "Available";
                day10Item["totalCount"] = day10TotalCount;
                eventData.push(day10Item);  
        }

    });
    var versoData = groupAndAdd(eventData);
    versoData.forEach((values,keys)=>{
       hotelRevenueData.push(values);
    });
      console.log(hotelRevenueData);
});
const groupAndAdd = (arr = []) => {
    const result = new Map();
    arr.forEach(el => {
       let item = result.get(el.time) || {time: el.time, totalCount: 0 ,cls: el.cls,status:el.status };
       item.totalCount += el.totalCount;
       result.set(item.time, item);
    });
    return result;
 };
