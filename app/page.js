'use client';
import CoverPage from '@/components/CoverPage';
import QuestionPage from '@/components/QuestionPage';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useRef, useState } from 'react';

export default function Home() {
  const promptRef = useRef();
  const [isGenerated, setIsGenerated] = useState(false);
  const [coverTitle, setCoverTitle] = useState('');
  const [coverDescription, setCoverDescription] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');

  const generateForm = async () => {
    const prompt = promptRef.current.value;
    console.log(prompt);
    const coverResponse = await fetch('/api/cover', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const coverJson = await coverResponse.json();
    const coverOutput = JSON.parse(coverJson.output);

    const { title, description, keywords, questions } = coverOutput;
    console.log(keywords);
    setCoverTitle(title);
    setCoverDescription(description);
    setQuestions(questions);

    const videoResponse = await fetch('/api/video', {
      method: 'POST',
      body: JSON.stringify({ keywords }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const { videoLink } = await videoResponse.json();
    setVideoLink(videoLink);
    setIsGenerated(true);
  };

  const generateQuestion = async ({ lastQuestion, response }) => {
    const questionResponse = await fetch('/api/question', {
      method: 'POST',
      body: JSON.stringify({
        coverTitle,
        coverDescription,
        question: lastQuestion,
        response,
        nextQuestion: questions[questionIndex + 1],
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const questionJson = await questionResponse.json();
    console.log(questionJson);
    const { question, pass, keywords } = JSON.parse(questionJson.output);

    const videoResponse = await fetch('/api/video', {
      method: 'POST',
      body: JSON.stringify({ keywords }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const { videoLink } = await videoResponse.json();
    setVideoLink(videoLink);

    setCurrentQuestion(question);
    if (pass) {
      setResponses([...responses, response]);
      setQuestionIndex(questionIndex + 1);
      setVideoLink(videoLink);
    }
  };

  if (!isGenerated) {
    return (
      <div>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Describe the form you want to generate
        </h3>
        <Textarea ref={promptRef} />
        <Button onClick={generateForm}>Generate Form</Button>
      </div>
    );
  } else if (questionIndex === 0) {
    return (
      <CoverPage
        title={coverTitle}
        description={coverDescription}
        videoLink={videoLink}
        onClickStart={() => {
          generateQuestion({
            question: '',
            response: '',
            nextQuestion: questions[0],
          });
        }}
      />
    );
  } else {
    return (
      <QuestionPage
        question={currentQuestion}
        videoLink={videoLink}
        onClickNext={generateQuestion}
      />
    );
  }
}
