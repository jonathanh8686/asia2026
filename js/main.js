(function () {
  // Departure: Nov 19, 2026, local time.
  var target = new Date(2026, 10, 19, 0, 0, 0);

  var els = {
    days: document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    mins: document.getElementById('cd-mins'),
    secs: document.getElementById('cd-secs')
  };

  if (!els.days) return;

  function tick() {
    var now = new Date();
    var diff = target - now;

    if (diff <= 0) {
      els.days.textContent = '0';
      els.hours.textContent = '0';
      els.mins.textContent = '0';
      els.secs.textContent = '0';
      return;
    }

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    var mins = Math.floor((diff / (1000 * 60)) % 60);
    var secs = Math.floor((diff / 1000) % 60);

    els.days.textContent = days;
    els.hours.textContent = hours;
    els.mins.textContent = mins;
    els.secs.textContent = secs;
  }

  tick();
  setInterval(tick, 1000);
})();
