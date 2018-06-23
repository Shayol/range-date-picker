import '../scss/main.scss';

window.addEventListener('load', function () {
    var Picker = function () {

        var wrapper;

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

        function init(obj, options) {

            wrapper = obj;

            to = new Date();

            yearTo = to.getFullYear();
            monthTo = to.getMonth();

            dayTo = new Date(to.getFullYear(), to.getMonth(), to.getDate());

            from = new Date(yearTo, monthTo, 0);

            yearFrom = from.getFullYear();
            monthFrom = from.getMonth();

            dayFrom = new Date(yearFrom, monthFrom, dayTo.getDate());

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

            if(dayFrom - input < 0) {
                dayTo = new Date(input.getFullYear(), input.getMonth(), input.getDate());
                
                updateInputTo();
            }
            else if(dayFrom - input > 0) {
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
            inputTo.value = dayTo.getFullYear() + "-" + ("0" + (dayTo.getMonth() + 1)).slice(-2)
                + "-" + ("0" + dayTo.getDate()).slice(-2);
        }

        function addInputListener() {
            inputFrom.addEventListener('input', handleInput);
            inputTo.addEventListener('input', handleInput);

            function handleInput(e) {
                if (e.target.value.length == 10) {
                    var arr = e.target.value.split("-");
                    var year = parseInt(arr[0]);
                    var month = parseInt(arr[1]);
                    var day = parseInt(arr[2]);

                    if (year > 2000 && year < new Date().getFullYear() + 1) {
                        if (month >= 0 && month < 12) {
                            if (day > 0 && day < 32) {

                                if (e.target == inputFrom) {
                                    from = new Date(year, month - 1, day);
                                    yearFrom = from.getFullYear();
                                    monthFrom = from.getMonth();

                                    dayFrom = new Date(yearFrom, monthFrom, from.getDate());

                                    to = new Date(yearFrom, monthFrom + 1, 1);
                                    yearTo = to.getFullYear();
                                    monthTo = to.getMonth();

                                    wrapper.getElementsByClassName("calendar__both")[0].innerHTML = updateCalendar(yearFrom, monthFrom, 'from')
                                        + updateCalendar(yearTo, monthTo, 'to');
                                        addDayListener();
                                }

                                else if (e.target == inputTo) {
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

                var calDays = document.getElementsByClassName("calendar__from")[0].getElementsByClassName("day");

                for (var n = 0; n < calDays.length; n++) {
                    calDays[n].addEventListener('click', update);
                }

                var calDays = document.getElementsByClassName("calendar__to")[0].getElementsByClassName("day");

                for (var n = 0; n < calDays.length; n++) {
                    calDays[n].addEventListener('click', update);
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

                if (currentDay - dayFrom == 0) {
                    selection = 'selected dayfrom';
                }

                else if (currentDay - dayTo == 0) {
                    selection = 'selected dayto';
                }

                else if (currentDay - dayFrom > 0 && dayTo - currentDay > 0) {
                    selection = 'inrange';
                }

                if (i == 1) {
                    calendar += `<button class='day ${toOrFrom} ${selection}' style='grid-col-start:${offset};' value='${i}'>${i}</button>`;
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

    calend.init(document.getElementById("calendar"));

});

