import OpenAI from 'openai';
import { promises as fs } from 'fs';

const formatPrompt = async (user_prompt) => {

    // Read the content of three text files
    const filePaths = ['data/file1.txt', 'data/file2.txt', 'data/file3.txt'];
    const fileContents = await Promise.all(
        filePaths.map(path => fs.readFile(path, 'utf8'))
    );

    // Concatenate the contents of the files
    const prompt = fileContents.join('\n\n');

    const context = `You are a medical analyst that has been tasked with analyzing patient data. Below are patient responses ranging from Week 4 to Week 10 following an ACL surgery recovery. Your output should be in plain text, and it must not be in markdown format. Your task is to answer this question:
    
    ${user_prompt}
    
    If you can get the answer to this question from the data below, then provide a detailed response with rigorous analysis. If the data below cannot provide the answer to this question, then just say that the data is insufficient to answer the question. Do not rely on any other knowledge to answer this question other than the data provided below.
    
    # Patient Data:
 
    ${prompt}
    \n`

    // Send the response from the GPT model to the client

    return context;
};

const openai = new OpenAI();

export async function POST(req) {
    const { userQuery } = await req.json();

    const prompt = await formatPrompt(userQuery);

    const completion = await openai.chat.completions.create({
        messages: [{ role: 'system', content: prompt }],
        model: 'gpt-3.5-turbo',
    });

    const output = completion.choices[0].message.content;

    console.log(output);

    return new Response(JSON.stringify(output), {
        headers: {'Content-Type': 'application/json'},
    });
}
