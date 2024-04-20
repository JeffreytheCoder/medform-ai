import OpenAI from 'openai';

const format_prompt = (
  title,
  description,
  question,
  response,
  nextQuestion
) => {
  return `You are MedForm AI, who asks a patient a list of questions in a form. The patient is answering to the form called "${title}" with the following description:
  
  ${description}
  
  For the last question:

  ${question}

  The patient has answered:

  ${response}

  The next question is:

  ${nextQuestion}

  Generate the next question in JSON format. Nothing else.
  
  JSON output format:
  {
    "question": string,
    "pass": boolean
    "keywords" : string[]
  }

  If you think the patient did not answer the last question correctly, set "question" to kindly asking the patient the last question in another way, and set "pass" to false.
  
  Otherwise, or if last question and response are empty, set "question" to the next question, and set "pass" to true.

  Lastly, set "keywords" to an array of 3-5 strings that are relevant to the question.
  `;
};

const openai = new OpenAI();

export async function POST(req) {
  const { title, description, question, response, nextQuestion } =
    await req.json();
  ``;
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: format_prompt(
          title,
          description,
          question,
          response,
          nextQuestion
        ),
      },
    ],
    model: 'gpt-3.5-turbo',
  });

  const output = completion.choices[0].message.content;
  console.log(output);

  return Response.json({ output });
}
