'use client';

import { useState, useRef, useEffect } from 'react';
import React from 'react';

function SearchBar() {
    return (
        <div className="flex gap-4 px-3.5 py-3 text-sm rounded-lg bg-slate-100 text-stone-400 max-md:flex-wrap">
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/9d0880f9939604e272c310f2bfb114fc37bdd158a2109794b2f9fb36cf3ee44e?apiKey=4cd313e52a54443281316348492870be&" alt="" className="shrink-0 w-4 aspect-square" />
            <div className="flex-auto max-md:max-w-full">
                Search for forms or patients
            </div>
        </div>
    );
}

function UserProfile() {
    return (
        <div className="flex gap-1">
            <div className="shrink-0 w-10 h-10 rounded-full bg-zinc-800" />
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/dc903e0facbe926c61378067200902835c5bf21c37a7db46f12d5a0728b68ff9?apiKey=4cd313e52a54443281316348492870be&" alt="" className="shrink-0 my-auto w-4 aspect-square" />
        </div>
    );
}

function FormCard({ image, title, responses }) {
    return (
        <div className="flex flex-col grow px-3.5 py-7 w-full rounded-lg border border-gray-200 border-solid bg-slate-50 max-md:mt-6">
            <img loading="lazy" src={image} alt="" className="self-center max-w-full shadow-md aspect-[1.61] w-[146px]" />
            <div className="mt-9 text-base font-semibold leading-4 text-gray-900">
                {title}
            </div>
            <div className="mt-4 text-xs leading-4 text-slate-500">
                {responses} Response{responses !== 1 ? "s" : ""}
            </div>
        </div>
    );
}

function PatientCard({ name, forms }) {
    return (
        <div className="flex gap-5 items-start self-start mt-14 font-bold max-md:mt-10">
            <div className="shrink-0 w-10 h-10 rounded-full bg-zinc-800" />
            <div className="flex flex-col mt-2">
                <div className="text-3xl text-zinc-900">{name}</div>
                <div className="mt-3.5 text-base text-zinc-400">{forms} Forms</div>
            </div>
        </div>
    );
}

