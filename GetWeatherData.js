fetch('http://localhost:3000/api/environmental_data')
    .then(response => response.json())
    .then(data => {
        const timestamps = data.map(item => new Date(item.timestamp).toLocaleTimeString());
        const temperatures = data.map(item => item.temperature);
        const humidity = data.map(item => item.humidity);
        const pressure = data.map(item => item.pressure);

        console.log(pressure)

        //Create Temperature Chart
        const ctxTemp = document.getElementById('temperatureChart').getContext('2d');
        new Chart(ctxTemp, {
            type: 'line',
            data: {
                labels: timestamps,
                datasets: [
                    {
                        label: 'Temperature (°C)',
                        data: temperatures,
                        borderColor: 'red',
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
                            text: 'Temperature (°C)'
                        }
                    }
                }
            }
        });

        // Create Humidity Chart
        const ctxHumidity = document.getElementById('humidityChart').getContext('2d');
        new Chart(ctxHumidity, {
            type: 'line',
            data: {
                labels: timestamps,
                datasets: [
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
                            text: 'Humidity (%)'
                        }
                    }
                }
            }
        });

        // Create Pressure Chart
        const ctxPressure = document.getElementById('pressureChart').getContext('2d');
        new Chart(ctxPressure, {
            type: 'line',
            data: {
                labels: timestamps, // Shared X-axis (time)
                datasets: [
                    {
                        label: 'Pressure (hPa)',
                        data: pressure,
                        borderColor: 'green',
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
                        },
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 10
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Pressure (hPa)'
                        },
                        ticks: {
                            min: 1000, // Set the minimum for pressure
                            max: 1050, // Set the maximum for pressure
                            stepSize: 10, // Optional: Control step size for better spacing
                            beginAtZero: false, // Don't start from 0 since pressure values don't start at 0
                        }
                    }
                }
            }
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });