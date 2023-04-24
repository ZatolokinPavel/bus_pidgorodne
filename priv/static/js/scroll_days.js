"use strict";

const ScrollDays = function () {

    let xPoint = null;
    const daysContainer = document.getElementsByClassName('days-container')[0];

    const init = function () {
        daysContainer.addEventListener('touchstart', handleTouchStart, false);
        daysContainer.addEventListener('touchend', handleTouchEnd, false);
    };

    const handleTouchStart = function (event) {
        xPoint = event.touches[0].clientX;
    };

    const handleTouchEnd = function (event) {
        if (!xPoint) return;
        const xDiff = xPoint - event.changedTouches[0].pageX;
        if (xDiff >  50) daysContainer.classList.toggle('tomorrow', true);
        if (xDiff < -50) daysContainer.classList.toggle('tomorrow', false);
    };

    if (daysContainer) init();
};

new ScrollDays();
