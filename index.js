import express from 'express';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// Define __dirname and __filename for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// Specify the folder where files will be created and read
const folderPath = path.join(__dirname, 'myFolder');

// Ensure the folder exists
if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
}

// Endpoint to create a text file with the current timestamp
app.post('/create-file', (req, res) => {
    const currentUTCDate = new Date();
    const ISTOffset = 5.5 * 60 * 60 * 1000;
    const currentISTDate = new Date(currentUTCDate.getTime() + ISTOffset);
    const timestamp = currentISTDate.toISOString().replace('Z', '+05:30');
    
    const fileName = 'current date-time.txt';
    const filePath = path.join(folderPath, fileName);

    fs.writeFile(filePath, timestamp, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to create file' });
        }

        res.status(201).json({ message: 'File created successfully', fileName });
    });
});

// Endpoint to retrieve all text files in the folder
app.get('/list-files', (req, res) => {
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read directory' });
        }

        // Filter only .txt files
        const textFiles = files.filter(file => path.extname(file) === '.txt');
        res.status(200).json({ files: textFiles });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
