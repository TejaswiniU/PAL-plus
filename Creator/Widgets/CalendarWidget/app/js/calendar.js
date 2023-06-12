const StopEventPropagation = (e) => {
    if (!e) return;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
};

export const Calendar = (id) => ({
    id: id,
    data: [],
    el: undefined,
    y: undefined,
    m: undefined,
    onDateClick(e) {
        StopEventPropagation(e);
        const el = e.srcElement;
        //alert(el.textContent); 
        //console.log(el.removeAttribute('hidden'));
        // console.log('click'); 
        // console.log(el);
    },
    onEventClick(e) {
        StopEventPropagation(e);
        const el = e.srcElement;
        var categoryValue = $("#incomeCategory").find(':selected').text();
        var serviceValue = $("#service").find(":selected").text();
        // console.log(categoryValue);
        console.log(el);
        if (categoryValue === "Hôtel Espaces4Saisons" || categoryValue === "Hôtel - Verso") {
            getOppportunitiesDetails(categoryValue, el.id);
        }
        else if (categoryValue === "Bâteau - Escapade Memphrémagog") {
            getOppportunitiesDetailsForEscapade(categoryValue, el.id, serviceValue);
        } else {
            getOppportunitiesDetailsForOMG(categoryValue, el.id, serviceValue);
        }
        //$('#dealTable').show();
    //    console.log(el.getAttribute("class"));
    $(".event").each(function(index,element){
        if(element.id === el.id && element.getAttribute("class") === el.getAttribute("class"))
        {
            if(element.getAttribute("class").includes("bg-available") == true){
                $(element).addClass("event_bg");
        }
        else if (element.getAttribute("class").includes("bg-confirm") == true){
                $(element).addClass("event_bg_confirm");
        }
        else if (element.getAttribute("class").includes("bg-proposition") == true){
                $(element).addClass("event_bg_proposition");
        }
        else{
                $(element).removeClass("event_bg");
                $(element).removeClass("event_bg_confirm");
                $(element).removeClass("event_bg_proposition");
        }
       }
        else {
            $(element).removeClass("event_bg");
            $(element).removeClass("event_bg_confirm");
            $(element).removeClass("event_bg_proposition");
        }
    });
    },

    bindData(events) {
        // this.data = events.sort((a,b) => {
        //     if ( a.time < b.time ) return -1;
        //     if ( a.time > b.time ) return 1;
        //     return 0;
        // });
        console.log(events);
        //this.data ="";
        this.data = events;
    },
    clearEvents(emptyEvents){
        this.data =emptyEvents;
    },
    renderEvents() {
        if (!this.data || this.data.length <= 0) return;
        const lis = this.el.querySelectorAll(`.${this.id} .days .inside`);
        let y = this.el.querySelector('.month-year .year').innerText;
        let m = lis[0].querySelector('.date').getAttribute('month');
        // document.querySelectorAll(".event bg-black").forEach(function(c){
        //     console.log(c);
        //     console.log(c.parentNode);
        //     c.parentNode.removeChild(c);
        // });
        console.log(this.data);
        lis.forEach((li) => {
            try {
                let d = li.innerText;
                let divEvents = li.querySelector('.events');
                li.onclick = this.onEventClick;
                var categoryValue = $("#incomeCategory").find(':selected').text();
                this.data.forEach((ev) => {
                    try {
                        let evTime = moment(ev.time);

                        if (evTime.year() == y && evTime.month() == m && evTime.date() == d) {
                            let availableCount = 0;
                            // if (ev.status == "Available") {
                            //     if (categoryValue == "Hôtel - Verso") {
                            //         availableCount = 54 - ev.totalCount;
                            //     } else if (categoryValue == "Hôtel Espaces4Saisons") {
                            //         // console.log("ev.total for e4s:"+ev.totalCount);
                            //         availableCount = 82 - ev.totalCount;
                            //     } else if (categoryValue == "Bâteau - Escapade Memphrémagog") {
                            //         console.log("ev.total for escapade:" + ev.totalCount);
                            //         availableCount = 176 - ev.totalCount;
                            //     } else {
                            //         availableCount = ev.totalCount;
                            //     }
                            //     console.log("available count for total:" + availableCount);
                            // } else {
                            //     console.log("available count with status:" + availableCount);
                            //     availableCount = ev.totalCount;
                            // }
                            let frgEvent = document.createRange().createContextualFragment(`
                             <div time="${ev.ID}" id="${ev.time}" class="event ${ev.cls}">${ev.status}-${ev.totalCount}
                             </div>
                            `);
                            divEvents.appendChild(frgEvent);
                            let divEvent = divEvents.querySelector(`.event[time='${ev.ID}']`);
                            divEvent.onclick = this.onEventClick;
                        }
                    } catch (err2) {
                        console.log(err2);
                    }
                });
            } catch (err1) {
                console.log(err1);
            }

        });

    },
    render(y, m) {
        try {
            if (isNaN(y) && isNaN(this.y)) {
                this.y = moment().year();
            } else if ((!isNaN(y) && isNaN(this.y)) || (!isNaN(y) && !isNaN(this.y))) {
                this.y = y > 1600 ? y : moment().year(); //calendar doesn't exist before 1600! :)
            }
            if (isNaN(m) && isNaN(this.m)) {
                this.m = moment().month();
            } else if ((!isNaN(m) && isNaN(this.m)) || (!isNaN(m) && !isNaN(this.m))) {
                this.m = m >= 0 ? m : moment().month(); //momentjs month starts from 0-11
            }
            //------------------------------------------------------------------------------------------

            const d = moment().year(this.y).month(this.m).date(1); //first date of month
            const now = moment();
            const frgCal = document.createRange().createContextualFragment(`
            <div class="calendar noselect p-5">
            <div id ="selectMon"><label id="monthyearheading">Sélectionnez Mois/Année :</label><i class="fa fa-calendar fa 6" aria-hidden="true"></i>
            <input type="text" name="datepickermy" id="datepickermy" style="display:none"/></div>
                <div class="month-year-btn d-flex justify-content-center align-items-center mb-2">
                
                    <a class="prev-month"><i class="fas fa-caret-left fa-lg m-3"></i></a>
                    <div class="month-year d-flex justify-content-center align-items-center">
                        <div class="month mb-2 mr-2">${moment().month(this.m).format('MMMM')}</div>
                        <div class="year mb-2">${this.y}</div>
                    </div>
                    <a class="next-month"><i class="fas fa-caret-right fa-lg m-3" aria-hidden="true"></i></a>
                    </div>
                <ol class="day-names list-unstyled">
                    <li><h6 class="initials">Sun</h6></li>
                    <li><h6 class="initials">Mon</h6></li>
                    <li><h6 class="initials">Tue</h6></li>
                    <li><h6 class="initials">Wed</h6></li>
                    <li><h6 class="initials">Thu</h6></li>
                    <li><h6 class="initials">Fri</h6></li>
                    <li><h6 class="initials">Sat</h6></li>
                </ol>
            </div>
            `);
            const isSameDate = (d1, d2) => d1.format('YYYY-MM-DD') == d2.format('YYYY-MM-DD');
            let frgWeek;
            d.day(-1); //move date to the oldest Sunday, so that it lines up with the calendar layout
            for (let i = 0; i < 5; i++) { //loop thru 35 boxes on the calendar month
                frgWeek = document.createRange().createContextualFragment(`
                <ol class="days list-unstyled" week="${d.week()}">
                    <li class="${d.add(1, 'd'), this.m != d.month() ? ' outside' : 'inside'}${isSameDate(d, now) ? ' today' : ''}"><div month="${d.month()}" class="date">${d.format('D')}</div><div class="events"></div></li>
                    <li class="${d.add(1, 'd'), this.m != d.month() ? ' outside' : 'inside'}${isSameDate(d, now) ? ' today' : ''}"><div month="${d.month()}" class="date">${d.format('D')}</div><div class="events"></div></li>
                    <li class="${d.add(1, 'd'), this.m != d.month() ? ' outside' : 'inside'}${isSameDate(d, now) ? ' today' : ''}"><div month="${d.month()}" class="date">${d.format('D')}</div><div class="events"></div></li>
                    <li class="${d.add(1, 'd'), this.m != d.month() ? ' outside' : 'inside'}${isSameDate(d, now) ? ' today' : ''}"><div month="${d.month()}" class="date">${d.format('D')}</div><div class="events"></div></li>
                    <li class="${d.add(1, 'd'), this.m != d.month() ? ' outside' : 'inside'}${isSameDate(d, now) ? ' today' : ''}"><div month="${d.month()}" class="date">${d.format('D')}</div><div class="events"></div></li>
                    <li class="${d.add(1, 'd'), this.m != d.month() ? ' outside' : 'inside'}${isSameDate(d, now) ? ' today' : ''}"><div month="${d.month()}" class="date">${d.format('D')}</div><div class="events"></div></li>
                    <li class="${d.add(1, 'd'), this.m != d.month() ? ' outside' : 'inside'}${isSameDate(d, now) ? ' today' : ''}"><div month="${d.month()}" class="date">${d.format('D')}</div><div class="events"></div></li>
                </ol>
                `);
                frgCal.querySelector('.calendar').appendChild(frgWeek);
            }
            frgCal.querySelector('.prev-month').onclick = () => {
                const dp = moment().year(this.y).month(this.m).date(1).subtract(1, 'month');
                this.render(dp.year(), dp.month());
                $('#dealTable').css("display", "none");
            };
            frgCal.querySelector('.next-month').onclick = () => {
                const dn = moment().year(this.y).month(this.m).date(1).add(1, 'month');
                this.render(dn.year(), dn.month());
                $('#dealTable').css("display", "none");
            };
            frgCal.querySelector('#selectMon').onclick = () => {
                $('#dealTable').css("display", "none");
                var dp = $("#selectMon").datepicker({
                    format: "mm-yyyy",
                    language: "fr",
                    startView: "months",
                    minViewMode: "months",
                    changeMonth: true,
                    changeYear: true
                });
              };
            frgCal.querySelector('#selectMon').onchange = () => {
                $('#dealTable').css("display", "none");
                var selectedDadatepickermyte = $("#datepickermy").val();
                var selectedDateArray = selectedDadatepickermyte.split("-");
                var month = selectedDateArray[0].substring(1, selectedDateArray[0].length);
                var year = selectedDateArray[1];
                this.render(year, month - 1);
            };

            this.el = document.getElementById(this.id);
            this.el.innerHTML = ''; //replacing
            this.el.appendChild(frgCal);
            this.renderEvents();
        } catch (error) {
            console.error(error);
        }
    }
});
function showDatePicker(selectedDadatepickermyte) {
    console.log("inside datepicker onchange");
    //var selectedDadatepickermyte = $("#datepickermy").val();
    var selectedDate = new Date(selectedDadatepickermyte).toLocaleDateString();
    var selectedDateArray = selectedDate.split("/");
    console.log(selectedDateArray);
    var month = selectedDateArray[0];
    var year = selectedDateArray[2];
    console.log(month);
    var cal = Calendar('calendar');
    cal.render(year, month - 1);
}
function togglePopup() {
    $(".content").toggle();
}
function getModalData(tableData, noOfRoomsValue,selectedDate) {
    $("#dealTable thead tr").remove();
    $("#dealTable tbody tr").remove();
    $("#dealTable").find("tr:gt(0)").remove();
    $('#dealTable thead').append('<tr><th>Account Name</th><th>Opportunity Title</th><th>Opportunity Subtitle</th><th>Contact</th><th>Sales Representative</th><th>Arrival Date</th><th>Depature Date</th><th>Created Date</th><th>Status</th><th>No of Rooms</th></tr>');
    $('#dealTable').show();
    console.log("tabelDAta:"+JSON.stringify(tableData));
    $(tableData).each(function (index, value) {
        //console.log(value.time);
        var checkStringperdu = "perdu";
        var checkStringconfirm = "confirmé";
        var checkStringproposition = "proposition";
        var checkStringdispon = "Pas de disponibilité";
        var checkStringprospect = "Prospection";
        var checkStringannule = "annulé";
        var accountName ="";
        var contactName = "";
        var salesRepName ="";
        var arrivalDate = "";
        var departureDate ="";
        var noOfRoomsValue = 0;
        var roomsValue = 0;
        var createdDate = "";
        console.log(value.Income_Category);
        console.log("opportunity Id:"+value.Zoho_CRM_ID);
        if(value.Income_Category == "Bâteau - Escapade Memphrémagog"){
            console.log("inside if:"+selectedDate);
            if (selectedDate === value.Event_Date) {
             noOfRoomsValue = value.Number_of_participants;
             console.log("noOfRoomsValue inside if:"+noOfRoomsValue);
            }
        }else if(value.Income_Category == "OMG"){
            if (selectedDate === value.Event_Date) {
                noOfRoomsValue = value.Number_of_participants;
               }
        }else{

        
            if (selectedDate === value.Day_1_Date) {
                        noOfRoomsValue = value.Number_of_bedrooms_J1;
                    }
                    if (selectedDate === value.Day_2_Date) {
                        noOfRoomsValue = value.Number_of_bedrooms_J2;
                    }
                    if (selectedDate === value.Day_3_Date) {
                        noOfRoomsValue = value.Number_of_bedrooms_J3;
                    }
                    if (selectedDate === value.Day_4_Date) {
                        noOfRoomsValue = value.Number_of_bedrooms_J4;
                    }
                    if (selectedDate === value.Day_5_Date) {
                        noOfRoomsValue = value.Number_of_bedrooms_J5;
                    }
                    if (selectedDate === value.Day_6_Date) {
                        noOfRoomsValue = value.Number_of_bedrooms_J6;
                    }
                    if (selectedDate === value.Day_7_Date) {
                        noOfRoomsValue = value.Number_of_bedrooms_J7;
                    }
                    if (selectedDate === value.Day_8_Date) {
                        noOfRoomsValue = value.Number_of_bedrooms_J8;
                    }
                    if (selectedDate === value.Day_9_Date) {
                        noOfRoomsValue = value.Number_of_bedrooms_J9;
                    }
                    if (selectedDate === value.Day_10_Date) {
                        noOfRoomsValue = value.Number_of_bedrooms_J10;
                    }
                }
        if (value.Accounts_B2B != "") { 
            var accountName = value.Accounts_B2B.display_value; 
        }
        console.log("inside tabledata");
        console.log(value.Sales_Stage);
        console.log(noOfRoomsValue);
        if (value.Contacts_B2B != "") {  contactName = value.Contacts_B2B.display_value; }
        if (value.Users_Representative_1 != "") { salesRepName = value.Users_Representative_1.display_value; }
        if (noOfRoomsValue != 0) {  roomsValue = noOfRoomsValue; }
        if(value.Arrival_Date!=""){arrivalDate = value.Arrival_Date;}
        if(value.Departure_Date != ""){departureDate = value.Departure_Date;}
        if(value.Creation_Date !=""){createdDate  = value.Creation_Date;}
        console.log(salesRepName);
        if (value.Sales_Stage.toUpperCase() === checkStringperdu.toUpperCase()) {
            $('#dealTable tbody').append('<tr class="perdu" id="perduID"><td style="display:none;"><input type="hidden" id="crmID" value="'+value.Zoho_CRM_ID +'"></td><td>' + accountName + '</td>><td>' + value.Opportunity_Title + '</td><td>' + accountName + '</td><td>'
                + contactName + '</td><td>' + salesRepName + '</td><td>' + arrivalDate + '</td><td>' + departureDate + '</td><td>' + createdDate + '</td><td>' + value.Sales_Stage + '</td><td>' + roomsValue + '</td></tr><tr>...</tr>');
        }
        else if (value.Sales_Stage.toUpperCase() === checkStringconfirm.toUpperCase()) {
            $('#dealTable tbody').append('<tr class="confirm"  id="confirmID" ><td style="display:none;"><input type="hidden" id="crmID" value="'+value.Zoho_CRM_ID +'"></td><td>' + accountName + '</td>><td>' + value.Opportunity_Title + '</td><td>' + accountName + '</td><td>'
                + contactName + '</td><td>' + salesRepName + '</td><td>' + arrivalDate + '</td><td>' + departureDate + '</td><td>' + createdDate + '</td><td>' + value.Sales_Stage + '</td><td>' + roomsValue + '</td></tr><tr>...</tr>');
        }
        else if (value.Sales_Stage.toUpperCase() === checkStringproposition.toUpperCase()) {
            $('#dealTable tbody').append('<tr class="proposition" id="propositionID"><td style="display:none;"><input type="hidden" id="crmID" value="'+value.Zoho_CRM_ID +'"></td><td>' + accountName + '</td>><td>' + value.Opportunity_Title + '</td><td>' + accountName + '</td><td>'
                + contactName + '</td><td>' + salesRepName + '</td><td>' + arrivalDate + '</td><td>' +departureDate + '</td><td>' + createdDate + '</td><td>' + value.Sales_Stage + '</td><td>' + roomsValue + '</td></tr><tr>...</tr>');
        }
        else if (value.Sales_Stage.toUpperCase() === checkStringdispon.toUpperCase()) {
            $('#dealTable tbody').append('<tr class="pasdedispon" id="disponID"><td style="display:none;"><input type="hidden" id="crmID" value="'+value.Zoho_CRM_ID +'"></td><td>' + accountName + '</td>><td>' + value.Opportunity_Title + '</td><td>' + accountName + '</td><td>'
                + contactName + '</td><td>' + salesRepName + '</td><td>' + arrivalDate + '</td><td>' + departureDate + '</td><td>' + createdDate + '</td><td>' + value.Sales_Stage + '</td><td>' + roomsValue + '</td></tr><tr>...</tr>');
        }
        else if (value.Sales_Stage.toUpperCase() === checkStringprospect.toUpperCase()) {
            $('#dealTable tbody').append('<tr class="prospect" id="prospectID"><td style="display:none;"><input type="hidden" id="crmID" value="'+value.Zoho_CRM_ID +'"></td><td>' + accountName + '</td>><td>' + value.Opportunity_Title + '</td><td>' + accountName + '</td><td>'
                + contactName + '</td><td>' + salesRepName + '</td><td>' + arrivalDate + '</td><td>' + departureDate + '</td><td>' + createdDate + '</td><td>' + value.Sales_Stage + '</td><td>' + roomsValue + '</td></tr><tr>...</tr>');
        }
        else if (value.Sales_Stage.toUpperCase() === checkStringannule.toUpperCase()) {
            $('#dealTable tbody').append('<tr class="annule" id="annuleID"><td style="display:none;"><input type="hidden" id="crmID" value="'+value.Zoho_CRM_ID +'"></td><td>' + accountName + '</td>><td>' + value.Opportunity_Title + '</td><td>' + accountName + '</td><td>'
                + contactName + '</td><td>' + salesRepName + '</td><td>' + arrivalDate + '</td><td>' + departureDate + '</td><td>' + createdDate + '</td><td>' + value.Sales_Stage + '</td><td>' + roomsValue + '</td></tr><tr>...</tr>');
        }
    });
    $("#confirmID").on("click",function(){
        var crmID = $(this).find("#crmID").val();
        redirectToCRM(crmID);
    });
    $("#perduID").on("click",function(){
        var crmID = $(this).find("#crmID").val();
        redirectToCRM(crmID);
    });
    $("#propositionID").on("click",function(){
        var crmID = $(this).find("#crmID").val();
        redirectToCRM(crmID);
    });
    $("#disponID").on("click",function(){
        var crmID = $(this).find("#crmID").val();
        redirectToCRM(crmID);
    });
    $("#prospectID").on("click",function(){
        var crmID = $(this).find("#crmID").val();
        redirectToCRM(crmID);
    });
    $("#annuleID").on("click",function(){
        var crmID = $(this).find("#crmID").val();
        redirectToCRM(crmID);
    });
}
function getModalDataForEscapade(tableData) {
    console.log("tableData:" + tableData);
    $("#dealTable thead tr").remove();
    $("#dealTable tbody tr").remove();
    $("#dealTable").find("tr:gt(0)").remove();
    $("#dealTable").show();
   $('#dealTable thead').append('<tr><th>Account Name</th><th>Opportunity Title</th><th>Opportunity Subtitle</th><th>Contact</th><th>Sales Representative</th><th>Event Date</th><th>Created Date</th><th>Status</th><th>No of Participants</th></tr>');
    $(tableData).each(function (index, value) {
        // console.log(value.time);
        var checkStringperdu = "perdu";
        var checkStringconfirm = "confirmé";
        var checkStringproposition = "proposition";
        var checkStringdispon = "non disponible";
        var checkStringprospect = "prospect";
        var checkStringannule = "annulé";
        var accountName = "";
        var contactName = "";
        var salesRepName = "";
        var eventDate = "";
        var createdDate = "";
        if(value.Event_Date!=""){eventDate = value.Event_Date;}
        if(value.Creation_Date != ""){createdDate = value.Creation_Date;}
        if (value.Accounts_B2B != "") {
            accountName = value.Accounts_B2B.display_value;
        }
        if (value.Contacts_B2B != "") {
            contactName = value.Contacts_B2B.display_value;
        }
        if (value.Users_Representative_1 != "") {
            salesRepName = value.Users_Representative_1.display_value;
        }
        console.log("inside escapdate:"+value.Number_of_participants);
        if (value.Sales_Stage.toUpperCase() === checkStringperdu.toUpperCase()) {
            $('#dealTable tbody').append('<tr class="perdu" id="perduID"><td style="display:none;"><input type="hidden" id="crmID" value="'+value.Zoho_CRM_ID +'"></td><td>' + accountName + '</td><td>' + value.Opportunity_Title + '</td><td>' + accountName + '</td><td>'
                + contactName + '</td><td>' + salesRepName + '</td><td>' + eventDate + '</td><td>' + createdDate + '</td><td>' + value.Sales_Stage + '</td><td>' + value.Number_of_participants + '</td></tr><tr>...</tr>');
        }
        else if (value.Sales_Stage.toUpperCase() === checkStringconfirm.toUpperCase()) {
            $('#dealTable tbody').append('<tr class="confirm" id="confirmID"><td style="display:none;"><input type="hidden" id="crmID" value="'+value.Zoho_CRM_ID +'"></td><td>' + accountName + '</td><td>' + value.Opportunity_Title + '</td><td>' + accountName + '</td><td>'
                + contactName + '</td><td>' + salesRepName + '</td><td>' + eventDate + '</td><td>' + createdDate + '</td><td>' + value.Sales_Stage + '</td><td>' + value.Number_of_participants + '</td></tr><tr>...</tr>');
        }
        else if (value.Sales_Stage.toUpperCase() === checkStringproposition.toUpperCase()) {
            $('#dealTable tbody').append('<tr class="proposition" id="propositionID"><td style="display:none;"><input type="hidden" id="crmID" value="'+value.Zoho_CRM_ID +'"></td><td>' + accountName + '</td><td>' + value.Opportunity_Title + '</td><td>' + accountName + '</td><td>'
                + contactName + '</td><td>' + salesRepName + '</td><td>' + eventDate + '</td><td>' + createdDate + '</td><td>' + value.Sales_Stage + '</td><td>' + value.Number_of_participants + '</td></tr><tr>...</tr>');
        }
        else if (value.Sales_Stage.toUpperCase() === checkStringdispon.toUpperCase()) {
            $('#dealTable tbody').append('<tr class="pasdedispon" id="disponID"><td style="display:none;"><input type="hidden" id="crmID" value="'+value.Zoho_CRM_ID +'"></td>><td>' + accountName + '</td><td>' + value.Opportunity_Title + '</td><td>' + accountName + '</td><td>'
                + contactName + '</td><td>' + salesRepName + '</td><td>' + eventDate + '</td><td>' + createdDate + '</td><td>' + value.Sales_Stage + '</td><td>' + value.Number_of_participants + '</td></tr><tr>...</tr>');
        }
        else if (value.Sales_Stage.toUpperCase() === checkStringprospect.toUpperCase()) {
            $('#dealTable tbody').append('<tr class="prospect" id="prospectID"><td style="display:none;"><input type="hidden" id="crmID" value="'+value.Zoho_CRM_ID +'"></td><td>' + accountName + '</td><td>' + value.Opportunity_Title + '</td><td>' + accountName + '</td><td>'
                + contactName + '</td><td>' + salesRepName + '</td><td>' + eventDate + '</td><td>' + createdDate + '</td><td>' + value.Sales_Stage + '</td><td>' + value.Number_of_participants + '</td></tr><tr>...</tr>');
        }
        else if (value.Sales_Stage.toUpperCase() === checkStringannule.toUpperCase()) {
            $('#dealTable tbody').append('<tr class="annule" id="annuleID"><td style="display:none;"><input type="hidden" id="crmID" value="'+value.Zoho_CRM_ID +'"></td><td>' + accountName + '</td><td>' + value.Opportunity_Title + '</td><td>' + accountName + '</td><td>'
                + contactName + '</td><td>' + salesRepName + '</td><td>' + eventDate + '</td><td>' + createdDate + '</td><td>' + value.Sales_Stage + '</td><td>' + value.Number_of_participants + '</td></tr><tr>...</tr>');
        }
    });
    $("#confirmID").on("click",function(){
        var crmID = $(this).find("#crmID").val();
        redirectToCRM(crmID);
    });
    $("#perduID").on("click",function(){
        var crmID = $(this).find("#crmID").val();
        redirectToCRM(crmID);
    });
    $("#propositionID").on("click",function(){
        var crmID = $(this).find("#crmID").val();
        redirectToCRM(crmID);
    });
    $("#disponID").on("click",function(){
        var crmID = $(this).find("#crmID").val();
        redirectToCRM(crmID);
    });
    $("#prospectID").on("click",function(){
        var crmID = $(this).find("#crmID").val();
        redirectToCRM(crmID);
    });
    $("#annuleID").on("click",function(){
        var crmID = $(this).find("#crmID").val();
        redirectToCRM(crmID);
    });
}
function getModalDataForOMG(tableData) {

    console.log("tableData:" + tableData);
    
    $("#dealTable tbody tr").remove();
    $("#dealTable thead tr").remove();
    $("#dealTable").find("tr:gt(0)").remove();
    $("#dealTable").show();
    $('#dealTable thead').append('<tr><th>Account Name</th><th>Opportunity Title</th><th>Opportunity Subtitle</th><th>Contact</th><th>Sales Representative</th><th>Event Date</th><th>Created Date</th><th>Status</th><th>No of Participants</th></tr>');

    $(tableData).each(function (index, value) {
        // console.log(value.time);
        var checkStringperdu = "perdu";
        var checkStringconfirm = "confirmé";
        var checkStringproposition = "proposition";
        var checkStringdispon = "non disponible";
        var checkStringprospect = "prospect";
        var checkStringannule = "annulé";
        var accountName = "";
        var contactName = "";
        var salesRepName = "";
        if (value.Accounts_B2B != "") {
            accountName = value.Accounts_B2B.display_value;
        }
        if (value.Contacts_B2B != "") {
            contactName = value.Contacts_B2B.display_value;
        }
        if (value.Users_Representative_1 != "") {
            salesRepName = value.Users_Representative_1.display_value;
        }
        if (value.Sales_Stage.toUpperCase() === checkStringperdu.toUpperCase()) {
            $('#dealTable tbody').append('<tr class="perdu" id="perduID"><td style="display:none;"><input type="hidden" id="crmID" value="'+value.Zoho_CRM_ID +'"></td><td>' + accountName + '</td><td>' + value.Opportunity_Title + '</td><td>' + accountName + '</td><td>'
                + contactName + '</td><td>' + salesRepName + '</td><td>' + value.Event_Date + '</td><td>' + value.Creation_Date + '</td><td>' + value.Sales_Stage + '</td><td>' + value.Number_of_participants + '</td></tr><tr>...</tr>');
        }
        else if (value.Sales_Stage.toUpperCase() === checkStringconfirm.toUpperCase()) {
            $('#dealTable tbody').append('<tr class="confirm" id="confirmID"><td style="display:none;"><input type="hidden" id="crmID" value="'+value.Zoho_CRM_ID +'"></td><td>' + accountName + '</td>><td>' + value.Opportunity_Title + '</td><td>' + accountName + '</td><td>'
                + contactName + '</td><td>' + salesRepName + '</td><td>' + value.Event_Date + '</td><td>' + value.Creation_Date + '</td><td>' + value.Sales_Stage + '</td><td>' + value.Number_of_participants + '</td></tr><tr>...</tr>');
        }
        else if (value.Sales_Stage.toUpperCase() === checkStringproposition.toUpperCase()) {
            $('#dealTable tbody').append('<tr class="proposition" id="propositionID"><td style="display:none;"><input type="hidden" id="crmID" value="'+value.Zoho_CRM_ID +'"></td>td>' + accountName + '</td>><td>' + value.Opportunity_Title + '</td><td>' + accountName + '</td><td>'
                + contactName + '</td><td>' + salesRepName + '</td><td>' + value.Event_Date + '</td><td>' + value.Creation_Date + '</td><td>' + value.Sales_Stage + '</td><td>' + value.Number_of_participants + '</td></tr><tr>...</tr>');
        }
        else if (value.Sales_Stage.toUpperCase() === checkStringdispon.toUpperCase()) {
            $('#dealTable tbody').append('<tr class="pasdedispon" id="disponID"><td style="display:none;"><input type="hidden" id="crmID" value="'+value.Zoho_CRM_ID +'"></td><td>' + accountName + '</td>><td>' + value.Opportunity_Title + '</td><td>' + accountName + '</td><td>'
                + contactName + '</td><td>' + salesRepName + '</td><td>' + value.Event_Date + '</td><td>' + value.Creation_Date + '</td><td>' + value.Sales_Stage + '</td><td>' + value.Number_of_participants + '</td></tr><tr>...</tr>');
        }
        else if (value.Sales_Stage.toUpperCase() === checkStringprospect.toUpperCase()) {
            $('#dealTable tbody').append('<tr class="prospect" id="prospectID"><td style="display:none;"><input type="hidden" id="crmID" value="'+value.Zoho_CRM_ID +'"></td><td>' + accountName + '</td>><td>' + value.Opportunity_Title + '</td><td>' + accountName + '</td><td>'
                + contactName + '</td><td>' + salesRepName + '</td><td>' + value.Event_Date + '</td><td>' + value.Creation_Date + '</td><td>' + value.Sales_Stage + '</td><td>' + value.Number_of_participants + '</td></tr><tr>...</tr>');
        }
        else if (value.Sales_Stage.toUpperCase() === checkStringannule.toUpperCase()) {
            $('#dealTable tbody').append('<tr class="annule" id="annuleID"><td style="display:none;"><input type="hidden" id="crmID" value="'+value.Zoho_CRM_ID +'"></td><td>' + accountName + '</td>><td>' + value.Opportunity_Title + '</td><td>' + accountName + '</td><td>'
                + contactName + '</td><td>' + salesRepName + '</td><td>' + value.Event_Date + '</td><td>' + value.Creation_Date + '</td><td>' + value.Sales_Stage + '</td><td>' + value.Number_of_participants + '</td></tr><tr>...</tr>');
        }
    });
    $("#confirmID").on("click",function(){
        var crmID = $(this).find("#crmID").val();
        redirectToCRM(crmID);
    });
    $("#perduID").on("click",function(){
        var crmID = $(this).find("#crmID").val();
        redirectToCRM(crmID);
    });
    $("#propositionID").on("click",function(){
        var crmID = $(this).find("#crmID").val();
        redirectToCRM(crmID);
    });
    $("#disponID").on("click",function(){
        var crmID = $(this).find("#crmID").val();
        redirectToCRM(crmID);
    });
    $("#prospectID").on("click",function(){
        var crmID = $(this).find("#crmID").val();
        redirectToCRM(crmID);
    });
    $("#annuleID").on("click",function(){
        var crmID = $(this).find("#crmID").val();
        redirectToCRM(crmID);
    });
}
//To populate Table data
function getOppportunitiesDetails(categoryValue, selectedDate) {
    console.log(selectedDate);
    var dateForCriteria = formatDateToMatchCreator(selectedDate);
    console.log(dateForCriteria);//12-Apr-2023

    var creatorSdk = ZOHO.CREATOR.init();
    creatorSdk.then(function (data) {
        getOppRevenueDetails("1");
    });
    function getOppRevenueDetails(pageNum) {
        var config = {
            appName: "pal-plus",
            reportName: "Opportunities_Ventes_Report",
            criteria: "(Income_Category == \"" + categoryValue + "\" && (Day_1_Date == \""
                + selectedDate + "\" || Day_2_Date == \"" + selectedDate + "\"|| Day_3_Date == \"" + selectedDate + "\"|| Day_4_Date == \""
                + selectedDate + "\" || Day_5_Date == \"" + selectedDate + "\" || Day_6_Date == \"" + selectedDate + "\" || Day_7_Date == \""
                + selectedDate + "\" || Day_8_Date == \"" + selectedDate + "\" || Day_9_Date == \"" + selectedDate + "\" || Day_10_Date == \"" + selectedDate + "\"))",
            page: pageNum,
            pageSize: 200
        }
        var noOfRoomsValue = 0;
        console.log(config);
        var getRecords = ZOHO.CREATOR.API.getAllRecords(config);
        getRecords.then(function (response) {
            console.log("resp" + JSON.stringify(response));
            if (response.code == 3000) {
                var dataList = JSON.stringify(response.data);
                var recordsLength = Object.keys(response.data).length;
            
                getModalData(response.data, noOfRoomsValue,selectedDate);
                // createEventJsonData(response.data,recordsLength);
            } else {
                console.log("no matching records found");
                $('#dealTable').hide();
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

function getOppportunitiesDetailsForEscapade(categoryValue, selectedDate, serviceValue) {
    var dateForCriteria = formatDateToMatchCreator(selectedDate);
    var creatorSdk = ZOHO.CREATOR.init();
    creatorSdk.then(function (data) {
        getOppRevenueDetails("1");
    });
    async function getOppRevenueDetails(pageNum) {
        var config = {
            appName: "pal-plus",
            reportName: "Opportunities_Ventes_Report",
            criteria: "(Income_Category == \"" + categoryValue + "\" && (Event_Date == \"" + selectedDate + "\") && Booking_Service == \"" + serviceValue + "\")",
            page: pageNum,
            pageSize: 200
        }
        var noOfRoomsValue = 0;
        console.log(config);
        var getRecords = ZOHO.CREATOR.API.getAllRecords(config);
        getRecords.then(function (response) {
            console.log("resp" + JSON.stringify(response));
            if (response.code == 3000) {
                var dataList = JSON.stringify(response.data);
                var recordsLength = Object.keys(response.data).length;
                getModalDataForEscapade(response.data);
                // createEventJsonData(response.data,recordsLength);
            } else {
                console.log("no matching records found");
                $('#dealTable').hide();
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
function getOppportunitiesDetailsForOMG(categoryValue, selectedDate, serviceValue) {
    var dateForCriteria = formatDateToMatchCreator(selectedDate);
    var creatorSdk = ZOHO.CREATOR.init();
    creatorSdk.then(function (data) {
        getOppRevenueDetails("1");
    });
    function getOppRevenueDetails(pageNum) {
        var config = {
            appName: "pal-plus",
            reportName: "Opportunities_Ventes_Report",
            criteria: "(Income_Category == \"" + categoryValue + "\" && (Event_Date == \"" + selectedDate + "\") && Service == \"" + serviceValue + "\")",
            page: pageNum,
            pageSize: 200
        }
        var noOfRoomsValue = 0;
        console.log(config);
        var getRecords = ZOHO.CREATOR.API.getAllRecords(config);
        getRecords.then(function (response) {
            console.log("resp" + JSON.stringify(response));
            if (response.code == 3000) {
                var dataList = JSON.stringify(response.data);
                var recordsLength = Object.keys(response.data).length;
                getModalDataForOMG(response.data, "0");
                // createEventJsonData(response.data,recordsLength);
            } else {
                console.log("no matching records found");
                $('#dealTable').hide();
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

function formatDateToMatchCreator(selectedDate) {
    var monthlist = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var formattedDate = new Date(selectedDate);
    var day = formattedDate.getDate();
    var month = formattedDate.getMonth();
    //month += 1;  // JavaScript months are 0-11
    var year = formattedDate.getFullYear();


    return day + "-" + monthlist[month] + "-" + year;
}
function redirectToCRM(zohoCRMID){
    console.log("getOpp ID");
    var crmURL = "https://crm.zoho.com/crm/org805223710/tab/CustomModule17/"+ zohoCRMID;
    window.open(crmURL,"_blank");
}