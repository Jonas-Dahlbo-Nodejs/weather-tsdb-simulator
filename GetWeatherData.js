fetch('http://localhost:3000/api/environmental_data')
    .then(response => response.json())
    .then(data => {

        data.reverse();
        
        const timestamps = data.map(item => new Date(item.timestamp));
        const temperatures = data.map(item => item.temperature);
        const humidity = data.map(item => item.humidity);
        const pressure = data.map(item => item.pressure);

        const time = timestamps.map(timestamp => timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        const date = timestamps.map(timestamp => timestamp.toLocaleDateString('en-GB', {weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' }));

        console.log(date);
        //Create Temperature Chart
        const ctxTemp = document.getElementById('temperatureChart').getContext('2d');
        new Chart(ctxTemp, {
            type: 'line',
            data: {
                labels: time,
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
                        id: 'x-axis-time',
                        title: {
                            display: true,
                            text: 'Time'
                        },
                    },
                    x2: {
                        id: 'x-axis-date',
                        title: {
                            display: true,
                            text: 'Date'
                        },
                        display: true,
                        grid: {
                            display: false,
                        },
                        ticks: {
                            autoSkip: false,
                            callback: function(value, index) {
                                const timeAtIndex = time[index]; 
                                if (index === 0 || timeAtIndex.startsWith('00') && time[index - 1].startsWith('23')) {
                                    console.log(`entered ${index}`);
                                    console.log(`${date[index]}`)
                                    return date[index];  
                                }
                                return ''; 
                            }
                        },
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
                labels: time,
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
                        id: 'x-axis-time',
                        title: {
                            display: true,
                            text: 'Time'
                        }
                    },
                    x2: {
                        id: 'x-axis-date',
                        title: {
                            display: true,
                            text: 'Date'
                        },
                        display: true,
                        grid: {
                            display: false,
                        },
                        ticks: {
                            autoSkip: false,
                            callback: function(value, index) {
                                const timeAtIndex = time[index]; 
                                if (index === 0 || timeAtIndex.startsWith('00') && time[index - 1].startsWith('23')) {
                                    console.log(`entered ${index}`);
                                    console.log(`${date[index]}`)
                                    return date[index];  
                                }
                                return ''; 
                            }
                        },
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
                labels: time, 
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
                        id: 'x-axis-time',
                        title: {
                            display: true,
                            text: 'Time'
                        }
                    },
                    x2: {
                        id: 'x-axis-date',
                        title: {
                            display: true,
                            text: 'Date'
                        },
                        display: true,
                        grid: {
                            display: false,
                        },
                        ticks: {
                            autoSkip: false,
                            callback: function(value, index) {
                                const timeAtIndex = time[index]; 
                                if (index === 0 || timeAtIndex.startsWith('00') && time[index - 1].startsWith('23')) {
                                    console.log(`entered ${index}`);
                                    console.log(`${date[index]}`)
                                    return date[index];  
                                }
                                return ''; 
                            }
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Pressure (hPa)'
                        }
                    }
                }
            }
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });