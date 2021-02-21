"use strict";
/**
 *  Основные скрипты
 */

const Schedule = function () {

    let schedule = null,
        selectedBus = null;
    const busList = document.getElementById('bus_list'),
        schedule_header = document.getElementById('schedule_header');

    const init = function () {
        loadData();
    };

    const loadData = function () {
        fetch('/schedule', {method: 'GET'})
            .then(resp => resp.ok ? Promise.resolve(resp) : Promise.reject(resp.status+' '+resp.statusText))
            .then(response => response.json())
            .then(json => !json.error ? Promise.resolve(json) : Promise.reject(json.reason))
            .then(json => {
                schedule = json;
                drawBusList();
            })
            .catch(error => console.error(error));
    };

    const drawBusList = function () {
        const buses = schedule['schedules'];
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
        schedule_header.textContent = 'Маршрут ' + selectedBus;
    };

    init();
};

new Schedule();
