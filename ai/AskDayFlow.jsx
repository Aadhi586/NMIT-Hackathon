import { useEffect, useState } from "react";
import "./AskDayflow.css";

const API_URL =
  "http://localhost:5000";

const EMPLOYEE_ID = 1;


function AskDayFlow() {

  const [messages, setMessages] =
    useState([
      {
        sender: "dayflow",
        text:
          "Hi! I'm Dayflow. Ask me anything about your workday."
      }
    ]);

  const [question, setQuestion] =
    useState("");

  const [thinking, setThinking] =
    useState(false);

  const [notifications, setNotifications] =
    useState([]);

  const [stats, setStats] =
    useState({
      leave: 0,
      attendance: 0
    });


  /* =====================================================
     LOAD INTELLIGENCE DATA
  ===================================================== */

  const loadData = async () => {

    try {

      const [
        leaveResponse,
        attendanceResponse,
        notificationResponse
      ] = await Promise.all([

        fetch(
          `${API_URL}/api/leave/${EMPLOYEE_ID}`
        ),

        fetch(
          `${API_URL}/api/attendance/${EMPLOYEE_ID}`
        ),

        fetch(
          `${API_URL}/api/notifications/${EMPLOYEE_ID}`
        )

      ]);


      const leave =
        await leaveResponse.json();

      const attendance =
        await attendanceResponse.json();

      const notificationData =
        await notificationResponse.json();


      setStats({
        leave:
          leave.leave_balance || 0,

        attendance:
          attendance.length
      });


      setNotifications(
        notificationData.notifications ||
        []
      );

    } catch (error) {

      console.error(error);

    }

  };


  useEffect(() => {

    loadData();

  }, []);


  /* =====================================================
     RESPONSE ENGINE
  ===================================================== */

  const getResponse = async text => {

    const query =
      text.toLowerCase();


    /* LEAVE */

    if (
      query.includes("leave") ||
      query.includes("holiday")
    ) {

      const response =
        await fetch(
          `${API_URL}/api/leave/${EMPLOYEE_ID}`
        );

      const data =
        await response.json();


      if (
        query.includes("balance") ||
        query.includes("how many") ||
        query.includes("days")
      ) {

        return (
          `You currently have ${data.leave_balance} leave days available. 🌴`
        );

      }


      return (
        `Your current leave balance is ${data.leave_balance} days. You can submit a request from the Leave Center.`
      );

    }


    /* ATTENDANCE */

    if (
      query.includes("attendance") ||
      query.includes("present") ||
      query.includes("working")
    ) {

      const response =
        await fetch(
          `${API_URL}/api/attendance/${EMPLOYEE_ID}`
        );

      const data =
        await response.json();


      const active =
        data.some(
          record =>
            record.check_in &&
            !record.check_out
        );


      if (active) {

        return (
          "You're currently checked in and your workday is active. 🟢"
        );

      }


      if (data.length === 0) {

        return (
          "I don't have any attendance records for you yet."
        );

      }


      return (
        `You have ${data.length} recorded work sessions so far.`
      );

    }


    /* CHECK IN */

    if (
      query.includes("check in") ||
      query.includes("start my day")
    ) {

      return (
        "Start your workday from the Employee Dashboard by pressing 'Start My Day'. I'll keep your attendance flow connected. 🚀"
      );

    }


    /* CHECK OUT */

    if (
      query.includes("check out") ||
      query.includes("finish")
    ) {

      return (
        "When you're done for today, use 'Finish Day' on your dashboard. 🌆"
      );

    }


    /* PROFILE */

    if (
      query.includes("profile") ||
      query.includes("department") ||
      query.includes("role")
    ) {

      return (
        "Your employee profile is available from the Dayflow dashboard. It contains your role, department and account status."
      );

    }


    /* HELP */

    if (
      query.includes("help") ||
      query.includes("what can you do")
    ) {

      return (
        "I can help with leave balance, attendance, checking in, checking out, leave requests and your Dayflow workspace. ✦"
      );

    }


    /* GREETING */

    if (
      query.includes("hello") ||
      query.includes("hi") ||
      query.includes("hey")
    ) {

      return (
        "Hey! 👋 Your Dayflow workspace is ready. What would you like to know?"
      );

    }


    /* DEFAULT */

    return (
      "I'm still learning that area. Try asking me about your leave, attendance, workday or leave requests."
    );

  };


  /* =====================================================
     ASK
  ===================================================== */

  const ask = async () => {

    const text =
      question.trim();

    if (!text || thinking) {
      return;
    }


    setMessages(previous => [

      ...previous,

      {
        sender: "user",
        text
      }

    ]);

    setQuestion("");

    setThinking(true);


    try {

      const answer =
        await getResponse(text);


      setMessages(previous => [

        ...previous,

        {
          sender: "dayflow",
          text: answer
        }

      ]);

    } catch {

      setMessages(previous => [

        ...previous,

        {
          sender: "dayflow",
          text:
            "I couldn't reach the Dayflow system right now. Please try again."
        }

      ]);

    } finally {

      setThinking(false);

    }

  };


  const askQuick = text => {

    setQuestion(text);

  };


  return (

    <div className="ai-page">


      {/* =================================================
         HEADER
      ================================================= */}

      <header className="ai-top">

        <div className="ai-brand">

          <div className="ai-logo">

            <span>
              ✦
            </span>

          </div>

          <div>

            <span className="ai-kicker">
              DAYFLOW INTELLIGENCE
            </span>

            <h1>
              Ask Dayflow
            </h1>

          </div>

        </div>


        <div className="ai-online">

          <span></span>

          Intelligence online

        </div>

      </header>


      {/* =================================================
         MAIN
      ================================================= */}

      <main className="ai-layout">


        {/* CHAT */}

        <section className="ai-chat-card">


          <div className="chat-heading">

            <div>

              <span className="ai-kicker">
                YOUR PERSONAL ASSISTANT
              </span>

              <h2>
                What can I help with?
              </h2>

            </div>

            <div className="chat-spark">
              ✦
            </div>

          </div>


          {/* MESSAGES */}

          <div className="chat-window">

            {messages.map(
              (message, index) => (

                <div
                  className={
                    message.sender === "user"
                      ? "chat-row user"
                      : "chat-row"
                  }
                  key={index}
                >

                  {message.sender ===
                    "dayflow" && (

                    <div className="bot-avatar">
                      ✦
                    </div>

                  )}

                  <div
                    className={
                      message.sender === "user"
                        ? "bubble user-bubble"
                        : "bubble bot-bubble"
                    }
                  >

                    {message.text}

                  </div>

                </div>

              )
            )}


            {thinking && (

              <div className="chat-row">

                <div className="bot-avatar">
                  ✦
                </div>

                <div className="thinking-bubble">

                  <span></span>
                  <span></span>
                  <span></span>

                </div>

              </div>

            )}

          </div>


          {/* INPUT */}

          <div className="ai-input">

            <input
              value={question}
              onChange={e =>
                setQuestion(e.target.value)
              }
              onKeyDown={e => {

                if (
                  e.key === "Enter"
                ) {
                  ask();
                }

              }}
              placeholder=
                "Ask about your workday..."
            />

            <button
              onClick={ask}
              disabled={
                thinking ||
                !question.trim()
              }
            >
              →
            </button>

          </div>


          {/* QUICK QUESTIONS */}

          <div className="quick-actions">

            <button
              onClick={() =>
                askQuick(
                  "How many leave days do I have?"
                )
              }
            >
              🌴 Leave balance
            </button>

            <button
              onClick={() =>
                askQuick(
                  "What is my attendance?"
                )
              }
            >
              ◷ Attendance
            </button>

            <button
              onClick={() =>
                askQuick(
                  "How do I check in?"
                )
              }
            >
              🟢 Start my day
            </button>

          </div>

        </section>


        {/* =================================================
           INTELLIGENCE SIDEBAR
        ================================================= */}

        <aside className="ai-side">


          {/* FLOW SCORE */}

          <div className="ai-card flow-score">

            <span className="ai-kicker">
              YOUR FLOW
            </span>

            <div className="score-ring">

              <div>

                <strong>
                  {Math.min(
                    100,
                    70 +
                    stats.attendance * 5
                  )}
                </strong>

                <span>
                  / 100
                </span>

              </div>

            </div>

            <h3>
              You're building momentum.
            </h3>

            <p>
              This is a personal workday
              summary — not a performance score.
            </p>

          </div>


          {/* QUICK STATS */}

          <div className="ai-card">

            <span className="ai-kicker">
              SNAPSHOT
            </span>

            <div className="snapshot-list">

              <div>

                <span>
                  Leave available
                </span>

                <strong>
                  {stats.leave}
                </strong>

              </div>

              <div>

                <span>
                  Work sessions
                </span>

                <strong>
                  {stats.attendance}
                </strong>

              </div>

            </div>

          </div>


          {/* NOTIFICATIONS */}

          <div className="ai-card">

            <div className="notification-heading">

              <span className="ai-kicker">
                RECENT ACTIVITY
              </span>

              <span>
                {notifications.length}
              </span>

            </div>


            {notifications.length === 0 ? (

              <p className="no-notifications">
                Nothing new right now.
              </p>

            ) : (

              <div className="notification-list">

                {notifications
                  .slice()
                  .reverse()
                  .slice(0, 4)
                  .map(notification => (

                    <div
                      className="notification"
                      key={notification.id}
                    >

                      <div
                        className={
                          `notification-dot ${
                            notification.type
                          }`
                        }
                      >
                        ✓
                      </div>

                      <div>

                        <strong>
                          {notification.title}
                        </strong>

                        <span>
                          {notification.message}
                        </span>

                      </div>

                    </div>

                  ))}

              </div>

            )}

          </div>


        </aside>

      </main>

    </div>

  );

}


export default AskDayFlow;
