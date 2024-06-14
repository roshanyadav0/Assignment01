// server.ts

import express from 'express';
import fs from 'fs';
import path from 'path';

// Create an Express application
const app = express();
const port = 3000;

// Helper function to read JSON files
const readJsonFile = (filePath: string) => {
    try {
        const data = fs.readFileSync(path.resolve(__dirname, filePath), 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        return null;
    }
};

// Define routes for each JSON data category
app.get('/customer-types', (req, res) => {
    const data = readJsonFile('Customer Type.json');
    if (data) {
        res.json(data);
    } else {
        res.status(500).send('Error reading Customer Type data');
    }
});

app.get('/account-industries', (req, res) => {
    const data = readJsonFile('Account Industry.json');
    if (data) {
        res.json(data);
    } else {
        res.status(500).send('Error reading Account Industry data');
    }
});

app.get('/acv-ranges', (req, res) => {
    const data = readJsonFile('ACV Range.json');
    if (data) {
        res.json(data);
    } else {
        res.status(500).send('Error reading ACV Range data');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