export default function MyComponent() {
    const [query, setQuery] = useState("");

    const formData = [
        {
            image: "https://cdn.builder.io/api/v1/image/assets/TEMP/d492fd6c204d4201ac7000212a5da821902a320dbda32c5ad84fd81d2b24aace?apiKey=4cd313e52a54443281316348492870be&",
            title: "Symptom Assessment Form",
            responses: 89,
        },
        {
            image: "https://cdn.builder.io/api/v1/image/assets/TEMP/8bd4d1f81093258b8f5e6d35accd8342013c7f5d6e740c54effc4368e1c11883?apiKey=4cd313e52a54443281316348492870be&",
            title: "Pain Scale Form",
            responses: 89,
        },
        {
            image: "https://cdn.builder.io/api/v1/image/assets/TEMP/07c6531f0900cb2b903120ed2ee46cdc42259a9896ae5a8389ab2f662a66a61a?apiKey=4cd313e52a54443281316348492870be&",
            title: "ASL Injury Question",
            responses: 32,
        },
    ];

    const patientData = [
        { name: "Patient Name", forms: 5 },
        { name: "Patient Name", forms: 10 },
        { name: "Patient Name", forms: 7 },
        { name: "Patient Name", forms: 7 },
    ];

    const handleGenerate = (userQuery) => {
        console.log("Generate");
        console.log(userQuery);
        setQuery("");
    }

    return (
        <div className="flex flex-col bg-white">
            <header className="flex gap-5 justify-between px-20 py-5 w-full bg-white shadow-sm max-md:flex-wrap max-md:px-5 max-md:max-w-full">
                <SearchBar />
                <div className="flex gap-5 justify-between">
                    <nav className="flex gap-5 justify-between my-auto text-xl whitespace-nowrap">
                        <div className="font-medium text-zinc-400">Forms</div>
                        <div className="font-semibold text-indigo-600">Dashboard</div>
                    </nav>
                    <UserProfile />
                </div>
            </header>
            <main className="flex gap-5 justify-between items-end self-center mt-28 w-full max-w-[1608px] max-md:flex-wrap max-md:mt-10 max-md:max-w-full">
                <section className="flex flex-col self-start max-md:max-w-full">
                    <h2 className="text-3xl font-bold text-zinc-900 max-md:max-w-full">
                        Needs attention (3)
                    </h2>
                    <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/02a22b78f76b7db7e72749dd34b21d1819382f462291f7fec5e485c91f912697?apiKey=4cd313e52a54443281316348492870be&" alt="" className="self-center mt-8 border-2 border-solid aspect-[100] border-stone-200 stroke-[2.19px] stroke-stone-200 w-[735px] max-md:max-w-full" />
                    <div className="flex gap-5 justify-between mt-9 max-md:flex-wrap max-md:max-w-full">
                        <h2 className="text-3xl font-bold text-zinc-900">Forms</h2>
                        <a href="#" className="self-start text-xl font-medium text-indigo-600 underline">
                            See all
                        </a>
                    </div>
                    <div className="mt-8 max-md:max-w-full">
                        <div className="flex gap-5 max-md:flex-col max-md:gap-0">
                            {formData.map((form, index) => (
                                <div key={index} className={`flex flex-col ${index > 0 ? "ml-5" : ""} w-[33%] max-md:ml-0 max-md:w-full`}>
                                    <FormCard {...form} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-5 mt-12 max-md:flex-wrap max-md:mt-10 max-md:max-w-full">
                        <h2 className="flex-auto text-3xl font-bold text-zinc-900">
                            Patients
                        </h2>
                        <a href="#" className="self-start text-xl font-medium text-indigo-600 underline">
                            See all
                        </a>
                    </div>
                    {patientData.map((patient, index) => (
                        <React.Fragment key={index}>
                            {index === 1 && (
                                <div className="flex gap-5 self-start mt-14 text-3xl font-bold text-zinc-900 max-md:mt-10">
                                    <div className="shrink-0 w-10 h-10 rounded-full bg-zinc-800" />
                                    <div className="my-auto">{patient.name}</div>
                                </div>
                            )}
                            {index === 1 && (
                                <div className="self-start ml-16 text-base font-bold text-zinc-400 max-md:ml-2.5">
                                    {patient.forms} Forms
                                </div>
                            )}
                            {index !== 1 && <PatientCard {...patient} />}
                        </React.Fragment>
                    ))}
                </section>
                <aside className="flex flex-col justify-center py-20 mt-16 rounded-xl bg-slate-50 max-md:hidden max-md:mt-10">
                    <div className="shrink-0 rounded-2xl bg-zinc-400 h-[276px] max-md:hidden" />
                </aside>
                <section className="flex gap-5 items-start mt-14 max-md:flex-wrap max-md:mt-10 max-md:max-w-full">
                    <div className="flex flex-col grow shrink-0 items-center basis-0 w-fit max-md:max-w-full">
                        <h2 className="text-3xl font-bold text-zinc-900">
                            Ask a MedAi question
                        </h2>
                        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/2483d5158eae0eb98e480ad247181176ded133512583481e79aadbb678a5da0d?apiKey=4cd313e52a54443281316348492870be&" alt="" className="mt-9 aspect-square w-[43px]" />
                        <form className="flex gap-5 justify-end self-stretch px-6 py-3 text-2xl font-medium bg-slate-50 mt-[599px] rounded-[54.885px] max-md:flex-wrap max-md:pl-5 max-md:mt-10 max-md:max-w-full">
                            <label htmlFor="question" className="sr-only">Type a question</label>
                            <input
                                type="text"
                                id="question"
                                placeholder="Type a question"
                                aria-label="Type a question"
                                className="flex-auto my-auto text-zinc-400"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                            />
                            <button type="submit"
                                    onClick={(e) => {
                                        e.preventDefault();  // Prevent form submission
                                        handleGenerate(query);
                                    }}
                                    className="flex flex-col flex-1 justify-center px-5 py-3 text-white whitespace-nowrap bg-indigo-600 rounded-[54.885px]">
                                <div className="flex gap-2 justify-between">
                                    <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/901c9393d8537d59bbfd4280b398a43c9c4d713fe8fed32f6a9a2dc9da8bcda1?apiKey=4cd313e52a54443281316348492870be&" alt="" className="shrink-0 self-start aspect-square w-[27px]" />
                                    <span>Generate</span>
                                </div>
                            </button>
                        </form>
                    </div>
                    <aside className="flex flex-col justify-center py-20 mt-1 rounded-xl bg-slate-50 max-md:hidden">
                        <div className="shrink-0 rounded-2xl bg-zinc-400 h-[276px] max-md:hidden" />
                    </aside>
                </section>
            </main>
        </div>
    );
}