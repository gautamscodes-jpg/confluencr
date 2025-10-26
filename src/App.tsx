import "./App.css";
import { useState } from "react";

import CallDurationChart from "./components/CallDurationChart";
import SadPathAnalysisChart from "./components/SadPathAnalysisChart";
import ChartDataEditor from "./components/ChartDataEditor";
const initialSadPathData = [
  { name: "Verbal Aggression", value: 100 },
  { name: "Customer Hostility", value: 200 },
  { name: "Assistant did not speak French", value: 300 },
  { name: "Unsupported Language", value: 150 },
  // { name: "Assistant did not speak Spanish", value: 250 },
  { name: "User refused to confirm identity", value: 100 },
  // { name: "Caller Identification", value: 120 },
  // { name: "Incorrect caller identity", value: 80 },
];

function App() {
  const [sadPathData, setSadPathData] = useState(initialSadPathData);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // const fetchChartData = useCallback(async () => {
  //   const { data, error } = await supabase
  //     .from('chart_data')
  //     .select('email, call_duration, sad_path');

  //   if (error) {
  //     console.error('Error fetching chart data:', error.message);
  //   } else {
  //     setChartData(data);
  //   }
  // }, []);

  // useEffect(() => {
  //   fetchChartData();
  // }, [fetchChartData]);

  return (
    <div className="App">
      {/* Header/Navigation Bar */}
      <header className="header w-[100vw]">
        <div className="logo">#confluencr</div>
        <nav className="navigation">
          <a href="#" className="nav-link">
            Home
          </a>
          <a href="#" className="nav-link">
            Newsletter
          </a>
          <button className="talk-to-us-button">Talk to Us</button>
        </nav>
      </header>

      {/* New Body Section */}
      <section className="new-body-section grid-background">
        <div className="new-body-content">
          <h1 className="new-body-title">
            Helping Engineering Teams <span className="highlight">Scale</span>{" "}
            Voice AI
          </h1>
          <p className="new-body-description">
            Voice agents fail. We make fixing them effortless.
          </p>
          <button className="get-started-button">Get Started</button>
        </div>
      </section>

      {/* Charts Section */}
      <section className="charts-section">
        <div className="charts-container">
          {/* <div className="email-input-container">
            <label htmlFor="userEmail">Your Email:</label>
            <input
              type="email"
              id="userEmail"
              value={userEmail || ''}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Enter your email to customize charts"
            />
          </div> */}
          <ChartDataEditor
            chartName="Sad Path Analysis"
            initialData={initialSadPathData}
            onDataChange={setSadPathData}
            userEmail={userEmail}
            setUserEmail={setUserEmail}
          />
          <CallDurationChart />
          <SadPathAnalysisChart data={sadPathData} />
        </div>
      </section>

      {/* Trusted by Companies Section (retained but potentially restyled) */}
      <section className="companies-section">
        <p className="companies-text">TRUSTED BY INNOVATIVE COMPANIES</p>
        <div className="company-logos">
          <div className="company-logo">mykare</div>
          <div className="company-logo">Kennar</div>
          <div className="company-logo">ACE MONEY</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-left">
          <div className="footer-logo">#confluencr</div>
          <p className="footer-tagline">
            The missing layer for your voice agent which adapts, learns, and
            never lets your users down.
          </p>
          <div className="social-links">
            <a href="#" className="social-icon">
              T
            </a>{" "}
            {/* Placeholder for Twitter icon */}
            <a href="#" className="social-icon">
              G
            </a>{" "}
            {/* Placeholder for GitHub icon */}
            <a href="#" className="social-icon">
              L
            </a>{" "}
            {/* Placeholder for LinkedIn icon */}
            <a href="#" className="social-icon">
              I
            </a>{" "}
            {/* Placeholder for Instagram icon */}
          </div>
          <button className="contact-us-button">Contact Us</button>
        </div>
        <div className="footer-right">
          <h3 className="stay-up-to-date">Stay up to date</h3>
          <p className="newsletter-text">
            Subscribe to our newsletter to receive the latest updates on Voice
            AI, product updates, and early access features.
          </p>
          <div className="newsletter-form">
            <label className="newsletter-label">• Newsletter</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="email-input"
            />
            <button className="subscribe-button">Subscribe</button>
          </div>
          <p className="privacy-text">
            By subscribing, you agree to our Privacy Policy and consent to
            receive updates.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
