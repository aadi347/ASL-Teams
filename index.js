// speechToText.js (Backend)
import axios from 'axios';
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

app.use(bodyParser.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));



// Azure Speech API integration
const speechToText = async (audioStream) => {
    const subscriptionKey = "cf915776f0bd4ecbaf37c7eb4058b719";
    const region = "southeastasia";
    const apiUrl = `https://southeastasia.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1`;

    try {
        const response = await axios.post(apiUrl, audioStream, {
            headers: {
                'cf915776f0bd4ecbaf37c7eb4058b719': subscriptionKey,
                'Content-Type': 'audio/wav',
            },
        });
        return response.data.DisplayText;
    } catch (error) {
        console.error("Error in speech-to-text conversion", error);
    }
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to receive audio from the client (Teams)
app.post('/convert-audio', async (req, res) => {
    const audioStream = req.body.audioStream;
    const text = await speechToText(audioStream);
    res.json({ transcribedText: text });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
