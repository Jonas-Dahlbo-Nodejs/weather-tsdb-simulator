const {InfluxDB, Point} = require('@influxdata/influxdb-client');
const fs = require('fs');

const token = '3n5pQs5JtNLSv3HVQsdCe02JNAgsBgcXQD46Zxg3EmyGpeiJC4tYodK9s5vKrePD3UW3nt5C5gIXEhLGEZCqHQ==';
const org = 'Jonas-dahlbo-Nodejs';
const bucket = 'environmental_data';
const url = 'http://localhost:8086';

const client = new InfluxDB({url, token});
const writeApi = client.writeApi(org, bucket, 'ns');

const generateWeatherData = () => {
    const temperature = (Math.random() * 40).toFixed(3);
    const humidity = (Math.random() * (90 - 30) + 30).toFixed(3);
    const pressure = (Math.random() * (1050 - 980) + 980).toFixed(3);
    return { temperature, humidity, pressure };
};


const insertData = async () => {
    const startTime = new Date();
    const dataPoints = 10000;

    for(let i = 0; i < dataPoints; i++) {
        const timestamp = new Date(startTime.getTime() + i * 5 * 60000);
        const {temperature, humidity, pressure} = generateWeatherData();
        

        const point = Point('weather')
        .tag('location', 'home')
        .field('temperature', temperature)
        .field('humidity', humidity)
        .field('pressure', pressure)
        .timestamp(timestamp);

        writeApi.writePoint(point);

        console.log(`Generated data: ${timestamp.toISOString()} - Temp: ${temperature}°C, Humidity: ${humidity}%, Pressure: ${pressure} hPa`);    console.log(`Generated data: ${timestamp.toISOString()} - Temp: ${temperature}°C, Humidity: ${humidity}%, Pressure: ${pressure} hPa`);
    }

    try {
        await writeApi.close();
        console.log(`Data written to InfluxDB successfully`);
    }
    catch(err) {
        console.error(`Error writing data to InfluxDB`, err);
    }
}

insertData();