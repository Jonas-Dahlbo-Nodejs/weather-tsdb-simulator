import {InfluxDB, Point} from '@influxdata/influxdb-client';
import * as fs from 'node:fs/promises';

const token = '3n5pQs5JtNLSv3HVQsdCe02JNAgsBgcXQD46Zxg3EmyGpeiJC4tYodK9s5vKrePD3UW3nt5C5gIXEhLGEZCqHQ==';
const org = 'Jonas-dahlbo-Nodejs';
const bucket = 'environmental_data';
const url = 'http://localhost:8086';

const client = new InfluxDB({url, token});
const writeApi = client.getWriteApi(org, bucket, 'ns')

const generateWeatherData = () => {
    const temperature = (Math.random() * 40).toFixed(3);
    const humidity = (Math.random() * (90 - 30) + 30).toFixed(3);
    const pressure = (Math.random() * (1050 - 980) + 980).toFixed(3);
    return { temperature, humidity, pressure };
};


const insertData = async () => {
    const startTime = new Date();
    const dataPoints = 10000;
    let successfulPoints = 0;

    for(let i = 0; i < dataPoints; i++) {
        const timestamp = new Date(startTime.getTime() + i * 5 * 60000);
        const {temperature, humidity, pressure} = generateWeatherData();
        

        const point = new Point('weather')
        .tag('location', 'home')
        .floatField('temperature', parseFloat(temperature))
        .floatField('humidity', parseFloat(humidity))
        .floatField('pressure', parseFloat(pressure))
        .timestamp(timestamp);

        writeApi.writePoint(point);

        successfulPoints++;

        if (successfulPoints % 100 === 0) {
            console.log(`Successfully inserted ${successfulPoints} data points...`);
        }
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