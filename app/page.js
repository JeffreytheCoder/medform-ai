'use client';
import CoverPage from '@/components/CoverPage';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useRef, useState } from 'react';

export default function Home() {
  const promptRef = useRef();
  const [isGenerated, setIsGenerated] = useState(false);
  const [coverTitle, setCoverTitle] = useState('');
  const [coverDescription, setCoverDescription] = useState('');
  const [coverVideoLink, setCoverVideoLink] = useState('');

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

    const { title, description, keywords } = coverOutput;
    console.log(keywords);
    setCoverTitle(title);
    setCoverDescription(description);

    const videoResponse = await fetch('/api/video', {
      method: 'POST',
      body: JSON.stringify({ keywords }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const { videoLink } = await videoResponse.json();
    setCoverVideoLink(videoLink);
    setIsGenerated(true);
  };

  return (
    <div>
      {!isGenerated ? (
        <div>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Describe the form you want to generate
          </h3>
          <Textarea ref={promptRef} />
          <Button onClick={generateForm}>Generate Form</Button>
        </div>
      ) : (
        <CoverPage
          title={coverTitle}
          description={coverDescription}
          videoLink={coverVideoLink}
        />
      )}
    </div>
  );
}
``;
