const BACKEND_PORT = 8888;
const BASE_URL = `http://localhost:${BACKEND_PORT}`;

export default class APIClient {
    /**
     * Send an image file or blob to the backend for OCR
     * @param {File|Blob} image - The image to send
     * @returns {Promise<Object>} - OCR result from backend
     */
    static async postImage(image) {
        const formData = new FormData();
        formData.append('image', image);

        try {
            const response = await fetch(`${BASE_URL}/ocr/image`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to get OCR result');
            }

            const data = await response.json();
            console.log(`Score = ${data}`)
            return data;

        } catch (err) {
            console.error('❌ Error sending image to OCR:', err);
            throw err;
        }
    }
}
