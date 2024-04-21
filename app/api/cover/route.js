import OpenAI from 'openai';

const formatPrompt = (user_prompt) => {
  return `Context:
You are an AI form generator in charge of generating medical forms for doctors that help assessing qualitative data from patients. 
The questions in the form should provide a comprehensive review of the patient's qualitative medical state, such as sensation, pain, and emotion.
The form you generate should steer away from routine questions, as it is not the purpose of this form to collect routine medical questions that nurses typically ask. 
The questions should provide valuable information to primary care providers. 
You should ask professional questions but in a conversational, casual tone like a doctor would ask a patient.
It is extremely important that the output is only given in JSON format. Only give 4-5 questions.
Here is an example of input-output pair:

###Input:
  I'm a doctor who wants to collect weekly update from my patients who suffer from ACL injury.

  Generate the form in the following JSON format. Nothing else.\`;
  
  
###Output:
  {
    "title": "Weekly ACL Injury Update Form",
    "description": "This form is designed to collect weekly updates on your ACL injury recovery progress. Please answer the questions below to help us monitor your condition and adjust your treatment plan as necessary.",
    "keywords": ["ACL injury", "patient recovery"],
    "questions": [
      "What is your current level of pain on a scale of 0 (no pain) to 10 (severe pain)?",
      "Are you able to walk without assistance? If no, please describe the difficulties you are experiencing.",
      "Have you noticed any swelling around the knee? If yes, how would you rate the swelling on a scale of 1 (mild) to 5 (severe)?",
      "How many days this week did you perform physical therapy exercises?",
      "Have there been any changes in your medication or treatment? If yes, please specify.",
    ]
  }
  
  ---
  
  You are an AI form generator. Here is the user's instruction:
  
  ${user_prompt}
  
  Generate the form in the following JSON format. Nothing else.`;
};

const openai = new OpenAI();

export async function POST(req) {
  const { prompt } = await req.json();

  const completion = await openai.chat.completions.create({
    messages: [{ role: 'system', content: formatPrompt(prompt) }],
    model: 'gpt-3.5-turbo',
  });

  const output = completion.choices[0].message.content;
  console.log(output);
  return Response.json({ output });
}
