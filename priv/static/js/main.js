"use strict";
/**
 *  Основные скрипты
 */

const Schedule = function () {

    let scheduleData = null,
        selectedBus = null,
        isWeekend = null;
    const busList = document.getElementById('bus_list'),
        schedule_header = document.getElementById('schedule_header'),
        disclaimer = document.getElementById('disclaimer');

    const init = function () {
        loadData();
    };

    const loadData = function () {
        fetch('/passenger/schedule', {method: 'GET'})
            .then(resp => resp.ok ? Promise.resolve(resp) : Promise.reject(resp.status+' '+resp.statusText))
            .then(response => response.json())
            .then(json => !json.error ? Promise.resolve(json) : Promise.reject(json.reason))
            .then(json => {
                scheduleData = json;
                isWeekend = json['isWeekend'];
                drawBusList();
            })
            .catch(error => console.error(error));
    };

    const drawBusList = function () {
        const buses = scheduleData['schedules'];
        for (let i=0; i < buses.length; i++) {
            const bus = document.createElement('div');
            const number = document.createElement('div');
            const stations = document.createElement('div');
            const from = document.createElement('div');
            const via = document.createElement('div');
            const to = document.createElement('div');
            bus.id = buses[i]['bus'];
            bus.onclick = () => selectBus(buses[i]['bus']);
            number.className = 'bus-number';
            stations.className = 'bus-stations';
            from.className = 'bus-from';
            via.className = 'bus-via';
            to.className = 'bus-to';
            bus.className = 'bus';
            number.append(buses[i]['bus']);
            from.append(buses[i]['from']);
            via.append(buses[i]['via']);
            to.append(buses[i]['to']);
            stations.append(from, via, to);
            bus.append(number, stations);
            busList.append(bus);
        }
    };

    const selectBus = function (bus) {
        document.getElementById(selectedBus)?.classList.remove('selected');
        document.getElementById(bus).classList.add('selected');
        selectedBus = bus;
        const dayType = isWeekend ? 'выходной' : 'будний';
        schedule_header.textContent = `Маршрут ${selectedBus} (${dayType} день)`;
        disclaimer.style.display = 'none';
        const schedule = scheduleData['schedules'].find(item => item['bus'] === bus);
        drawTimetable(schedule, 1);
        drawTimetable(schedule, 2);
        highlightNearest(schedule, 1);
        highlightNearest(schedule, 2);
    };

    const drawTimetable = function (schedule, card) {
        const route = schedule['routes'][card-1];
        document.getElementById(`timetable_card${card}`).style.display = !!route ? 'block' : 'none';
        if (!route) return;
        document.getElementById(`timetable_header${card}`).textContent = route['from'];
        const table = document.getElementById(`timetable${card}`);
        while (table.tBodies[0].firstChild) table.tBodies[0].removeChild(table.tBodies[0].firstChild);  // очищаем таблицу
        const timetable = isWeekend && route['weekend']?.length ? route['weekend'] : route['weekday'];
        let tr, td;
        for (let i=0; i < timetable.length; i++) {
            const number = timetable[i]['number'];
            const flight = timetable[i]['flight'];
            if (!table.tHead.rows[0].cells[flight]) {
                const th = document.createElement('th')
                th.append(flight);
                table.tHead.rows[0].append(th);
            }
            tr = table.tBodies[0].rows[number-1] || table.tBodies[0].insertRow();
            if (!tr.cells.length) {
                tr.dataset.number = number;
                td = tr.insertCell();
                td.classList.add('timetable-number');
                td.append(number);
            }
            td = tr.insertCell();
            td.append(timetable[i].time);
        }
    };

    const highlightNearest = function (schedule, card) {
        const route = schedule['routes'][card-1];
        if (!route) return;
        const table = document.getElementById(`timetable${card}`);
        const timetable = isWeekend && route['weekend']?.length ? route['weekend'] : route['weekday'];
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

    init();
};

new Schedule();
