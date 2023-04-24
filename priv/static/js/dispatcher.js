"use strict";
/**
 *  Скрипты страницы диспетчера
 */

const Dispatcher = function () {
    const self = this;
    let scheduleData = null;
    let isWeekendToday = null;
    let isWeekendTomorrow = null;
    let selectedTomorrow = false;
    const busList = document.getElementById('bus_list');
    const selectorToday = document.getElementById('selector_today');
    const selectorTomorrow = document.getElementById('selector_tomorrow');

    const init = function () {
        loadData();
        self.selectTomorrow(selectedTomorrow);
    };

    const loadData = function () {
        fetch('/dispatcher/schedule', {method: 'GET'})
            .then(resp => resp.ok ? Promise.resolve(resp) : Promise.reject(resp.status+' '+resp.statusText))
            .then(response => response.json())
            .then(json => !json.error ? Promise.resolve(json) : Promise.reject(json.reason))
            .then(json => {
                scheduleData = json;
                isWeekendToday = json['isWeekendToday'];
                setDayTypes();
                drawDispatcherTable();
            })
            .catch(error => console.error(error));
    };

    const setDayTypes = function () {
        document.getElementById('today_type').append(isWeekendToday ? 'выходной' : 'будний');
        document.getElementById('tomorrow_type').append(isWeekendTomorrow ? 'выходной' : 'будний');
    }

    const drawDispatcherTable = function () {
        const buses = scheduleData['schedules'];
        buses.forEach(bus => {
            const busItem = document.createElement('div');
            const route = document.createElement('div');
            const title = document.createElement('div');
            const cars = drawCars(scheduleData['cars'][bus['route']]);
            busItem.className = 'bus-item'
            route.className = 'route';
            title.className = 'cars-title';
            route.append(bus['route']);
            title.append('графики')
            busItem.append(route, title, cars);
            busList.append(busItem);
        });
    };

    const drawCars = function (cars) {
        const carsForDay = isWeekendToday && cars['weekend'] ? cars['weekend'] : cars['weekday'];
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

    this.selectTomorrow = function (isTomorrow) {
        selectedTomorrow = !!isTomorrow;
        selectorToday.classList.toggle('selected', !selectedTomorrow);
        selectorTomorrow.classList.toggle('selected', selectedTomorrow);
    }

    init();
};

const dispatcher = new Dispatcher();
