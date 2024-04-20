'use client';
import { useRef } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

export default function QuestionPage({ question, videoLink, onClickNext }) {
  const responseRef = useRef();
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
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
          textAlign: 'center',
          zIndex: '2',
        }}
      >
        <TypeAnimation
          key={question}
          style={{ margin: '30px 0' }}
          cursor
          sequence={[question]}
          wrapper="h3"
          className="scroll-m-20 text-2xl tracking-tight"
        />
        <Textarea ref={responseRef} />
        <Button
          onClick={() => onClickNext(question, responseRef.current.value)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
