const ym0 = moment().format('YYYY-MM');
const ym1 = moment().subtract(1, 'month').format('YYYY-MM');
const ym2 = moment().add(1, 'month').format('YYYY-MM');
export const tableData = [];
// export const mockData = [
//     {
//         cls: 'bg-black',
//         account:"Account 1",
//         oppSubTitle:"Deal 1",
//         contact:"Contact 1",
//         salesRes:"Resp 1",
//         createdDate:"",
//         time : May 1, - 4 - 4 -day 1
//         noOfRooms:"9",
//         noOfParticipants:"",
//         statusOfDeal:"",
//         title: 'Deal 1',
//         count:"4"
//     },
//     
//     {
//         cls: 'bg-black',
//         account:"Account 1",
//         oppSubTitle:"Deal 1",
//         contact:"Contact 1",
//         salesRes:"Resp 1",
//         createdDate:"",
//         time : May 1,
//         noOfRooms:"9",
//         noOfParticipants:"",
//         statusOfDeal:"",
//         title: 'Deal 1',
//         count:"1"
//     },
//     {
//         cls: 'bg-black',
//         account:"Account 2",
//         oppSubTitle:"Deal 2",
//         contact:"Contact 2",
//         salesRes:"Rep1",
//         createdDate:"",
//         time : convertDateFormat(day1Date),
//         noOfRooms:"5",
//         noOfParticipants:"",
//         statusOfDeal:"",
//         desc: 'Deal 2',
//         title:'Deal 2',
//         count:"2"
//     },
//     {
//         cls: 'bg-black',
//         account:"",
//         oppSubTitle:"Deal 3",
//         contact:"",
//         salesRes:"",
//         createdDate:"",
//         noOfRooms:"",
//         noOfParticipants:"",
//         statusOfDeal:"",
//         desc: 'Deal 3 desc',
//         title:'Deal 3' ,
//         count :"3"
//     },
   
