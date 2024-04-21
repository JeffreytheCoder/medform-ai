import { useState } from 'react';

function Header() {
  return (
    <header className="flex gap-5 self-stretch px-20 py-5 w-full bg-white shadow-sm max-md:flex-wrap max-md:px-5 max-md:max-w-full">
      <nav className="flex gap-5 justify-between my-auto text-xl whitespace-nowrap">
        <div className="font-semibold text-indigo-600">Forms</div>
        <div className="font-medium text-zinc-400">Dashboard</div>
      </nav>
      <div className="flex gap-1">
        <div className="shrink-0 w-10 h-10 rounded-full bg-zinc-800" />
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/cd70ac8adfcef8cea219ee03e79c8772b66ef174307aaf1e03b5a119a899d568?apiKey=4cd313e52a54443281316348492870be&"
          alt=""
          className="shrink-0 my-auto w-4 aspect-square"
        />
      </div>
    </header>
  );
}

function HeroImage() {
  return (
    <img
      loading="lazy"
      src="https://cdn.builder.io/api/v1/image/assets/TEMP/40d3f5bef4c1c0b3f854c02c193b2327339f8d33c78a1fc7c32de52512aa2fb5?apiKey=4cd313e52a54443281316348492870be&"
      alt=""
      className="mt-40 max-w-full aspect-[3.23] w-[330px] max-md:mt-10"
    />
  );
}

function HeroText() {
  return (
    <div style={{ width: '40%' }}>
      <h2 className="text-2xl font-medium text-center text-neutral-800 max-md:mt-10 max-md:max-w-full">
        Ask the right questions to reveal a deeper insight into your patients'
        conditions
      </h2>
    </div>
  );
}

function GenerateForm({ promptRef, generateForm }) {
  const [loading, setLoading] = useState(false);

  return (
    <form className="flex gap-5 justify-end px-7 py-3.5 mt-10 max-w-full text-xl font-medium bg-slate-50 rounded-[67.044px] w-[814px] max-md:flex-wrap max-md:px-5 max-md:mt-10">
      <input
        type="text"
        id="formDescription"
        aria-label="Describe the form to generate"
        placeholder="Describe the form to generate"
        className="flex-auto my-auto focus:outline-none bg-slate-50 text-neutral-800 px-2"
        ref={promptRef}
      />
      <button
        type="submit"
        className="flex flex-col justify-center px-6 py-3.5 text-white whitespace-nowrap bg-indigo-600 rounded-[67.044px] max-md:px-5"
        onClick={(e) => {
          e.preventDefault();
          setLoading(true);
          generateForm();
        }}
      >
        <div className="flex gap-2.5 justify-between">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/15e368df264dc012e629f319afb49e017a3cbeb3830f16e2a0f199b3d1d3525e?apiKey=4cd313e52a54443281316348492870be&"
            alt=""
            className="shrink-0 aspect-[0.97] w-[25px]"
          />
          <span>{loading ? 'Generating...' : 'Generate'}</span>
        </div>
      </button>
    </form>
  );
}

function GeneratePage({ promptRef, generateForm }) {
  return (
    <main className="flex flex-col items-center pb-20 bg-white">
      <Header />
      <HeroImage />
      <HeroText />
      <GenerateForm promptRef={promptRef} generateForm={generateForm} />
    </main>
  );
}

export default GeneratePage;
