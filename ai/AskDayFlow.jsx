import { useState } from "react";
import "./AskDayflow.css";

const employeeId = 1;

function AskDayflow() {

  const [question, setQuestion] = useState("");

  const [messages, setMessages] = useState([
    {
      sender: "dayflow",
      text: "Hi! I'm Dayflow 🤖. Ask me about attendance, leave, or your workday."
    }
  ]);


  // -----------------------------
  // ASK DAYFLOW
  // -----------------------------

  const askDayflow = async () => {

    if (!question.trim()) {
      return;
    }

    const userQuestion =
      question.trim();

    setMessages(previous => [
      ...previous,
      {
        sender: "user",
        text: userQuestion
      }
    ]);

    setQuestion("");


    // -----------------------------
    // BASIC INTELLIGENCE
    // -----------------------------

    let answer =
      "I can currently help with attendance, leave balance, and check-in questions.";


    const text =
      userQuestion.toLowerCase();


    // LEAVE

    if (
      text.includes("leave") ||
      text.includes("holiday")
    ) {

      try {

        const response =
          await fetch(
            `http://localhost:5000/api/leave/${employeeId}`
          );

        const data =
          await response.json();

        answer =
          `You currently have ${data.leave_balance} leave days remaining. 🌴`;

      } catch {

        answer =
          "I couldn't retrieve your leave balance right now.";

      }

    }


    // ATTENDANCE

    else if (
      text.includes("attendance") ||
      text.includes("present")
    ) {

      try {

        const response =
          await fetch(
            `http://localhost:5000/api/attendance/${employeeId}`
          );

        const data =
          await response.json();

        if (data.length === 0) {

          answer =
            "You don't have any attendance records yet today.";

        } else {

          const latest =
            data[data.length - 1];

          if (latest.check_out) {

            answer =
              "You've completed your latest work session. Great work today! 🌆";

          } else {

            answer =
              "You're currently checked in and your workday is active. 🟢";

          }

        }

      } catch {

        answer =
          "I couldn't retrieve your attendance information.";

      }

    }


    // CHECK IN

    else if (
      text.includes("check in") ||
      text.includes("check-in")
    ) {

      answer =
        "You can check in from your Employee Dashboard. Just click the Check In button. 🟢";

    }


    // CHECK OUT

    else if (
      text.includes("check out") ||
      text.includes("check-out")
    ) {

      answer =
        "When you're finished for the day, use the Check Out button on your dashboard. 🌆";

    }


    // HELLO

    else if (
      text.includes("hello") ||
      text.includes("hi") ||
      text.includes("hey")
    ) {

      answer =
        "Hello! 👋 How can I help with your Dayflow today?";

    }


    // DEFAULT

    else {

      answer =
        "I'm still learning! Try asking me about your leave balance, attendance, check-in, or check-out.";

    }


    setMessages(previous => [
      ...previous,
      {
        sender: "dayflow",
        text: answer
      }
    ]);

  };


  // -----------------------------
  // ENTER KEY
  // -----------------------------

  const handleKeyDown = (event) => {

    if (event.key === "Enter") {
      askDayflow();
    }

  };


  // -----------------------------
  // UI
  // -----------------------------

  return (

    <section className="ask-dayflow">

      <div className="ai-header">

        <div className="ai-icon">
          🤖
        </div>

        <div>

          <span className="eyebrow">
            DAYFLOW INTELLIGENCE
          </span>

          <h1>
            Ask Dayflow
          </h1>

          <p>
            Your intelligent HR companion.
          </p>

        </div>

      </div>


      {/* CHAT */}

      <div className="chat">

        {messages.map(
          (message, index) => (

            <div
              key={index}
              className={`chat-message ${message.sender}`}
            >

              {message.sender === "dayflow" && (
                <div className="message-avatar">
                  🤖
                </div>
              )}

              <div className="message-bubble">

                {message.text}

              </div>

            </div>

          )
        )}

      </div>


      {/* INPUT */}

      <div className="chat-input">

        <input
          type="text"
          value={question}
          onChange={
            event =>
              setQuestion(event.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Ask about leave, attendance..."
        />

        <button onClick={askDayflow}>
          Ask →
        </button>

      </div>


      {/* SUGGESTIONS */}

      <div className="suggestions">

        <button
          onClick={() =>
            setQuestion(
              "How many leave days do I have?"
            )
          }
        >
          🌴 My leave balance
        </button>

        <button
          onClick={() =>
            setQuestion(
              "What is my attendance?"
            )
          }
        >
          📊 My attendance
        </button>

        <button
          onClick={() =>
            setQuestion(
              "How do I check in?"
            )
          }
        >
          🟢 How do I check in?
        </button>

      </div>

    </section>

  );

}

export default AskDayflow;
