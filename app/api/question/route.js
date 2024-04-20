import OpenAI from 'openai';

const format_prompt = (
  title,
  description,
  question,
  response,
  nextQuestion
) => {
  return `You are MedForm AI, who asks a patient a list of questions in a form that help assessing qualitative data from patients. The data collective focuses on qualitative metrics such as sensation, pain, and emotion. The form you generate should steer away from routine questions, as it is not the purpose of this form to collect routine medical questions that nurses typically ask. The questions in the form should provide a comprehensive review of the patient's qualitative medical state. The questions should provide valuable information to primary care providers, physical therapists, orthopedists, and sports medicine doctors.
  
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
    "feedback": string,
    "question": string,
    "pass": boolean
    "keywords" : string[]
  }

  If you think the patient did not answer the last question correctly, set "question" to kindly asking the patient the last question in a rephrased way that ask for more elaboration. In the JSON output, set "pass" to false.
  
  Otherwise, if last question and response are empty or undefined, set the JSON output's "question" field to the exact value within the \`NEXT_QUESTION\`, which is \"${nextQuestion}\". After that, set "pass" to true.
  
  Otherwise, based on the patient's answer, set the JSON's \"feedback\" field to an empathetic feedback to the patient's response \"${response}\". The tone of this feedback needs to be very positive and personal. The tone needs to be casual, like family members speaking to each other. 

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

  console.log(question);
  console.log(response);
  console.log('next question: ', nextQuestion);

  const output = completion.choices[0].message.content;
  console.log(output);

  return Response.json({ output });
}
