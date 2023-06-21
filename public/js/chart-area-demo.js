// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

function number_format(number, decimals, dec_point, thousands_sep) {
  // *     example: number_format(1234.56, 2, ',', ' ');
  // *     return: '1 234,56'
  number = (number + '').replace(',', '').replace(' ', '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

// Area Chart Example
var ctx = document.getElementById("myAreaChart");
const data = [0.5, 10000.5, 5000, 15000, 10000, 20000, 15000, 25000, 20000, 30000, 25000, 40000, 1,2, 123];

const labels = Array.from({ length: data.length }, (_, i) => `Label ${i + 1}`);
var myLineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: labels,
    datasets: [{
      label: "Earnings",
      lineTension: 0.3,
      backgroundColor: "rgba(78, 115, 223, 0.05)",
      borderColor: "rgba(78, 115, 223, 1)",
      pointRadius: 3,
      pointBackgroundColor: "rgba(78, 115, 223, 1)",
      pointBorderColor: "rgba(78, 115, 223, 1)",
      pointHoverRadius: 3,
      pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
      pointHoverBorderColor: "rgba(78, 115, 223, 1)",
      pointHitRadius: 10,
      pointBorderWidth: 2,
      data: data,
    }],
  },
  options: {
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 25,
        top: 25,
        bottom: 0
      }
    },
    scales: {
      xAxes: [{
        time: {
          unit: 'date'
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        ticks: {
          maxTicksLimit: 7
        }
      }],
      yAxes: [{
        ticks: {
          maxTicksLimit: 5,
          padding: 10,
          // Include a dollar sign in the ticks
          callback: function(value, index, values) {
            return '$' + number_format(value);
          }
        },
        gridLines: {
          color: "rgb(234, 236, 244)",
          zeroLineColor: "rgb(234, 236, 244)",
          drawBorder: false,
          borderDash: [2],
          zeroLineBorderDash: [2]
        }
      }],
    },
    legend: {
      display: false
    },
    tooltips: {
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      titleMarginBottom: 10,
      titleFontColor: '#6e707e',
      titleFontSize: 14,
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      intersect: false,
      mode: 'index',
      caretPadding: 10,
      callbacks: {
        label: function(tooltipItem, chart) {
          var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
          return datasetLabel + ': $' + number_format(tooltipItem.yLabel);
        }
      }
    }
  }
});

// function updateChart(data) {
//   const chart = Chart.getChart("myAreaChart"); // Get a reference to the existing chart
//   const bla =[0.5, 10000.5, 5000, 15000];
//   const labels = Array.from({ length: bla.length }, (_, i) => `Label ${i + 1}`);
//   if (chart) {
//     chart.data.datasets[0].data = bla;
//     chart.data.datasets[0].labels = labels;
//     chart.update();
//   }
// }

function updateChart(data) {
  const chart = myLineChart;
  const labels = data.label;

  //const labels = data.labels;
  const stockPrice = data.stockPrice;
  const values = stockPrice.map(price => parseFloat(price))
  if (chart) {
    chart.data.datasets[0].data = values;
    chart.data.labels = labels;
    chart.update();
  }
}

window.addEventListener('stockDataReceived', function(event) {
  var data = event.detail;
  updateChart(data);
});

