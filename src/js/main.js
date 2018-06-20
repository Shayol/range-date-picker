import '../scss/main.scss';

(function () {

    function rangepicker(pickerWrapper, options) {

        var wrapper = document.getElementById(pickerWrapper);

        var inputFrom = wrapper.getElementsByTagName[0];
        var inputTo = wrapper.getElementsByTagName[1];

        var to = new Date();
        var from = (to.getMonth() - 1);

        var yearTo = to.getFullYear();
        var monthTo = to.getMonth();
        var dayTo = to.getDate();

        var yearFrom = from.getFullYear();
        var monthFrom = from.getMonth();
        var dayFrom = from.getDate();

        function updateInput(el) {
            
            if (el.className.Indexof("from") != -1) {
                dayFrom = ParseInt(el.value);
                inputFrom.value = yearFrom + "-" + ("0" + (monthFrom + 1)).slice(-2) + "-" + ("0" + dayFrom).slice(-2); 
                
                return;
            } 

            dayTo = ParseInt(el.value);
            inputTo.value = yearFrom + "-" + ("0" + (monthTo + 1)).slice(-2) + "-" + ("0" + dayTo).slice(-2);
            
            
        }

        function renderCalendar(year,month,day,toOrFrom) {

            var calendar = `<div class='calendar__${toOrFrom}' 
                                <div clas='calendar__header'>
                                    <div class='year'>${year}</div>
                                    <div class='month'>${month}</div>
                                </div>
                                <div class='calendar__grid'>`;

            var firstDay = new Date(year,month, 1);
            var lastDay = new Date(year, month+1, 0);
            
            var offset = firstDay.getDay();
            var days = lastDay.getDate();

            offset = offset == 0 ? 7 : offset; // 0 is Sunday

            for(var i=1;i<days;i++) {
                var selection;

                if (i == day) {
                    selection = 'selected';
                }

                else if ( i < day) {
                    selection = 'less';
                }

                else {
                    selection = 'more';
                }

                if(i==1) {
                    calendar+= `<button class='${toOrFrom} ${selection}' style='grid-col-start:${offset};' value='${i}'> onclick='updateInput(this)'>`;
                }
                else {
                    calendar += `<button class='${toOrFrom} ${selection}' value='${i}'> onclick='updateInput(this)'>`;
                }
                
            }

            calendar+=`</div>
                      </div>`;

            return calendar;            
        }

        var temp = `<div class='modal' tabindex='-1' role='dialog'>
                        <div class='modal-dialog' role='document'>
                            <div class='modal-content'>
                                <div class='modal-header'>
                                From <input type='text' class='from'>
                                To <input type='text' class='to'>
                                <button type='button' class='close' data-dismiss='modal' aria-label='Close'>
                                    <span aria-hidden='true'>&times;</span>
                                </button>
                                </div>
                                <div class='modal-body'>
                                    <div class='calendar'>
                                        
                                        
                                    </div>
                                </div>
                                <div class='modal-footer'>
                                <button type='button' class='btn btn-primary'>Save changes</button>
                                </div>
                            </div>
                        </div>
                    </div>`;

    }

})();