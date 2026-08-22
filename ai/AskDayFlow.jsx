// ai/AskDayflow.jsx

import { useState } from "react";

function AskDayflow() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");

  const askDayflow = () => {
    if (!question.trim()) return;

    setResponse(
      "I'm learning your workplace data. Ask me about attendance, leave, or your team."
    );
  };

  return (
    <section className="ask-dayflow">

      <h1>🤖 Ask Dayflow</h1>

      <p>
        Your intelligent HR assistant.
      </p>

      <input
        type="text"
        placeholder="Ask something..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button onClick={askDayflow}>
        Ask Dayflow
      </button>

      {response && (
        <div className="response">
          <p>{response}</p>
        </div>
      )}

    </section>
  );
}

export default AskDayflow;
