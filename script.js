let toysData = {};
let historyData = {};
const toySetSelect = document.getElementById('toySet');
const toyTable = document.getElementById('toyTable');
const ctx = document.getElementById('priceChart').getContext('2d');
let chart;

async function loadData() {
    const toysResp = await fetch('data/toys.json');
    toysData = await toysResp.json();
    const histResp = await fetch('data/history.json');
    historyData = await histResp.json();

    populateToySets();
}

function populateToySets() {
    toySetSelect.innerHTML = '';
    for (let set in toysData) {
        const option = document.createElement('option');
        option.value = set;
        option.textContent = set;
        toySetSelect.appendChild(option);
    }
    displayToySet(Object.keys(toysData)[0]);
}

function displayToySet(setName) {
    const toys = toysData[setName];
    toyTable.innerHTML = `<tr>
      <th>Box</th><th>Name</th><th>Current Price ($)</th><th>Rarity Rank</th>
    </tr>`;
    toys.forEach(toy => {
        const row = toyTable.insertRow();
        row.insertCell(0).innerText = toy.box || '-';
        row.insertCell(1).innerText = toy.name;
        row.insertCell(2).innerText = toy.current_price;
        row.insertCell(3).innerText = toy.rarity_rank || '-';
    });
    updateChart(setName);
}

function updateChart(setName) {
    const toys = toysData[setName];
    const labels = toys.map(t => t.name);
    const data = toys.map(t => t.current_price);

    if(chart) chart.destroy();
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Current Price ($)',
                data: data,
                backgroundColor: 'rgba(244,200,66,0.6)'
            }]
        },
        options: { responsive: true }
    });
}

toySetSelect.addEventListener('change', () => {
    displayToySet(toySetSelect.value);
});

loadData();
