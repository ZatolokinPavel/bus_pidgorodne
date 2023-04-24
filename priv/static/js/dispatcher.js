"use strict";
/**
 *  Скрипты страницы диспетчера
 */

const Dispatcher = function () {
    let scheduleData = null;
    let isWeekendToday = null;
    let isWeekendTomorrow = null;
    const busListToday = document.getElementById('bus_list_today');
    const busListTomorrow = document.getElementById('bus_list_tomorrow');

    const init = function () {
        loadData();
    };

    const loadData = function () {
        fetch('/dispatcher/schedule', {method: 'GET'})
            .then(resp => resp.ok ? Promise.resolve(resp) : Promise.reject(resp.status+' '+resp.statusText))
            .then(response => response.json())
            .then(json => !json.error ? Promise.resolve(json) : Promise.reject(json.reason))
            .then(json => {
                scheduleData = json;
                isWeekendToday = json['isWeekendToday'];
                drawDispatcherTable(true);
                drawDispatcherTable(false);
            })
            .catch(error => console.error(error));
    };

    const drawDispatcherTable = function (isToday) {
        const buses = scheduleData['schedules'];
        buses.forEach(bus => {
            const busItem = document.createElement('div');
            const route = document.createElement('div');
            const title = document.createElement('div');
            const cars = drawCars(scheduleData['cars'][bus['route']], isToday);
            busItem.className = 'bus-item'
            route.className = 'route';
            title.className = 'cars-title';
            route.append(bus['route']);
            title.append('графики')
            busItem.append(route, title, cars);
            isToday ? busListToday.append(busItem) : busListTomorrow.append(busItem);
        });
    };

    const drawCars = function (cars, isToday) {
        const isWeekend = isToday ? isWeekendToday : isWeekendTomorrow;
        const carsForDay = isWeekend && cars['weekend'] ? cars['weekend'] : cars['weekday'];
        if (!carsForDay) return '';
        const div = document.createElement('div');
        carsForDay.forEach(car => {
            const button = document.createElement('div');
            button.className = 'car-button';
            button.append(car);
            div.append(button);
        })
        return div;
    };

    init();
};

const dispatcher = new Dispatcher();
