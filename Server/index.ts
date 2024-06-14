import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());

const dataDir = path.join(__dirname, 'data');
const jsonData: { [key: string]: any } = {};

const loadJsonData = () => {
    const files = ['Customer Type.json', 'Account Industry.json', 'ACV Range.json', 'Team.json'];

    files.forEach(file => {
        try {
            const filePath = path.join(dataDir, file);
            const data = fs.readFileSync(filePath, 'utf-8');
            const key = path.basename(file, '.json').toLowerCase().replace(/\s/g, '-');
            jsonData[key] = JSON.parse(data);
        } catch (error) {
            console.error(`Error reading file ${file}:`, error);
        }
    });
};

loadJsonData();

// Routes for each JSON data category
app.get('/customer-types', (req, res) => {
    const data = jsonData['customer-type'];
    if (data) {
        res.json(data);
    } else {
        res.status(500).send('Error reading Customer Type data');
    }
});

app.get('/account-industries', (req, res) => {
    const data = jsonData['account-industry'];
    if (data) {
        res.json(data);
    } else {
        res.status(500).send('Error reading Account Industry data');
    }
});

app.get('/acv-ranges', (req, res) => {
    const data = jsonData['acv-range'];
    if (data) {
        res.json(data);
    } else {
        res.status(500).send('Error reading ACV Range data');
    }
});

app.get('/team', (req, res) => {
    const data = jsonData['team'];
    if (data) {
        res.json(data);
    } else {
        res.status(500).send('Error reading Team data');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