function fetchStockSuggestions(searchTerm) {
  var apiKey = 'YOUR_API_KEY'; // Replace with your Alpha Vantage API key
  var url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${searchTerm}&apikey=${apiKey}`;
  console.log(url);
  fetch(url)
      .then(response => response.json())
      .then(data => {
      const suggestionDropdown = document.getElementById('suggestionDropdown');
      suggestionDropdown.innerHTML = '';

      if (data.bestMatches) {
          // Create and append suggestion items to the dropdown
          data.bestMatches.forEach(stock => {
          const suggestionItem = document.createElement('div');
          suggestionItem.textContent = stock['1. symbol'];
          suggestionItem.classList.add('suggestion');
          suggestionItem.addEventListener('click', () => {
              document.getElementById('stockSearch').value = stock['1. symbol'];
              suggestionDropdown.innerHTML = '';
          });
          suggestionDropdown.appendChild(suggestionItem);
          });
      }
      })
      .catch(error => {
      console.error('Error fetching stock suggestions:', error);
      });
}

const stockSearchInput = document.getElementById('stockSearch');
const suggestionDropdown = document.getElementById('suggestionDropdown');
let searchTimeout;
stockSearchInput.addEventListener('input', event => {
const searchTerm = event.target.value.trim();

// Clear suggestion dropdown if the search box is empty
if (searchTerm === '') {
  suggestionDropdown.innerHTML = '';
  return;
}

// Clear previous search timeout if present
clearTimeout(searchTimeout);

// Set a timeout to delay the search API call
searchTimeout = setTimeout(() => {
  fetchStockSuggestions(searchTerm);
}, 500);
});


// Add an event listener to the form submission
document.getElementById('addToFavoritesButton').addEventListener('click', function(event) {
  event.preventDefault();

  const stock = document.getElementById('stockSearch').value;
  const timePeriod = document.getElementById('timePeriodSelect').value;
  const info = document.getElementById('infoSelect').value;
  // Create the stockDetails object with the necessary properties
  

  // Save the selected stock and its details to favorites
  addToFavorites(stock, timePeriod, info);
});

function addToFavorites(stock, timePeriod, info) {
  const requestBody = JSON.stringify({ stock, timePeriod, info });

  // Send an HTTP request to the server to add the stock to favorites
  fetch('/api/addToFavorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: requestBody
  })
  .then(response => response.json())
  .then(data => {
  // Handle the response from the server
  console.log('Stock added to favorites:', data);
  })
  .catch(error => {
  console.error('Error adding stock to favorites:', error);
  });
}

document.getElementById("GetStockForm").addEventListener("submit", function(event) { 
  event.preventDefault();

  const stock = document.getElementById("stockSearch").value;
  const timePeriod = document.getElementById("timePeriodSelect").value;
  const filter = document.getElementById("infoSelect").value;
  let apiFunction;
  if (timePeriod === "1min" || timePeriod === "5min") {
      apiFunction = "TIME_SERIES_INTRADAY"; // Set the constValue to "x" if timePeriod is "1m"
  } 
  else if (timePeriod === "1day") {
      apiFunction = "TIME_SERIES_DAILY"; // Set the constValue to "z" if timePeriod is "3m"
  }
  else if (timePeriod === "1month" || timePeriod === "3month") {
      apiFunction = "TIME_SERIES_MONTHLY"; // Set the constValue to "y" for any other timePeriod value
  }
  const requestBody = JSON.stringify({ stock, timePeriod, apiFunction, filter });
  fetch('/api/stocks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: requestBody
  })
  .then(response => response.json())
  .then(data => {
      // Dispatch a custom event with the data
      window.dispatchEvent(new CustomEvent('stockDataReceived', { detail : data }));
  }) 
  .catch(error => {
      console.error('Error:', error);
  });
})


// Example data for dynamic values
var dynamicValues = [];

// Function to fetch data and generate dropdown items
function fetchDataAndGenerateDropdown() {
  fetch('/api/getFavorites') // Assuming you have an API endpoint for retrieving favorites
    .then(response => response.json())
    .then(data => {
      // Extract the info from each favorite and add it to dynamicValues
      dynamicValues = data.map(favorite => `${favorite.stock} ${favorite.time_period} ${favorite.stock}`);

      // Generate dynamic dropdown items
      var dropdownMenu = document.getElementById('dynamicDropdown');
      dynamicValues.forEach(function (value) {
          var dropdownItem = document.createElement('a');
          dropdownItem.classList.add('dropdown-item');
          dropdownItem.href = '#';
          dropdownItem.textContent = value;
          dropdownMenu.appendChild(dropdownItem);
      });
    })
    .catch(error => {
      console.error('Error retrieving favorites:', error);
      // Handle the error as needed
    });
}

// Call the fetch function when the page loads
window.addEventListener('load', fetchDataAndGenerateDropdown);


document.getElementById('submitFormButton').addEventListener('click', function(event) {
  var stockSearch = document.getElementById('stockSearch').value;
  var timePeriod = document.getElementById('timePeriodSelect').value;
  var info = document.getElementById('infoSelect').value;
  
  if (stockSearch === "" || timePeriod === "" || info === "") {
      event.preventDefault(); // Prevent form submission
      alert('Please fill in all three values before submitting.');
  }
});

document.getElementById('addToFavoritesButton').addEventListener('click', function(event) {
  var stockSearch = document.getElementById('stockSearch').value;
  var timePeriod = document.getElementById('timePeriodSelect').value;
  var info = document.getElementById('infoSelect').value;
  
  if (stockSearch === "" || timePeriod === "" || info === "") {
      event.preventDefault(); // Prevent form submission
      alert('Please fill in all three values before submitting.');
  }
});

