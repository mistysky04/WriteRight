const express = require('express');
const multer = require('multer');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // 🔥 in-memory upload

// Replace with your Azure credentials
const AZURE_ENDPOINT = process.env.AZURE_ENDPOINT;
const AZURE_KEY = process.env.AZURE_KEY;

if (!AZURE_ENDPOINT || !AZURE_KEY) {
    console.error('❌ Missing AZURE_ENDPOINT or AZURE_KEY in .env file');
    process.exit(1);
}

router.post('/image', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        const imageBuffer = req.file.buffer; // ✅ Already in memory!

        const response = await axios.post(
            AZURE_ENDPOINT,
            imageBuffer,
            {
                headers: {
                    'Ocp-Apim-Subscription-Key': AZURE_KEY,
                    'Content-Type': 'application/octet-stream',
                },
            }
        );

        const operationLocation = response.headers['operation-location'];
        if (!operationLocation) {
            throw new Error('Missing operation-location header from Azure');
        }

        // ⏳ Poll for OCR result
        let result = null;
        for (let i = 0; i < 10; i++) {
            const poll = await axios.get(operationLocation, {
                headers: { 'Ocp-Apim-Subscription-Key': AZURE_KEY },
            });

            if (poll.data.status === 'succeeded') {
                result = poll.data;
                break;
            } else if (poll.data.status === 'failed') {
                throw new Error('OCR failed');
            }

            await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        if (!result) {
            return res.status(504).json({ error: 'OCR timeout' });
        }

        res.json(result);

    }  catch (err) {
    const errorMsg = err.response?.data || err.message || err;
    console.error('❌ OCR Error:', errorMsg);
    res.status(500).json({ error: 'OCR request failed', detail: errorMsg });
}

});

module.exports = router;
