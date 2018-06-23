import '../scss/main.scss';

window.addEventListener('load', function () {
    var Picker = function () {

        var wrapper;
        var settings;

        var to; //current right calendar

        var yearTo;
        var monthTo;

        var dayTo; //object holds full day to

        var from; //current left calendar

        var yearFrom;
        var monthFrom;

        var dayFrom; //object holds full day from

        var inputFrom;
        var inputTo;

        var allowedMin;
        var allowedMax;

        function init(obj, options, cb) {

            wrapper = obj;

            settings = options || {};

            allowedMin = settings.allowedMin || new Date(2000,0);
            allowedMax = new Date();
            allowedMax = new Date(allowedMax.getFullYear(),allowedMax.getMonth(),allowedMax.getDate());

            dayTo = settings.end || new Date();
            dayTo = new Date(dayTo.getFullYear(),dayTo.getMonth(),dayTo.getDate());            

            to =  new Date(dayTo.getFullYear(), dayTo.getMonth());

            yearTo = to.getFullYear();
            monthTo = to.getMonth();

            if (settings.start) {
                dayFrom = settings.start;
            }

            else {
                dayFrom = new Date(yearTo, monthTo, dayTo.getDate());
                dayFrom.setDate(dayFrom.getDate() - 30); //start date - 30 days ago
            }

            if(dayFrom < allowedMin) { //only dates since last transaction allowed
                dayFrom = new Date(allowedMin.getFullYear(),allowedMin.getMonth(),allowedMin.getDate());
            }

            from = new Date(dayTo.getFullYear(),dayTo.getMonth()-1);

            yearFrom = from.getFullYear();
            monthFrom = from.getMonth();            

            render();
        }

        function update(e) {
            var el = e.target;
            var input;
            if (el.className.indexOf("from") != -1) {
                input = new Date(yearFrom, monthFrom, parseInt(el.value));
            }
            if (el.className.indexOf("to") != -1) {
                input = new Date(yearTo, monthTo, parseInt(el.value));
            }

            if(dayFrom && dayTo) {
                dayFrom = new Date(input.getFullYear(), input.getMonth(), input.getDate());
                dayTo = null;
                updateInputTo();
                updateInputFrom();
            }
            else if(dayFrom && dayFrom - input < 0) {
                dayTo = new Date(input.getFullYear(), input.getMonth(), input.getDate());
                updateInputTo();
            }

            else if(dayFrom && dayFrom - input > 0) {
                dayTo = new Date(dayFrom.getFullYear(), dayFrom.getMonth(),dayFrom.getDate());
                dayFrom = new Date(input.getFullYear(), input.getMonth(), input.getDate());
                updateInputFrom();
                updateInputTo();
            }
   
            wrapper.getElementsByClassName("calendar__both")[0].innerHTML = updateCalendar(yearFrom, monthFrom, 'from')
                                    + updateCalendar(yearTo, monthTo, 'to');
            addDayListener();
        };


        function render() {
            wrapper.innerHTML = '';
            wrapper.innerHTML = `<div class='calendar__inputs'>From <input type='text' class='from'> To <input type='text' class='to'></div>`;
            wrapper.innerHTML += `<span class='calendar__prev'>Prev</span><span class='calendar__next'>Next</span>`;
            wrapper.innerHTML += `<div class='calendar__both'>${updateCalendar(yearFrom, monthFrom, 'from')} ${updateCalendar(yearTo, monthTo, 'to')}</div>`;

            inputFrom = wrapper.getElementsByTagName('input')[0];
            inputTo = wrapper.getElementsByTagName('input')[1];

            inputFrom.focus();  //place cursor on load in from input

            addDayListener();
            addNextPrevListener();
            updateInputFrom();
            updateInputTo();
            addInputListener();
        }

        function updateInputFrom() {
            inputFrom.value = dayFrom.getFullYear() + "-" + ("0" + (dayFrom.getMonth() + 1)).slice(-2)
                + "-" + ("0" + dayFrom.getDate()).slice(-2);
        }

        function updateInputTo() {
            if(dayTo) {
                inputTo.value = dayTo.getFullYear() + "-" + ("0" + (dayTo.getMonth() + 1)).slice(-2)
                + "-" + ("0" + dayTo.getDate()).slice(-2);
            }
            else {
                inputTo.value = '';
            }
            
        }

        function highlight(e) {

            // if(e.target.className.indexOf("from") != -1) {
            //     var day = new Date(yearFrom, monthFrom, parseInt(e.target.value));
            // }

            // var hoverDays = wrapper.getElementsByClassName('hoverable');

        }

        function addInputListener() {
            inputFrom.addEventListener('input', handleInput);
            inputTo.addEventListener('input', handleInput);

            function handleInput(e) {
                if (e.target.value.length == 10) {
                    var arr = e.target.value.split("-");    // handle input, errors properly
                    var year = parseInt(arr[0]);
                    var month = parseInt(arr[1]);
                    var day = parseInt(arr[2]);

                    if (year >= allowedMin.getFullYear() && year <= allowedMax.getFullYear() + 1) {
                        if (month >= 0 && month < 12) {
                            if (day > 0 && day < 32) {

                                if (e.target == inputFrom) {
                                    if(allowedMin > new Date(year, month - 1, day)) {
                                        updateInputFrom();
                                        return;
                                    }

                                    dayFrom = new Date(year, month - 1, day); 

                                    from = new Date(year, month - 1);
                                    yearFrom = from.getFullYear();
                                    monthFrom = from.getMonth();

                                    

                                    to = new Date(yearFrom, monthFrom + 1);
                                    yearTo = to.getFullYear();
                                    monthTo = to.getMonth();

                                    wrapper.getElementsByClassName("calendar__both")[0].innerHTML = updateCalendar(yearFrom, monthFrom, 'from')
                                        + updateCalendar(yearTo, monthTo, 'to');
                                        addDayListener();

                                        inputTo.focus(); //after entering start data focuse on end input
                                }

                                else if (e.target == inputTo) {
                                    if(allowedMax < new Date(year, month - 1, day)) {
                                        updateInputTo();
                                        return;
                                    }
                                    to = new Date(year, month - 1, day);
                                    yearTo = to.getFullYear();
                                    monthTo = to.getMonth();
                                    dayTo = new Date(yearTo, monthTo, to.getDate());

                                    from = new Date(yearTo, monthTo - 1, 1);
                                    yearFrom = from.getFullYear();
                                    monthFrom = from.getMonth();

                                    wrapper.getElementsByClassName("calendar__both")[0].innerHTML = updateCalendar(yearFrom, monthFrom, 'from')
                                        + updateCalendar(yearTo, monthTo, 'to');
                                    addDayListener();
                                }

                            }
                        }
                    }

                }
            }
        }

        function addDayListener() {

                var calDays = wrapper.getElementsByClassName("available");

                for (var n = 0; n < calDays.length; n++) {
                    calDays[n].addEventListener('click', update);

                    if(calDays[n].className.indexOf('hoverable') != -1)
                        calDays[n].addEventListener('hover', highlight);
                }

        }

        function addNextPrevListener() {
            wrapper.getElementsByClassName("calendar__prev")[0].addEventListener('click', function () {
                to = new Date(yearTo, monthTo-1, 0);
                yearTo = to.getFullYear();
                monthTo = to.getMonth();

                from = new Date(yearFrom, monthFrom-1, 0);
                yearFrom = from.getFullYear();
                monthFrom = from.getMonth();
                wrapper.getElementsByClassName("calendar__both")[0].innerHTML = updateCalendar(yearFrom, monthFrom, 'from')
                    + updateCalendar(yearTo, monthTo, 'to');
                addDayListener();
            });
            wrapper.getElementsByClassName("calendar__next")[0].addEventListener('click', function () {
                from = new Date(yearFrom, monthFrom+ 1);
                yearFrom = from.getFullYear();;
                monthFrom = from.getMonth();

                to = new Date(yearTo, monthTo + 1);
                yearTo = to.getFullYear();
                monthTo = to.getMonth();

                wrapper.getElementsByClassName("calendar__both")[0].innerHTML = updateCalendar(yearFrom, monthFrom, 'from')
                    + updateCalendar(yearTo, monthTo, 'to');
                addDayListener();
            });
        }


        function updateCalendar(year, month, toOrFrom) {

            var calendar = `<div class='calendar__${toOrFrom}'> 
                                    <div class='calendar__header'>
                                        <div class='year'>${year}</div>
                                        <div class='month'>${month}</div>
                                    </div>
                                    <div class='calendar__grid'>`;

            var firstDay = new Date(year, month, 1);
            var lastDay = new Date(year, month + 1, 0);

            var offset = firstDay.getDay();
            var days = lastDay.getDate();

            offset = offset == 0 ? 7 : offset; // 0 is Sunday

            for (var i = 1; i <= days; i++) {
                var selection = '';

                var currentDay = new Date(year, month, i);
                console.log(currentDay);
                console.log(dayFrom);

                if (currentDay < allowedMin || currentDay > allowedMax) {
                    selection = 'disabled';
                }

                else if (currentDay - dayFrom == 0) {
                    selection = 'selected start available';
                }

                else if (dayTo && (currentDay - dayTo == 0)) {
                    selection = 'selected end available';
                }

                else if (dayTo && (currentDay - dayFrom > 0 && dayTo - currentDay > 0)) {
                    selection = 'inrange available';
                }

                else if(!dayTo && currentDay > dayFrom) {
                    selection = 'hoverable available'
                }

                else {
                    selection = 'available';
                }

                if (i == 1) {
                    calendar += `<button class='day ${toOrFrom} ${selection}' style='grid-column-start:${offset};' value='${i}'>${i}</button>`;
                }
                else {
                    calendar += `<button class='day ${toOrFrom} ${selection}' value='${i}'>${i}</button>`;
                }

            }

            calendar += `</div>
                          </div>`;

            return calendar;
        }

        return {
            init: init
        }

    };

    var calend = new Picker();

    var allowedMin = new Date(2018,5,10);

    calend.init(document.getElementById("calendar"),{allowedMin: allowedMin});

});

