'use client';
import Image from "next/image";
import { useState, useRef, useEffect } from 'react';
import AudioTranscriber from "../components/AudioTranscriber";
import CoverPage from '@/components/CoverPage';
import QuestionPage from '@/components/QuestionPage';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

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

    const [coverVideoLink, setCoverVideoLink] = useState('');
    const [audioUrl, setAudioUrl] = useState('');
    const audioRef = useRef(new Audio());

    useEffect(() => {
        // This effect updates the source of the audio whenever audioUrl changes
        if (audioUrl) {
            const currentAudio = audioRef.current;
            currentAudio.src = audioUrl;
            currentAudio.play()
                .catch(error => console.error('Error playing the audio file:', error));
        }

        return () => {
            // Clean up the audio if the component unmounts or url changes
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        };
    }, [audioUrl]);

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
  
  const handleTextToSpeech = async () => {
        const defaultText = "I shall be telling this with a sigh\n" +
            "Somewhere ages and ages hence:\n" +
            "Two roads diverged in a wood, and I—\n" +
            "I took the one less traveled by,\n" +
            "And that has made all the difference.";

        try {
            const response = await fetch('/api/speech', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: defaultText})
            });

            if (!response.ok) {
                console.error('Network response was not ok');
            }

            const data = await response.json();

            // Optionally: Handle the speech file URL (e.g., play it or display it)
            if (data.fileUrl) {
                setAudioUrl(data.fileUrl);
            } else {
                console.error('Failed to load the audio file:', data.error);
            }
        }
        catch (error) {
            console.error('Failed to fetch:', error);
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
