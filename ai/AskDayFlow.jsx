import { useState } from "react";
import "./AskDayflow.css";

const API_URL =
  "http://localhost:5000";

const employeeId = 1;

function AskDayflow() {

  const [question, setQuestion] =
    useState("");

  const [messages, setMessages] =
    useState([
      {
        sender: "dayflow",
        text:
          "Hi! I'm Dayflow 🤖. I can help you understand your HR information."
      }
    ]);

  const [thinking, setThinking] =
    useState(false);


  // =====================================================
  // ADD MESSAGE
  // =====================================================

  const addMessage = (
    sender,
    text
  ) => {

    setMessages(previous => [
      ...previous,
      {
        sender,
        text
      }
    ]);

  };


  // =====================================================
  // ASK DAYFLOW
  // =====================================================

  const askDayflow = async () => {

    if (!question.trim()) {
      return;
    }

    const userQuestion =
      question.trim();

    addMessage(
      "user",
      userQuestion
    );

    setQuestion("");

    setThinking(true);


    let answer = "";


    try {

      const text =
        userQuestion.toLowerCase();


      // -----------------------------------------------
      // LEAVE
      // -----------------------------------------------

      if (
        text.includes("leave") ||
        text.includes("holiday")
      ) {

        const response =
          await fetch(
            `${API_URL}/api/leave/${employeeId}`
          );

        const data =
          await response.json();


        if (
          text.includes("balance") ||
          text.includes("days")
        ) {

          answer =
            `You currently have ${data.leave_balance} leave days available. 🌴`;

        } else {

          answer =
            `Your current leave balance is ${data.leave_balance} days. You can apply for leave from your Employee Dashboard.`;

        }

      }


      // -----------------------------------------------
      // ATTENDANCE
      // -----------------------------------------------

      else if (
        text.includes("attendance") ||
        text.includes("present") ||
        text.includes("working")
      ) {

        const response =
          await fetch(
            `${API_URL}/api/attendance/${employeeId}`
          );

        const data =
          await response.json();


        if (data.length === 0) {

          answer =
            "You don't have any attendance records yet.";

        } else {

          const latest =
            data[data.length - 1];


          if (
            latest.check_in &&
            !latest.check_out
          ) {

            answer =
              "You're currently checked in and your workday is active. 🟢";

          } else {

            answer =
              "Your latest attendance session has been completed. 🌆";

          }

        }

      }


      // -----------------------------------------------
      // CHECK IN
      // -----------------------------------------------

      else if (
        text.includes("check in") ||
        text.includes("check-in")
      ) {

        answer =
          "You can check in from your Employee Dashboard. Click the Check In button when you start working. 🟢";

      }


      // -----------------------------------------------
      // CHECK OUT
      // -----------------------------------------------

      else if (
        text.includes("check out") ||
        text.includes("check-out")
      ) {

        answer =
          "When your workday is complete, use the Check Out button on your Employee Dashboard. 🌆";

      }


      // -----------------------------------------------
      // LEAVE APPLICATION
      // -----------------------------------------------

      else if (
        text.includes("apply") &&
        text.includes("leave")
      ) {

        answer =
          "To apply for leave, open the Leave tab on your Employee Dashboard, select your leave type and dates, then submit your request. 🌴";

      }


      // -----------------------------------------------
      // HELP
      // -----------------------------------------------

      else if (
        text.includes("help") ||
        text.includes("what can you do")
      ) {

        answer =
          "I can currently help with your leave balance, attendance, check-in, check-out, and leave application process. 🤖";

      }


      // -----------------------------------------------
      // GREETING
      // -----------------------------------------------

      else if (
        text.includes("hello") ||
        text.includes("hi") ||
        text.includes("hey")
      ) {

        answer =
          "Hello! 👋 What would you like to know about your workday?";

      }


      // -----------------------------------------------
      // UNKNOWN
      // -----------------------------------------------

      else {

        answer =
          "I'm still learning that area. Try asking about your leave balance, attendance, check-in, or leave application.";

      }


    } catch {

      answer =
        "I couldn't connect to the Dayflow HR system right now. Please try again.";

    }


    setThinking(false);


    addMessage(
      "dayflow",
      answer
    );

  };


  // =====================================================
  // ENTER
  // =====================================================

  const handleKeyDown =
    event => {

      if (
        event.key === "Enter"
      ) {

        askDayflow();

      }

    };


  // =====================================================
  // UI
  // =====================================================

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
              className={
                `chat-message ${message.sender}`
              }
            >

              {message.sender ===
                "dayflow" && (

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


        {thinking && (

          <div className="chat-message dayflow">

            <div className="message-avatar">
              🤖
            </div>

            <div className="thinking">

              <span></span>
              <span></span>
              <span></span>

            </div>

          </div>

        )}

      </div>


      {/* INPUT */}

      <div className="chat-input">

        <input

          type="text"

          value={question}

          onChange={
            event =>
              setQuestion(
                event.target.value
              )
          }

          onKeyDown={
            handleKeyDown
          }

          placeholder=
            "Ask about leave, attendance..."

        />

        <button
          onClick={
            askDayflow
          }
        >
          Ask →
        </button>

      </div>


      {/* QUICK QUESTIONS */}

      <div className="suggestions">

        <button
          onClick={() =>
            setQuestion(
              "How many leave days do I have?"
            )
          }
        >
          🌴 Leave balance
        </button>

        <button
          onClick={() =>
            setQuestion(
              "What is my attendance?"
            )
          }
        >
          📊 Attendance
        </button>

        <button
          onClick={() =>
            setQuestion(
              "How do I apply for leave?"
            )
          }
        >
          📝 Apply for leave
        </button>

        <button
          onClick={() =>
            setQuestion(
              "How do I check in?"
            )
          }
        >
          🟢 Check in
        </button>

      </div>

    </section>

  );

}

export default AskDayflow;
