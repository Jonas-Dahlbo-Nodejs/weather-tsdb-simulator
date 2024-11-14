import express from 'express';
import { InfluxDB } from '@influxdata/influxdb-client';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;

const token = 'CFlN_7AUdmw4YhqixBadLg-FSzkUjR1s7dg5-LOirz-N40dh4SJXPLLf6--mz6QCojVbX75Xr3iOGp_TEfuFwQ==';
const org = 'Jonas-dahlbo-Nodejs';  // Your organization
const bucket = 'environmental_data';
const url = 'http://localhost:8086';

const client = new InfluxDB({ url, token });

app.use(express.static('public'));

// Route to delete environmental data based on time range
app.delete('/api/delete_data', async (req, res) => {
    const { startTime, endTime } = req.body;

    if (!startTime || !endTime) {
        return res.status(400).send('Both startTime and endTime are required');
    }

    try {
        // Convert startTime and endTime to ISO string format
        const start = new Date(startTime).toISOString();
        const end = new Date(endTime).toISOString();

        // URL for InfluxDB DELETE API endpoint
        const deleteUrl = `${url}/api/v2/delete?org=${org}&bucket=${bucket}`;

        // Delete payload - specify bucket, org, and time range
        const data = {
            start: start,
            stop: end,
            predicate: `_measurement="weather"`,  // Optional: You can specify further filters (e.g., specific tags or fields)
        };

        // Make a DELETE request to InfluxDB API to delete data
        const response = await fetch(deleteUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        // Check the response status
        if (response.ok) {
            res.status(200).send('Data deleted successfully');
            server.close(() => {
                console.log('Server closed successfully');
                process.exit(0);
            })
        } else {
            const errorMessage = await response.text();
            res.status(500).send(`Error deleting data: ${errorMessage}`);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting data from InfluxDB');
    }
});

const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});



const deleteData = async (startTime, endTime) => {
    try {
        const response = await fetch('http://localhost:3000/api/delete_data', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                startTime: startTime,
                endTime: endTime
            })
        });

        if (response.ok) {
            console.log('Data deleted successfully');
        } else {
            const errorMessage = await response.text();
            console.log('Error deleting data:', errorMessage);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

// Example usage:
deleteData('2023-11-01T00:00:00Z', '2025-11-02T00:00:00Z');
