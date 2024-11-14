import express from 'express';
import {InfluxDB} from '@influxdata/influxdb-client';
import cors from 'cors';



const app = express();
app.use(cors());
const port = 3000;

const token = '3n5pQs5JtNLSv3HVQsdCe02JNAgsBgcXQD46Zxg3EmyGpeiJC4tYodK9s5vKrePD3UW3nt5C5gIXEhLGEZCqHQ==';
const org = 'Jonas-dahlbo-Nodejs';
const bucket = 'environmental_data';
const url = 'http://localhost:8086';

const client = new InfluxDB({ url, token });
const queryApi = client.getQueryApi(org);

app.use(express.static('public'));

app.get('/api/environmental_data', async (req, res) => {
  const query = `
    from(bucket: "${bucket}")
      |> range(start: -6d) 
      |> filter(fn: (r) => r["_measurement"] == "weather")
      |> filter(fn: (r) => r["_field"] == "temperature" or r["_field"] == "humidity" or r["_field"] == "pressure")
      |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
      |> keep(columns: ["_time", "temperature", "humidity", "pressure"])
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
          humidity: record.humidity,
          pressure: record.pressure
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
