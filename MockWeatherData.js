import {InfluxDB, Point} from '@influxdata/influxdb-client';
import * as fs from 'node:fs/promises';
import _ from 'lodash';

const token = 'CFlN_7AUdmw4YhqixBadLg-FSzkUjR1s7dg5-LOirz-N40dh4SJXPLLf6--mz6QCojVbX75Xr3iOGp_TEfuFwQ==';
const org = 'Jonas-dahlbo-Nodejs';
const bucket = 'environmental_data';
const url = 'http://localhost:8086';

const client = new InfluxDB({url, token});
const writeApi = client.getWriteApi(org, bucket, 'ns')

const generateWeatherData = (baseTemperature, baseHumidity , basePressure ) => {
    const temperature = (baseTemperature + (Math.random() * 4 - 2)).toFixed(3); 
    const humidity = (baseHumidity + (Math.random() * 6 - 3)).toFixed(3);
    const pressure = (basePressure + (Math.random() * 4 - 2)).toFixed(3);
    return { temperature, humidity, pressure };
};


const insertData = async () => {
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    const startTime = fiveDaysAgo.getTime() / 1000;
    const interval = 60 * 60;
    const dataPoints = 24*5;

    let baseTemperature = 14;
    let baseHumidity = 50;
    let basePressure = 1013;

    for(let i = 0; i < dataPoints; i++) {
        const timestamp = (startTime + i * interval) * 1000;
        const {temperature, humidity, pressure} = generateWeatherData(baseTemperature, baseHumidity, basePressure);    
        

        const point = new Point('weather')
        .tag('location', 'home')
        .floatField('temperature', parseFloat(temperature))
        .floatField('humidity', parseFloat(humidity))
        .floatField('pressure', parseFloat(pressure))
        .timestamp(new Date(timestamp));

        console.log(point)
        writeApi.writePoint(point);

        baseTemperature += _.random(-0.5, 0.5);
        baseHumidity += _.random(-1, 1);
        basePressure += _.random(-0.3, 0.3)
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