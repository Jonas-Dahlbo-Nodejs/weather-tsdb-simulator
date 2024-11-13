// server.js
const express = require('express');
const { InfluxDB } = require('@influxdata/influxdb-client');
const app = express();
const port = 3000;

// InfluxDB connection details
const token = 'your-influxdb-token';
const org = 'your-org';
const bucket = 'your-bucket';
const url = 'http://localhost:8086';

const client = new InfluxDB({ url, token });
const queryApi = client.getQueryApi(org);

app.use(express.static('public')); // Serve static files from 'public' folder

// Endpoint to fetch weather data from InfluxDB
app.get('/api/weather-data', async (req, res) => {
  const query = `
    from(bucket: "${bucket}")
      |> range(start: -1d)  // Last 24 hours of data
      |> filter(fn: (r) => r["_measurement"] == "weather")
      |> filter(fn: (r) => r["_field"] == "temperature" or r["_field"] == "humidity")
      |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
      |> keep(columns: ["_time", "temperature", "humidity"])
      |> sort(columns: ["_time"], desc: true)
  `;
  
  try {
    let data = [];
    await queryApi.queryRows(query, {
      next(row, tableMeta) {
        const record = tableMeta.toObject(row);
        data.push({
          timestamp: record._time,
          temperature: record.temperature,
          humidity: record.humidity
        });
      },
      error(error) {
        console.error(error);
        res.status(500).send('Error querying InfluxDB');
      },
      complete() {
        res.json(data);
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error querying InfluxDB');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
