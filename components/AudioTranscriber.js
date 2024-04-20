import React, { useState, useRef, useEffect } from 'react';

const AudioTranscriber = () => {
    const DEEPGRAM_API_KEY = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY;
    const apiURL = 'wss://api.deepgram.com/v1/listen?model=nova-2-medical';
    const [isRecording, setIsRecording] = useState(false);
    const [status, setStatus] = useState('Not Connected');
    const [transcript, setTranscript] = useState('');
    const mediaRecorderRef = useRef(null);
    const webSocketRef = useRef(null);

    const startRecording = async () => {
        if (!navigator.mediaDevices) {
            alert('Audio recording not supported by this browser');
            return;
        }

        setTranscript('');

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

        mediaRecorderRef.current = mediaRecorder;

        const socket = new WebSocket(apiURL, [
            'token',
            DEEPGRAM_API_KEY,
        ]);

        webSocketRef.current = socket;

        socket.onopen = () => {
            setStatus('Connected');
            mediaRecorder.addEventListener('dataavailable', event => {
                if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
                    socket.send(event.data);
                }
            });
            mediaRecorder.start(250); // You may adjust this interval as needed
        };

        socket.onmessage = message => {
            const data = JSON.parse(message.data);
            const receivedTranscript = data.channel.alternatives[0].transcript;
            if (receivedTranscript && data.is_final) {
                setTranscript(prev => `${prev} ${receivedTranscript}`);
            }
        };

        socket.onclose = () => setStatus('Disconnected');
        socket.onerror = error => console.error('WebSocket error:', error);

        setIsRecording(true);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
        if (webSocketRef.current) {
            webSocketRef.current.close();
        }
        setIsRecording(false);
        setStatus('Not Connected');
    };

    return (
        <div>
            <button onClick={isRecording ? stopRecording : startRecording}>
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
            <div>Status: {status}</div>
            <div>Transcription: {transcript}</div>
        </div>
    );
};

export default AudioTranscriber;
