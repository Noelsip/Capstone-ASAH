/**
 * Service untuk berkomunikasi dengan ML prediction dan chatbot APIs
 * Menggunakan native fetch API (Node.js 18+)
 */
class MLService {
    constructor() {
        this.predictUrl = process.env.ML_PREDICT_URL;
        this.chatbotUrl = process.env.ML_CHATBOT_URL;
        this.timeout = 30000; // 30 seconds
    }

    /**
     * Helper untuk fetch dengan timeout
     */
    async fetchWithTimeout(url, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
            headers: {
            'Content-Type': 'application/json',
            ...options.headers
            }
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
        } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Request timeout');
        }
        throw error;
        }
    }

    /**
     * Mengirim data sensor ke ML model untuk prediksi
     * @param {Object} sensorData - Data sensor dari mesin
     * @returns {Promise<Object>} Hasil prediksi dari ML model
     */
    async predictMaintenance(sensorData) {
        try {
        const payload = {
            air_temperature: sensorData.air_temperature_k,
            process_temperature: sensorData.process_temperature_k,
            rotational_speed: sensorData.rotational_speed_rpm,
            torque: sensorData.torque_nm,
            tool_wear: sensorData.tool_wear_min
        };

        console.log('Sending prediction request:', payload);

        const data = await this.fetchWithTimeout(this.predictUrl, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        console.log('Prediction response:', data);

        return {
            success: true,
            data: data
        };
        } catch (error) {
        console.error('ML Prediction API Error:', error.message);
        return {
            success: false,
            error: error.message
        };
        }
    }

    /**
     * Mengirim pertanyaan ke chatbot AI
     * @param {string} question - Pertanyaan user atau context
     * @returns {Promise<Object>} Response dari chatbot
     */
    async askChatbot(question) {
        try {
        const payload = {
            question: question
        };

        console.log('Sending chatbot request:', payload);

        const data = await this.fetchWithTimeout(this.chatbotUrl, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        console.log('Chatbot response:', data);

        return {
            success: true,
            data: data
        };
        } catch (error) {
        console.error('Chatbot API Error:', error.message);
        return {
            success: false,
            error: error.message
        };
        }
    }
}

export default new MLService();