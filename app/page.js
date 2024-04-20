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
  const [completed, setCompleted] = useState(false);

  const generateForm = async () => {
    const prompt = promptRef.current.value;
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
        nextQuestion:
          questionIndex === questions.length - 1
            ? questions[questionIndex + 1]
            : 'There is no next question.',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const questionJson = await questionResponse.json();
    const { question, pass, keywords } = JSON.parse(questionJson.output);

    setCurrentQuestion(question);
    if (pass) {
      if (questionIndex === questions.length - 1) {
        setCompleted(true);
        return;
      }

      setResponses([...responses, response]);
      setQuestionIndex(questionIndex + 1);

      const videoResponse = await fetch('/api/video', {
        method: 'POST',
        body: JSON.stringify({ keywords }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const { videoLink } = await videoResponse.json();
      setVideoLink(videoLink);
    }
    console.log(questionIndex);
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