// ];
export const hotelRevenueData = [
];
export const escapadeRevenueData = [
];
export const OMGRevenueData = [
];
export const escapadeRevenueTableData = [
];
export const OMGRevenueTableData = [
];
export const e4sRevenueData = [];
function convertDateFormat(dayDate){
    var customDate = new Date(dayDate.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
    return customDate;
}
export const emptyData = [];
export const testData = [
  {
    Contacts_B2B: "",
    Description: "",
    Opportunity_SubTitle: "",
    Opportunity_Title: "V20230124",
    Number_of_bedrooms_J10: "",
    Sales_Stage: "Perdu",
    Day_3_Date: "08-Apr-2023",
    Number_of_Rooms: "0",
    Departure_Date: "12-Apr-2023",
    Number_of_participants: "0",
    Event_Type: "",
    Arrival_Date: "05-Apr-2023",
    Day_6_Date: "11-Apr-2023",
    Day_9_Date: "",
    ID: "4456037000000856206",
    Event_Date: "",
    Users_Representative_1: "",
   Number_of_bedrooms_J1: "1",
    Number_of_bedrooms_J3: "3",
    Number_of_bedrooms_J2: "2",
    Day_8_Date: "",
    Number_of_bedrooms_J5: "1",
    Day_5_Date: "10-Apr-2023",
    Number_of_bedrooms_J4: "1",
    Number_of_bedrooms_J7: "1",
    Number_of_bedrooms_J6: "1",
    Number_of_bedrooms_J9: "",
    Day_2_Date: "07-Apr-2023",
    Number_of_bedrooms_J8: "",
    Service: "",
    Accounts_B2B: "",
    Booking_Service: "",
    Income_Category: "Hôtel - Verso",
    Creation_Date: "01-May-2023",
    Day_1_Date: "06-Apr-2023",
    Day_4_Date: "09-Apr-2023",
    Day_7_Date: "12-Apr-2023",
    Day_10_Date: ""
  },
  {
    Contacts_B2B: "",
    Description: "Test Deal",
    Opportunity_SubTitle: "Scriptis",
    Opportunity_Title: "V20230412",
    Number_of_bedrooms_J10: "",
    Sales_Stage: "perdu",
    Day_3_Date: "14-Apr-2023",
    Number_of_Rooms: "6",
    Departure_Date: "04-Apr-2023",
    Number_of_participants: "0",
    Event_Type: "Colloque / congrés",
    Arrival_Date: "12-Apr-2023",
    Day_6_Date: "",
    Day_9_Date: "",
    ID: "4456037000000823013",
    Event_Date: "",
    Users_Representative_1: {
      display_value: "annie@palplus.ca",
      ID: "4456037000000645692"
    },
    Number_of_bedrooms_J1: "1",
    Number_of_bedrooms_J3: "2",
    Number_of_bedrooms_J2: "2",
    Day_8_Date: "",
    Number_of_bedrooms_J5: "",
    Day_5_Date: "",
    Number_of_bedrooms_J4: "",
    Number_of_bedrooms_J7: "",
    Number_of_bedrooms_J6: "",
    Number_of_bedrooms_J9: "",
    Day_2_Date: "13-Apr-2023",
    Number_of_bedrooms_J8: "",
    Service: "",
    Accounts_B2B: {
      display_value: "Scriptis",
      ID: "4456037000000774222"
    },
    Booking_Service: "",
    Income_Category: "Hôtel - Verso",
    Creation_Date: "",
    Day_1_Date: "12-Apr-2023",
    Day_4_Date: "",
    Day_7_Date: "",
    Day_10_Date: ""
  },
  {
    Contacts_B2B: "",
    Description: "",
    Opportunity_SubTitle: "",
    Opportunity_Title: "V20230427 au 20220930",
    Number_of_bedrooms_J10: "",
    Sales_Stage: "Annulé",
    Day_3_Date: "03-May-2023",
    Number_of_Rooms: "0",
    Departure_Date: "18-Apr-2023",
    Number_of_participants: "0",
    Event_Type: "",
    Arrival_Date: "11-Apr-2023",
    Day_6_Date: "06-May-2023",
    Day_9_Date: "",
    ID: "4456037000000803356",
    Event_Date: "",
    Users_Representative_1: {
      display_value: "annie@palplus.ca",
      ID: "4456037000000645692"
    },
    Number_of_bedrooms_J1: "1",
    Number_of_bedrooms_J3: "3",
    Number_of_bedrooms_J2: "2",
    Day_8_Date: "",
    Number_of_bedrooms_J5: "1",
    Day_5_Date: "05-May-2023",
    Number_of_bedrooms_J4: "1",
    Number_of_bedrooms_J7: "1",
    Number_of_bedrooms_J6: "1",
    Number_of_bedrooms_J9: "",
    Day_2_Date: "02-May-2023",
    Number_of_bedrooms_J8: "",
    Service: "",
    Accounts_B2B: {
      display_value: "Scriptis",
      ID: "4456037000000774222"
    },
    Booking_Service: "",
    Income_Category: "Hôtel - Verso",
    Creation_Date: "24-Apr-2023",
    Day_1_Date: "01-May-2023",
    Day_4_Date: "04-May-2023",
    Day_7_Date: "07-May-2023",
    Day_10_Date: ""
  },
  {
    Contacts_B2B: {
      display_value: "M. Catherine Beri",
      ID: "4456037000000774630"
    },
    Description: "",
    Opportunity_SubTitle: "",
    Opportunity_Title: "V20230428 au 20220930",
    Number_of_bedrooms_J10: "",
    Sales_Stage: "Proposition",
    Day_3_Date: "03-May-2023",
    Number_of_Rooms: "0",
    Departure_Date: "18-Apr-2023",
    Number_of_participants: "0",
    Event_Type: "",
    Arrival_Date: "11-Apr-2023",
    Day_6_Date: "06-May-2023",
    Day_9_Date: "",
    ID: "4456037000000803354",
    Event_Date: "",
    Users_Representative_1: {
      display_value: "annie@palplus.ca",
      ID: "4456037000000645692"
    },
    Number_of_bedrooms_J1: "1",
    Number_of_bedrooms_J3: "3",
    Number_of_bedrooms_J2: "2",
    Day_8_Date: "",
    Number_of_bedrooms_J5: "1",
    Day_5_Date: "05-May-2023",
    Number_of_bedrooms_J4: "1",
    Number_of_bedrooms_J7: "1",
    Number_of_bedrooms_J6: "1",
    Number_of_bedrooms_J9: "",
    Day_2_Date: "02-May-2023",
    Number_of_bedrooms_J8: "",
    Service: "",
    Accounts_B2B: {
     display_value: "Pack Ya Bags Australia",
     ID: "4456037000000774224"
    },
    Booking_Service: "",
    Income_Category: "Hôtel - Verso",
    Creation_Date: "24-Apr-2023",
    Day_1_Date: "01-May-2023",
    Day_4_Date: "04-May-2023",
    Day_7_Date: "07-May-2023",
    Day_10_Date: ""
  },
  {
    Contacts_B2B: {
      display_value: "M. Catherine Beri",
      ID: "4456037000000774630"
    },
    Description: "",
    Opportunity_SubTitle: "",
    Opportunity_Title: "V20230429 au 20220930",
    Number_of_bedrooms_J10: "",
    Sales_Stage: "Proposition",
    Day_3_Date: "03-May-2023",
    Number_of_Rooms: "0",
    Departure_Date: "18-Apr-2023",
    Number_of_participants: "0",
    Event_Type: "",
    Arrival_Date: "11-Apr-2023",
    Day_6_Date: "06-May-2023",
    Day_9_Date: "",
    ID: "4456037000000803352",
    Event_Date: "",
    Users_Representative_1: {
      display_value: "annie@palplus.ca",
      ID: "4456037000000645692"
    },
    Number_of_bedrooms_J1: "1",
    Number_of_bedrooms_J3: "3",
    Number_of_bedrooms_J2: "2",
    Day_8_Date: "",
    Number_of_bedrooms_J5: "1",
    Day_5_Date: "05-May-2023",
    Number_of_bedrooms_J4: "1",
    Number_of_bedrooms_J7: "1",
    Number_of_bedrooms_J6: "1",
    Number_of_bedrooms_J9: "",
    Day_2_Date: "02-May-2023",
    Number_of_bedrooms_J8: "",
    Service: "",
    Accounts_B2B: {
      display_value: "Banque de développement du Canada",
      ID: "4456037000000746730"
    },
    Booking_Service: "",
    Income_Category: "Hôtel - Verso",
    Creation_Date: "24-Apr-2023",
    Day_1_Date: "01-May-2023",
    Day_4_Date: "04-May-2023",
    Day_7_Date: "07-May-2023",
    Day_10_Date: ""
  },
  {
    Contacts_B2B: {
     display_value: "PhilippeRouleau",
      ID: "4456037000000746746"
    },
    Description: "",
    Opportunity_SubTitle: "",
    Opportunity_Title: "V20220928 au 20220930",
    Number_of_bedrooms_J10: "",
    Sales_Stage: "Perdu",
    Day_3_Date: "03-May-2023",
    Number_of_Rooms: "0",
    Departure_Date: "18-Apr-2023",
    Number_of_participants: "0",
    Event_Type: "",
    Arrival_Date: "28-Sep-2022",
    Day_6_Date: "06-May-2023",
    Day_9_Date: "",
    ID: "4456037000000803348",
    Event_Date: "",
    Users_Representative_1: {
      display_value: "annie@palplus.ca",
      ID: "4456037000000645692"
    },
    Number_of_bedrooms_J1: "1",
    Number_of_bedrooms_J3: "3",
    Number_of_bedrooms_J2: "2",
    Day_8_Date: "",
    Number_of_bedrooms_J5: "1",
    Day_5_Date: "05-May-2023",
    Number_of_bedrooms_J4: "1",
    Number_of_bedrooms_J7: "1",
    Number_of_bedrooms_J6: "1",
    Number_of_bedrooms_J9: "",
    Day_2_Date: "02-May-2023",
    Number_of_bedrooms_J8: "",
    Service: "",
    Accounts_B2B: {
      display_value: "Scriptis",
      ID: "4456037000000774222"
    },
    Booking_Service: "",
    Income_Category: "Hôtel - Verso",
    Creation_Date: "27-Apr-2023",
    Day_1_Date: "01-May-2023",
   Day_4_Date: "04-May-2023",
   Day_7_Date: "07-May-2023",
   Day_10_Date: ""
  }
];