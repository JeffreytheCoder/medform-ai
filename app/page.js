'use client';
import Image from "next/image";
import { useState, useRef, useEffect } from 'react';


export default function Home() {

    const [coverVideoLink, setCoverVideoLink] = useState('');
    const [audioUrl, setAudioUrl] = useState('');
    const audioRef = useRef(new Audio());

    useEffect(() => {
        // This effect updates the source of the audio whenever audioUrl changes
        if (audioUrl) {
            const currentAudio = audioRef.current;
            currentAudio.src = audioUrl;
            currentAudio.play()
                .catch(error => console.error('Error playing the audio file:', error));
        }

        return () => {
            // Clean up the audio if the component unmounts or url changes
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        };
    }, [audioUrl]);

    const generateForm = async () => {
        const videoResponse = await fetch('/api/video', {
            method: 'POST',
            body: JSON.stringify({'keywords': ['szsojfewoi', 'nature']}),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const {videoLink} = await videoResponse.json();
        setCoverVideoLink(videoLink);
    };

    const handleTextToSpeech = async () => {
        const defaultText = "I shall be telling this with a sigh\n" +
            "Somewhere ages and ages hence:\n" +
            "Two roads diverged in a wood, and I—\n" +
            "I took the one less traveled by,\n" +
            "And that has made all the difference.";

        try {
            const response = await fetch('/api/speech', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: defaultText})
            });

            if (!response.ok) {
                console.error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data);

            // Optionally: Handle the speech file URL (e.g., play it or display it)
            if (data.fileUrl) {
                setAudioUrl(data.fileUrl);
            } else {
                console.error('Failed to load the audio file:', data.error);
            }
        }
        catch (error) {
            console.error('Failed to fetch:', error);
        }
    };

    return (
        <div>
            <button onClick={generateForm}>Generate Form</button>
            <button onClick={handleTextToSpeech}>Convert Text to Speech</button>
            <video
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: '0',
                    left: '0',
                    objectFit: 'cover',
                    zIndex: '-1',
                }}
                autoPlay
                muted
                loop
                src={coverVideoLink}
            />
        </div>

  );
}
