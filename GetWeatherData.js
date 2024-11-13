fetch('/api/weather-data')
  .then(response => response.json())
  .then(data => {
    const timestamps = data.map(item => new Date(item.timestamp).toLocaleTimeString());
    const temperatures = data.map(item => item.temperature);
    const humidity = data.map(item => item.humidity);

    const ctx = document.getElementById('weatherChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: timestamps,
        datasets: [
          {
            label: 'Temperature (°C)',
            data: temperatures,
            borderColor: 'red',
            fill: false
          },
          {
            label: 'Humidity (%)',
            data: humidity,
            borderColor: 'blue',
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Time'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Value'
            }
          }
        }
      }
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
