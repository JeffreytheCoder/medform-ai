'use client';
import { useRef, useEffect, useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { Button } from './ui/button';
import AudioTranscriber from './AudioTranscriber';
import { Textarea } from './ui/textarea';

export default function QuestionPage({
  feedback,
  question,
  videoLink,
  onClickNext,
  remainingQuestions,
}) {
  const responseRef = useRef();

  const displayText = feedback + '\n\n' + question;
  const submittedText =
    'Thank you for your response! We wish you the best of luck in your recovery!';
  const [submitted, setSubmitted] = useState(false);

  const [audioUrl, setAudioUrl] = useState('');
  const audioRef = useRef(new Audio());

  const updateResponse = (response) => {
    responseRef.current.value = (
      responseRef.current.value +
      ' ' +
      response
    ).trim();
  };

  useEffect(() => {
    if (audioUrl) {
      const currentAudio = audioRef.current;
      currentAudio.src = audioUrl;
      currentAudio
        .play()
        .catch((error) =>
          console.error('Error playing the audio file:', error)
        );
    }

    return () => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    };
  }, [audioUrl]);

  const handleTextToSpeech = async (text) => {
    try {
      const response = await fetch('/api/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        console.error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);

      if (data.fileUrl) {
        setAudioUrl(data.fileUrl);
      } else {
        console.error('Failed to load the audio file:', data.error);
      }
    } catch (error) {
      console.error('Failed to fetch:', error);
    }
  };

  useEffect(() => {
    handleTextToSpeech(!submitted ? displayText : submittedText);
  }, [question, submitted]);

  // function for submit
  const handleSubmit = () => {
    console.log('Form submitted.');
    setSubmitted(true);
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <video
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: '0',
          left: '0',
          objectFit: 'cover',
          zIndex: '-1',
        }}
        autoPlay
        muted
        loop
        src={videoLink}
      />
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: '1',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          zIndex: '2',
          width: '50%',
        }}
      >
        {!submitted ? (
          <>
            <TypeAnimation
              key={question}
              cursor
              sequence={[displayText]}
              wrapper="h3"
              speed={30}
              className="scroll-m-20 text-2xl tracking-tight"
              style={{ whiteSpace: 'pre-line' }}
            />

            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                margin: '30px 0',
              }}
            >
              <Textarea
                style={{ width: '100%' }}
                ref={responseRef}
                key={question}
                placeholder="Answer here"
              />
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'center',
                gap: '10px',
              }}
            >
              <AudioTranscriber updateResponse={updateResponse} />

              {remainingQuestions > 0 && (
                <Button
                  size="lg"
                  className="text-xl bg-indigo-600 p-6"
                  onClick={() => {
                    console.log(question, responseRef.current.value);
                    onClickNext(question, responseRef.current.value);
                  }}
                >
                  Next
                </Button>
              )}

              {remainingQuestions <= 0 && (
                <Button
                  size="lg"
                  className="text-xl bg-indigo-600 p-6"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              )}
            </div>
          </>
        ) : (
          <>
            <TypeAnimation
              cursor
              sequence={[submittedText]}
              wrapper="h3"
              speed={30}
              className="scroll-m-20 text-2xl tracking-tight"
            />
          </>
        )}
      </div>
    </div>
  );
}
