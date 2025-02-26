"use strict";
/**
 *  Основные скрипты
 */

const Schedule = function () {

    let _scheduleData = null;
    let _selectedRoute = null;
    let _isWeekend = null;
    let _isTodaySelected = true;
    const busList = document.getElementById('bus_list');
    const disclaimer = document.getElementById('disclaimer');
    const schedule_header = document.getElementById('schedule_header');
    const day_selector = document.getElementById('day_selector');

    const init = function () {
        loadData();
    };

    const loadData = function () {
        fetch('/passenger/schedule', {method: 'GET'})
            .then(resp => resp.ok ? Promise.resolve(resp) : Promise.reject(resp.status+' '+resp.statusText))
            .then(response => response.json())
            .then(json => !json.error ? Promise.resolve(json) : Promise.reject(json.reason))
            .then(json => {
                _scheduleData = json;
                _isWeekend = json['isWeekendToday'];
                drawDaySelector(json['isWeekendToday'], json['isWeekendTomorrow']);
                drawBusList();
            })
            .catch(error => console.error(error));
    };

    const drawDaySelector = function (isWeekendToday, isWeekendTomorrow) {
        const day_today = document.getElementById('day_today');
        const day_tomorrow = document.getElementById('day_tomorrow');
        day_today.dataset.type = isWeekendToday ? 'weekend' : 'weekday';
        day_tomorrow.dataset.type = isWeekendTomorrow ? 'weekend' : 'weekday';
        day_today.getElementsByClassName('day-type')[0].textContent = isWeekendToday ? 'вихідний' : 'будній';
        day_tomorrow.getElementsByClassName('day-type')[0].textContent = isWeekendTomorrow ? 'вихідний' : 'будній';
        document.getElementById('day_weekday').classList.toggle('hide', !isWeekendToday || !isWeekendTomorrow);
        document.getElementById('day_weekend').classList.toggle('hide', isWeekendToday || isWeekendTomorrow);
    };

    const drawBusList = function () {
        const buses = _scheduleData['schedules'];
        for (let i=0; i < buses.length; i++) {
            const bus = document.createElement('div');
            const route = document.createElement('div');
            const stations = document.createElement('div');
            const from = document.createElement('div');
            const via = document.createElement('div');
            const to = document.createElement('div');
            bus.id = buses[i]['route'];
            bus.onclick = () => selectBus(buses[i]['route']);
            route.className = 'bus-route';
            stations.className = 'bus-stations';
            from.className = 'bus-from';
            via.className = 'bus-via';
            to.className = 'bus-to';
            bus.className = 'bus';
            route.append(buses[i]['route']);
            from.append(buses[i]['from']);
            via.append(buses[i]['via']);
            to.append(buses[i]['to']);
            stations.append(from, via, to);
            bus.append(route, stations);
            busList.append(bus);
        }
    };

    const selectBus = function (route) {
        document.getElementById(_selectedRoute)?.classList.remove('selected');
        document.getElementById(route).classList.add('selected');
        _selectedRoute = route;
        disclaimer.style.display = 'none';
        schedule_header.textContent = `Маршрут ${_selectedRoute}`;
        day_selector.style.display = '';
        drawTimetables();
    };

    const drawTimetables = function () {
        const schedule = _scheduleData['schedules'].find(item => item['route'] === _selectedRoute);
        drawOneTimetable(schedule, 1);
        drawOneTimetable(schedule, 2);
        if (_isTodaySelected) {
            highlightNearest(schedule, 1);
            highlightNearest(schedule, 2);
        }
    };

    const drawOneTimetable = function (schedule, card) {
        const route = schedule['directions'][card-1];
        document.getElementById(`timetable_card${card}`).style.display = !!route ? 'block' : 'none';
        if (!route) return;
        document.getElementById(`timetable_header${card}`).textContent = route['from'];
        const table = document.getElementById(`timetable${card}`);
        while (table.tHead.rows[0].cells.length > 1) table.tHead.rows[0].removeChild(table.tHead.rows[0].lastChild); // очищаем заголовок таблицы
        while (table.tBodies[0].firstChild) table.tBodies[0].removeChild(table.tBodies[0].firstChild);  // очищаем таблицу
        const timetable = _isWeekend && route['weekend']?.length ? route['weekend'] : route['weekday'];
        const numbers = timetable
            .map(item => item.number)
            .filter((value, index, self) => self.indexOf(value) === index)
            .sort((a,b) => a - b);
        let tr, td;
        numbers.forEach(number => {
            tr = table.tBodies[0].insertRow();
            tr.dataset.number = number;
            td = tr.insertCell();
            td.classList.add('timetable-number');
            td.append(number);
        });
        for (let i=0; i < timetable.length; i++) {
            const number = timetable[i]['number'];
            const flight = timetable[i]['flight'];
            if (!table.tHead.rows[0].cells[flight]) {
                const th = document.createElement('th')
                th.append(flight);
                table.tHead.rows[0].append(th);
            }
            tr = table.tBodies[0].rows[number-1];
            while (tr.cells.length < parseInt(flight)) tr.insertCell();
            td = tr.insertCell();
            td.append(timetable[i].time);
        }
    };

    const highlightNearest = function (schedule, card) {
        const route = schedule['directions'][card-1];
        if (!route) return;
        const table = document.getElementById(`timetable${card}`);
        const timetable = _isWeekend && route['weekend']?.length ? route['weekend'] : route['weekday'];
        const now = new Date();
        const bus = new Date();
        let number, flight;
        for (let i=0; i < timetable.length; i++) {
            const timeArr = timetable[i].time.split(':');
            bus.setHours(parseInt(timeArr[0]), parseInt(timeArr[1])+2, 0, 0);
            if (bus > now) {
                number = timetable[i]['number'];
                flight = timetable[i]['flight'];
                break;
            }
        }
        if (number && flight) {
            table.tBodies[0].rows[number - 1].cells[flight].classList.add('nearest');
        }
    };

    this.switchDay = function (day) {
        if (day.classList.contains('selected')) return;
        const buttons = day.parentElement.children;
        for (let i=0; i < buttons.length; i++) {
            buttons[i].classList.toggle('selected', buttons[i] === day);
        }
        _isWeekend = day.dataset.type === 'weekend';
        _isTodaySelected = !day.previousElementSibling;
        drawTimetables();
    };

    init();
};

const passengerSchedule = new Schedule();
