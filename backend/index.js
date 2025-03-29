// backend/index.js
const express = require('express');
const cors = require('cors');
const ocrRouter = require('./routes/ocr');

const app = express();
const port = 8888;

app.use(cors()); // allow frontend to call backend
app.use(express.json()); // parse JSON
app.use('/ocr', ocrRouter); // route for OCR API

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
