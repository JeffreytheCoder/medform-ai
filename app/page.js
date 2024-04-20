'use client';
import { useState, useRef, useEffect } from 'react';
import CoverPage from '@/components/CoverPage';
import QuestionPage from '@/components/QuestionPage';
import { Button } from '@/components/ui/button';

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
  const [currentFeedback, setCurrentFeedback] = useState('');
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
    setQuestionIndex(0);
    // checkpoint: questions properly set here

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
      // console.log('index: ', questionIndex);
      // console.log('questions length: ', questions.length);
      // console.log(questions);
    const questionResponse = await fetch('/api/question', {
      method: 'POST',
      body: JSON.stringify({
        coverTitle,
        coverDescription,
        question: lastQuestion,
        response,
        nextQuestion:
          questionIndex <= questions.length - 1
            ? questions[questionIndex]
            : 'There is no next question.',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const questionJson = await questionResponse.json();


    const { feedback, question, pass, keywords } = questionJson;
    

    setCurrentQuestion(question);
    if (questionIndex !== 0) {
        setCurrentFeedback(feedback);
    }

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
  };



  if (!isGenerated) {
    return (
      <div>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Describe the form you want to generate
        </h3>
        <textarea ref={promptRef} />
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
          feedback={currentFeedback}
        question={currentQuestion}
        videoLink={videoLink}
        onClickNext={generateQuestion}
      />
    );
  }
}
