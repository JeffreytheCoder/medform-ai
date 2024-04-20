import { OpenAI } from 'openai';
import { writeFile } from 'fs/promises';
import fs from 'fs';
import path from 'path';  // Make sure this import is included

export async function POST(req) {
    try {
        const body = await req.json();  // This is important to correctly parse the JSON body
        const { text } = body;
        if (!text) {
            return new Response(JSON.stringify({ error: 'Text is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY  // Make sure to set your API key in environment variables
        });

        const speechFile = path.resolve('./public/speech.mp3');  // Save file in public directory for access

        const mp3 = await openai.audio.speech.create({
            model: "tts-1",
            voice: "alloy",
            input: text,
        });

        const buffer = Buffer.from(await mp3.arrayBuffer());
        await fs.promises.writeFile(speechFile, buffer);

        // Return the URL to the generated speech file using JSON
        // Prevent caching by sending a unique query string with the file URL
        const uniqueId = new Date().getTime(); // Generate a timestamp to append to the file URL
        return new Response(JSON.stringify({ fileUrl: `/speech.mp3?${uniqueId}` }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Failed to generate speech file:', error);
        return new Response(JSON.stringify({ error: 'Failed to process text to speech conversion' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
