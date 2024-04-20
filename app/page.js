'use client';
import Image from "next/image";
import { useState } from 'react';


export default function Home() {

    const [coverVideoLink, setCoverVideoLink] = useState('');

    const generateForm = async () => {
        const videoResponse = await fetch('/api/video', {
            method: 'POST',
            body: JSON.stringify({}),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const {videoLink} = await videoResponse.json();
        setCoverVideoLink(videoLink);
    };

    return (
        <div>
            <button onClick={generateForm}>Generate Form</button>
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
