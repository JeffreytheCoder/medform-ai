import OpenAI from 'openai';

const format_prompt = (
  title,
  description,
  question,
  response,
  nextQuestion
) => {
  return `Context:
  You are an AI form generator in charge of generating medical forms for doctors that help assessing qualitative data from patients. 
  The questions in the form should provide a comprehensive review of the patient's qualitative medical state, such as sensation, pain, and emotion.
  The form you generate should steer away from routine questions, as it is not the purpose of this form to collect routine medical questions that nurses typically ask. 
  The questions should provide valuable information to primary care providers. 
  You should ask professional questions but in a conversational, casual tone like a doctor would ask a patient.
  It is extremely important that the output is only given in JSON format. 
  
   The patient is answering to the form called "${title}" with the following description:
  
  ${description}
  
  For the last question:

  ${question}

  The patient has answered:

  ${response}

  The \`NEXT_QUESTION\` is set to:

  ${nextQuestion}

  Generate the next question in JSON format. Nothing else.
  
  JSON output format:
  {
    "question": string,
    "pass": boolean
    "keywords" : string[]
  }

  Set "pass" to true. 
  
  Otherwise, if last question and response are empty or undefined, set the JSON output's "question" field to the exact value within the \`NEXT_QUESTION\`, which is \"${nextQuestion}\". After that, set "pass" to true.
  
  Lastly, set "keywords" to an array of 3-5 strings that are relevant to the question.
  `;
};

const write_feedback = (
  title,
  description,
  question,
  response,
  nextQuestion
) => {
  return `For the last question:
  
    ${question}
  
    The patient has answered:
  
    ${response}
    
    Based on the patient's answer, give a 1-2 sentences feedback to the patient's response. Be as short as possible.
    Refer to the specific things in the patient's response to the last question.
    Your tone of should be positive, personal, and casual.
  `;
};

const openai = new OpenAI();

export async function POST(req) {
  const { title, description, question, response, nextQuestion } =
    await req.json();

  console.log(title, description, question, response, nextQuestion);

  const new_prompt = format_prompt(
    title,
    description,
    question,
    response,
    nextQuestion
  );
  console.log(new_prompt);
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: new_prompt,
      },
    ],
    model: 'gpt-4-turbo',
  });
  const question_msg = completion.choices[0].message.content;

  const new_feedback = write_feedback(
    title,
    description,
    question,
    response,
    nextQuestion
  );
  console.log(new_feedback);
  const feedback = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: new_feedback,
      },
    ],
    model: 'gpt-4-turbo',
  });

  const feedback_msg = feedback.choices[0].message.content;

  let output = JSON.parse(question_msg);

  output.feedback = feedback_msg;
  console.log(output);
  return new Response(JSON.stringify(output), {
    headers: { 'Content-Type': 'application/json' },
  });
}
