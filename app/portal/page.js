'use client';

import Header from '@/components/Header';
import { useState } from 'react';
import React from 'react';

function FormCard({ image, title, responses }) {
  return (
    <div className="flex flex-col p-2">
      <img
        loading="lazy"
        src={image}
        alt=""
        className="w-full max-w-xs h-20 object-contain rounded"
      />
      <div className="mt-9 text-base font-semibold leading-4 text-gray-900">
        {title}
      </div>
    </div>
  );
}

function PatientCard({ name, forms }) {
  return (
    <div className="flex items-center p-2">
      <div className="w-10 h-10 bg-gray-700 rounded-full mr-2"></div>
      <div className="text-sm">
        {name} - {forms} Forms
      </div>
    </div>
  );
}

export default function MyComponent() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(''); // State to store the model's response

  const formData = [
    {
      image:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/d492fd6c204d4201ac7000212a5da821902a320dbda32c5ad84fd81d2b24aace?apiKey=4cd313e52a54443281316348492870be&',
      title: 'Patient 1 Week 2 Response',
      responses: 89,
    },
    {
      image:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/8bd4d1f81093258b8f5e6d35accd8342013c7f5d6e740c54effc4368e1c11883?apiKey=4cd313e52a54443281316348492870be&',
      title: 'Patient 1 Week 4 Response',
      responses: 89,
    },
  ];

  const patientData = [
    { name: 'Jeffrey Yu', forms: 5 },
    { name: 'Matthew Yang', forms: 10 },
    { name: 'Sarah Kim', forms: 7 },
  ];

  const handleGenerate = async (userQuery) => {
    const questionResponse = await fetch('/api/query', {
      method: 'POST',
      body: JSON.stringify({
        userQuery,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Generate');

    const output = await questionResponse.json();

    try {
      setResponse(output);
    } catch (error) {
      setResponse('Error from model.');
    }
    setQuery('');
  };

  return (
    <div className="flex flex-col bg-white h-screen">
      {' '}
      {/* Ensure the root div takes up full screen height */}
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {' '}
        {/* Flex container for content with overflow handling */}
        <div className="flex flex-col w-1/4 p-2 overflow-auto">
          {' '}
          {/* Reduced padding and set overflow */}
          <h2 className="text-xl font-bold">Needs Attention</h2>
          {formData.map((form, index) => (
            <FormCard key={index} {...form} />
          ))}
          <h2 className="text-xl font-bold mt-4">Patients</h2>
          {patientData.map((patient, index) => (
            <PatientCard key={index} {...patient} />
          ))}
        </div>
        <div className="flex flex-col w-3/4 p-2 overflow-auto">
          {' '}
          {/* Adjusted width and overflow handling */}
          {response ? (
            <div className="p-4 bg-gray-100 rounded-lg">
              <h3 className="text-lg font-semibold">Query Response:</h3>
              <p>{response}</p>
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <h2 className="text-4xl font-bold">Ask a MedAi question</h2>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/2483d5158eae0eb98e480ad247181176ded133512583481e79aadbb678a5da0d?apiKey=4cd313e52a54443281316348492870be&"
                alt=""
                className="mt-9 aspect-square scale-10"
              />
            </div>
          )}
          <form className="flex items-center gap-2 mt-auto">
            <input
              type="text"
              placeholder="Type a question"
              className="flex-1 p-2 text-gray-500 border rounded"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleGenerate(query);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded"
            >
              Get Answer!
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
