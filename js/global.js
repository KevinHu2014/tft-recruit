/*
 *  Get TimeRemaining
 */
const getTimeRemaining = (endtime) => {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  var days = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}

const initializeClock = (id, endtime) => {
  var clock = document.getElementById(id);
  var daysSpan = clock.querySelector('.days');
  var hoursSpan = clock.querySelector('.hours');
  var minutesSpan = clock.querySelector('.minutes');
  var secondsSpan = clock.querySelector('.seconds');
  var schedule = [
    ['Jul 25 2015', 'Sept 20 2015'],
    ['Sept 21 2015', 'Jul 25 2016'],
    ['Jul 25 2016', 'Jul 25 2030']
  ];

  const updateClock = () => {
    var t = getTimeRemaining(endtime);

    daysSpan.innerHTML = t.days;
    hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
    // secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

    if (t.total <= 0) {
      clearInterval(timeinterval);
    }
  }

  updateClock();
  var timeinterval = setInterval(updateClock, 1000);
}

// -------------------------------

// ----- Main CODE -------

document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.menu_button');
  const menuList = document.querySelector('.m-nav--mobile');
  const mask = document.querySelector('.overlay');

  menuBtn.addEventListener('click', (e) => {
    menuBtn.classList.toggle('is-active');
    menuList.classList.toggle('is-active');
    mask.classList.toggle('is-active');
  });

});