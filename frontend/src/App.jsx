* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Inter, Arial, sans-serif;
  background: #f5f7fb;
  color: #18202f;
}

button {
  font-family: inherit;
  cursor: pointer;
}

/* -----------------------------
   HEADER
----------------------------- */

.header {
  height: 82px;
  background: white;
  border-bottom: 1px solid #e8ebf0;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 42px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 42px;
  height: 42px;

  border-radius: 13px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #18202f;
  color: white;

  font-size: 20px;
  font-weight: 800;
}

.logo h1 {
  margin: 0;
  font-size: 21px;
}

.logo span {
  font-size: 11px;
  color: #7c8493;
}

.profile {
  display: flex;
  align-items: center;
  gap: 10px;
}

.profile strong {
  display: block;
  font-size: 14px;
}

.profile small {
  color: #7c8493;
}

.avatar {
  width: 38px;
  height: 38px;

  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #e9eef7;

  font-weight: 700;
}


/* -----------------------------
   DASHBOARD
----------------------------- */

.dashboard {
  max-width: 1200px;
  margin: auto;
  padding: 45px 30px;
}


/* -----------------------------
   WELCOME
----------------------------- */

.welcome {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 30px;
}

.eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #7c8493;
}

.welcome h2 {
  font-size: 32px;
  margin: 8px 0;
}

.welcome p {
  color: #7c8493;
  margin: 0;
}

.status-badge {
  background: white;
  padding: 12px 18px;
  border-radius: 30px;

  border: 1px solid #e8ebf0;

  font-size: 13px;
}

.status-dot {
  display: inline-block;

  width: 8px;
  height: 8px;

  border-radius: 50%;

  background: #b5bcc8;

  margin-right: 8px;
}

.status-dot.active {
  background: #36b37e;
}


/* -----------------------------
   MESSAGE
----------------------------- */

.message {
  background: white;

  border: 1px solid #e8ebf0;

  border-radius: 12px;

  padding: 14px 18px;

  margin-bottom: 22px;

  animation: slideDown 0.4s ease;
}


/* -----------------------------
   CARDS
----------------------------- */

.cards {
  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 20px;

  margin-bottom: 30px;
}

.card {
  background: white;

  border: 1px solid #e8ebf0;

  border-radius: 20px;

  padding: 25px;

  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);

  box-shadow:
    0 12px 35px rgba(20, 30, 50, 0.08);
}

.card-icon {
  font-size: 25px;

  margin-bottom: 18px;
}

.card span {
  color: #7c8493;
  font-size: 13px;
}

.card h3 {
  font-size: 27px;
  margin: 10px 0;
}

.card h3 small {
  font-size: 14px;
  font-weight: normal;
}

.card p {
  margin: 0;
  color: #8b93a1;
  font-size: 13px;
}


/* -----------------------------
   BUTTONS
----------------------------- */

.checkin-button,
.checkout-button {
  width: 100%;

  border: none;

  padding: 12px;

  border-radius: 10px;

  font-weight: 700;

  margin-top: 12px;

  transition: transform 0.2s ease;
}

.checkin-button {
  background: #18202f;
  color: white;
}

.checkout-button {
  background: #eceff4;
  color: #18202f;
}

.checkin-button:hover,
.checkout-button:hover {
  transform: scale(1.02);
}


/* -----------------------------
   DAYFLOW
----------------------------- */

.flow-section {
  background: white;

  border: 1px solid #e8ebf0;

  border-radius: 22px;

  padding: 30px;

  margin-bottom: 25px;
}

.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-heading h2 {
  margin: 8px 0 0;
}

.section-heading > span {
  font-size: 12px;

  padding: 7px 12px;

  border-radius: 20px;

  background: #edf8f3;
}


/* -----------------------------
   TIMELINE
----------------------------- */

.timeline {
  position: relative;

  display: grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap: 15px;

  margin-top: 40px;
}

.timeline-line {
  position: absolute;

  top: 27px;

  left: 40px;

  right: 40px;

  height: 2px;

  background: #e5e9ef;

  z-index: 0;
}

.timeline-item {
  position: relative;

  z-index: 1;

  display: flex;

  flex-direction: column;

  align-items: center;

  text-align: center;

  gap: 10px;

  color: #9aa2af;

  transition:
    transform 0.4s ease,
    color 0.4s ease;
}

.timeline-item.active {
  color: #18202f;

  transform: translateY(-5px);
}

.timeline-icon {
  width: 55px;
  height: 55px;

  background: #f2f4f7;

  border: 4px solid white;

  border-radius: 50%;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 20px;

  transition:
    transform 0.4s ease;
}

.timeline-item.active .timeline-icon {
  transform: scale(1.08);
}

.timeline-item strong {
  font-size: 14px;
}

.timeline-item p {
  font-size: 12px;

  margin: 4px 0 0;

  color: #8b93a1;
}


/* -----------------------------
   INSIGHT
----------------------------- */

.insight {
  display: flex;

  align-items: center;

  gap: 18px;

  background: white;

  border: 1px solid #e8ebf0;

  border-radius: 20px;

  padding: 24px;
}

.insight-icon {
  font-size: 30px;
}

.insight span {
  font-size: 10px;

  font-weight: 700;

  letter-spacing: 1.3px;

  color: #7c8493;
}

.insight h3 {
  margin: 5px 0;
}

.insight p {
  margin: 0;

  color: #7c8493;
}


/* -----------------------------
   LOADING
----------------------------- */

.loading {
  min-height: 100vh;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;
}

.loader {
  width: 42px;
  height: 42px;

  border-radius: 50%;

  border: 4px solid #e5e9ef;

  border-top-color: #18202f;

  animation: spin 0.8s linear infinite;
}


/* -----------------------------
   ANIMATIONS
----------------------------- */

@keyframes spin {

  to {
    transform: rotate(360deg);
  }

}

@keyframes slideDown {

  from {
    opacity: 0;
    transform: translateY(-8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }

}


/* -----------------------------
   RESPONSIVE
----------------------------- */

@media (max-width: 800px) {

  .header {
    padding: 0 20px;
  }

  .dashboard {
    padding: 30px 20px;
  }

  .cards {
    grid-template-columns: 1fr;
  }

  .timeline {
    grid-template-columns: 1fr;
  }

  .timeline-line {
    display: none;
  }

  .welcome {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

}
