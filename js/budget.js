(function () {
  var PEOPLE = ['Olivia', 'Peter', 'Andrew', 'Joyce', 'Jonathan'];
  var STORAGE_KEY = 'vietnam2026-budget-expenses';

  var form = document.getElementById('expense-form');
  var descInput = document.getElementById('exp-desc');
  var amountInput = document.getElementById('exp-amount');
  var payerSelect = document.getElementById('exp-payer');
  var splitGroup = document.getElementById('split-group');
  var rowsBody = document.getElementById('expense-rows');
  var balancesEl = document.getElementById('balances');
  var clearAllBtn = document.getElementById('clear-all');

  var sumTotal = document.getElementById('sum-total');
  var sumCount = document.getElementById('sum-count');
  var sumPerHead = document.getElementById('sum-perhead');

  function loadExpenses() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveExpenses(expenses) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    } catch (e) { /* storage unavailable, continue in-memory only */ }
  }

  var expenses = loadExpenses();

  function money(n) {
    var sign = n < 0 ? '-' : '';
    return sign + '$' + Math.abs(n).toFixed(2);
  }

  // ---- split chip toggling ----
  splitGroup.addEventListener('click', function (e) {
    var chip = e.target.closest('.split-chip');
    if (!chip) return;
    var checkbox = chip.querySelector('input');
    // let the native click on the label handle the checkbox toggle,
    // then sync the visual state on next tick
    setTimeout(function () {
      chip.classList.toggle('active', checkbox.checked);
    }, 0);
  });

  // ---- add expense ----
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var desc = descInput.value.trim();
    var amount = parseFloat(amountInput.value);
    var payer = payerSelect.value;
    var split = Array.prototype.slice
      .call(splitGroup.querySelectorAll('input:checked'))
      .map(function (i) { return i.value; });

    if (!desc || !amount || amount <= 0 || split.length === 0) return;

    expenses.push({
      id: Date.now() + '-' + Math.random().toString(36).slice(2, 7),
      desc: desc,
      amount: amount,
      payer: payer,
      split: split
    });

    saveExpenses(expenses);
    form.reset();
    // re-check all split chips by default after reset
    splitGroup.querySelectorAll('input').forEach(function (i) { i.checked = true; });
    splitGroup.querySelectorAll('.split-chip').forEach(function (c) { c.classList.add('active'); });

    render();
  });

  clearAllBtn.addEventListener('click', function () {
    if (expenses.length === 0) return;
    if (!window.confirm('Clear all logged expenses? This can\'t be undone.')) return;
    expenses = [];
    saveExpenses(expenses);
    render();
  });

  function removeExpense(id) {
    expenses = expenses.filter(function (ex) { return ex.id !== id; });
    saveExpenses(expenses);
    render();
  }

  // ---- rendering ----
  function renderRows() {
    if (expenses.length === 0) {
      rowsBody.innerHTML = '<tr class="empty-row"><td colspan="5">No expenses yet — add the first one above.</td></tr>';
      return;
    }
    rowsBody.innerHTML = expenses.map(function (ex) {
      return '<tr>' +
        '<td>' + escapeHtml(ex.desc) + '</td>' +
        '<td>' + escapeHtml(ex.payer) + '</td>' +
        '<td>' + escapeHtml(ex.split.join(', ')) + '</td>' +
        '<td class="amount">' + money(ex.amount) + '</td>' +
        '<td><button class="btn ghost small" data-id="' + ex.id + '">Remove</button></td>' +
        '</tr>';
    }).join('');

    rowsBody.querySelectorAll('button[data-id]').forEach(function (btn) {
      btn.addEventListener('click', function () { removeExpense(btn.getAttribute('data-id')); });
    });
  }

  function renderSummary() {
    var total = expenses.reduce(function (sum, ex) { return sum + ex.amount; }, 0);
    sumTotal.textContent = money(total).replace('$', '$');
    sumCount.textContent = expenses.length;
    sumPerHead.textContent = money(total / PEOPLE.length);
  }

  function computeBalances() {
    var net = {};
    PEOPLE.forEach(function (p) { net[p] = 0; });

    expenses.forEach(function (ex) {
      var share = ex.amount / ex.split.length;
      ex.split.forEach(function (p) {
        if (net[p] === undefined) net[p] = 0;
        net[p] -= share;
      });
      if (net[ex.payer] === undefined) net[ex.payer] = 0;
      net[ex.payer] += ex.amount;
    });

    return net;
  }

  function renderBalances() {
    var net = computeBalances();

    if (expenses.length === 0) {
      balancesEl.innerHTML = '<div class="balance-row"><span class="who">Add an expense to see balances</span></div>';
      return;
    }

    // greedy settle-up: match debtors to creditors
    var creditors = [];
    var debtors = [];
    Object.keys(net).forEach(function (p) {
      var v = Math.round(net[p] * 100) / 100;
      if (v > 0.01) creditors.push({ p: p, v: v });
      else if (v < -0.01) debtors.push({ p: p, v: -v });
    });

    var settlements = [];
    var ci = 0, di = 0;
    creditors.sort(function (a, b) { return b.v - a.v; });
    debtors.sort(function (a, b) { return b.v - a.v; });

    while (ci < creditors.length && di < debtors.length) {
      var c = creditors[ci];
      var d = debtors[di];
      var amt = Math.min(c.v, d.v);
      settlements.push({ from: d.p, to: c.p, amt: amt });
      c.v -= amt;
      d.v -= amt;
      if (c.v < 0.01) ci++;
      if (d.v < 0.01) di++;
    }

    if (settlements.length === 0) {
      balancesEl.innerHTML = '<div class="balance-row"><span class="who">Everyone\u2019s square — nothing owed</span><span class="amt settled">$0.00</span></div>';
      return;
    }

    balancesEl.innerHTML = settlements.map(function (s) {
      return '<div class="balance-row">' +
        '<span class="who">' + escapeHtml(s.from) + ' → ' + escapeHtml(s.to) + '</span>' +
        '<span class="amt owes">' + money(s.amt) + '</span>' +
        '</div>';
    }).join('');
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function render() {
    renderRows();
    renderSummary();
    renderBalances();
  }

  render();
})();
