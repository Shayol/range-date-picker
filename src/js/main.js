import '../scss/main.scss';

window.addEventListener('load', function () {
    function Picker(obj, options) {

        var self = this;

        var wrapper = obj;

        var to = new Date();


        var yearTo = to.getFullYear();
        var monthTo = to.getMonth();
        var dayTo = to.getDate();

        var from = new Date(yearTo, monthTo, 0);

        var yearFrom = from.getFullYear();
        var monthFrom = from.getMonth();
        var dayFrom = from.getDate();

        function update(e) {
            var el = e.target;
            if (el.className.indexOf("from") != -1) {
                dayFrom = parseInt(el.value);
                updateInputFrom(el);
            }
            else if (el.className.indexOf("to") != -1) {
                dayTo = parseInt(el.value);
                updateInputTo(el);
            }
        };

        init();

        function init() {
            wrapper.innerHTML = '';
            wrapper.innerHTML = `<div class='calendar__inputs'>From <input type='text' class='from'> To <input type='text' class='to'></div>`;
            wrapper.innerHTML += `<span class='calendar__prev'>Prev</span><span class='calendar__next'>Next</span>`;
            wrapper.innerHTML += `<div class='calendar__both'>${updateCalendar(yearFrom, monthFrom, dayFrom, 'from')} ${updateCalendar(yearTo, monthTo, dayTo, 'to')}</div>`;
            addDayListener("calendar__from");
            addDayListener("calendar__to");
            addNextPrevListener();
        }

        var inputFrom = wrapper.getElementsByTagName('input')[0];
        var inputTo = wrapper.getElementsByTagName('input')[1];

        function updateInputFrom(el) {
            inputFrom.value = yearFrom + "-" + ("0" + (monthFrom + 1)).slice(-2)
                + "-" + ("0" + dayFrom).slice(-2);
        }

        function updateInputTo(el) {
            inputTo.value = yearFrom + "-" + ("0" + (monthTo + 1)).slice(-2)
                + "-" + ("0" + dayTo).slice(-2);
        }

        function addDayListener(calendar1, calendar2) {

            var calDays = document.getElementsByClassName(calendar1)[0].getElementsByClassName("day");

            for (var n = 0; n < calDays.length; n++) {
                calDays[n].addEventListener('click', update);
            }

            if (calendar2) {
                var calDays = document.getElementsByClassName(calendar2)[0].getElementsByClassName("day");

                for (var n = 0; n < calDays.length; n++) {
                    calDays[n].addEventListener('click', update);
                }
            }

        }

        function addNextPrevListener() {
            wrapper.getElementsByClassName("calendar__prev")[0].addEventListener('click', function () {
                to = from;
                yearTo = yearFrom;
                monthTo = monthFrom;

                from = new Date(yearFrom, monthFrom, 0);
                yearFrom = from.getFullYear();
                monthFrom = from.getMonth();
                wrapper.getElementsByClassName("calendar__both")[0].innerHTML = updateCalendar(yearFrom, monthFrom, dayFrom, 'from') 
                                                                                + updateCalendar(yearTo, monthTo, dayTo, 'to'); 
                addDayListener("calendar__from");
                addDayListener("calendar__to");
            });
            wrapper.getElementsByClassName("calendar__next")[0].addEventListener('click', function () {
                from = to;
                yearFrom = yearTo;
                monthFrom = monthTo;

                to = new Date(yearTo, monthFrom + 1, 1);
                yearTo = to.getFullYear();
                monthTo = to.getMonth();

                wrapper.getElementsByClassName("calendar__both")[0].innerHTML = updateCalendar(yearFrom, monthFrom, dayFrom, 'from') 
                                                                                + updateCalendar(yearTo, monthTo, dayTo, 'to');
                addDayListener("calendar__from");
                addDayListener("calendar__to");
            });
        }


        function updateCalendar(year, month, day, toOrFrom) {

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
                var selection;

                if (i == day) {
                    selection = 'selected';
                }

                else if (i < day) {
                    selection = 'less';
                }

                else {
                    selection = 'more';
                }

                if (i == 1) {
                    calendar += `<input type="button" class='day ${toOrFrom} ${selection}' style='grid-col-start:${offset};' value='${i}'>`;
                }
                else {
                    calendar += `<input type="button" class='day ${toOrFrom} ${selection}' value='${i}'>`;
                }

            }

            calendar += `</div>
                          </div>`;

            return calendar;
        }

    }

    var rangepicker = new Picker(document.getElementById("calendar"));
});

