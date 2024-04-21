import { OpenAI } from 'openai';

export async function POST(req) {
  try {
    const body = await req.json();
    const { text } = body;
    if (!text) {
      return new Response(JSON.stringify({ error: 'Text is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: text,
    });
    console.log(mp3);

    const buffer = Buffer.from(await mp3.arrayBuffer());
    console.log(buffer);
    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'inline; filename="speech.mp3"',
      },
    });
  } catch (error) {
    console.error('Failed to generate speech file:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process text to speech conversion' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
