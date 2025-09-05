const { useState, useEffect } = React;

// Resume Button Component
class ResumeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDropdownOpen: false,
      isFullScreenOpen: false
    };
    this.dropdownRef = React.createRef();
    this.modalRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (this.dropdownRef.current && !this.dropdownRef.current.contains(event.target)) {
      this.setState({ isDropdownOpen: false });
    }
    if (this.modalRef.current && !this.modalRef.current.contains(event.target)) {
      this.setState({ isFullScreenOpen: false });
    }
  };

  toggleDropdown = () => {
    this.setState({ isDropdownOpen: !this.state.isDropdownOpen });
  };

  closeDropdown = () => {
    this.setState({ isDropdownOpen: false });
  };

  openFullScreen = () => {
    this.setState({ isFullScreenOpen: true });
  };

  closeFullScreen = () => {
    this.setState({ isFullScreenOpen: false });
  };

  handleDownload = () => {
    // Create a temporary link to download the resume
    const link = document.createElement('a');
    link.href = 'images/Adam-Walid-Resume.pdf';
    link.download = 'Adam-Walid-Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  render() {
    return (
      <div className="resume-container" ref={this.dropdownRef}>
        <button 
          className="resume-button"
          onClick={this.toggleDropdown}
        >
          Resume
        </button>
        
        {this.state.isDropdownOpen && (
          <div className="resume-dropdown">
            <div className="resume-preview" onClick={this.openFullScreen}>
              <iframe 
                src="images/Adam-Walid-Resume.pdf#toolbar=0&navpanes=0&scrollbar=0"
                width="100%"
                height="400px"
                title="Resume Preview"
              />
              <div className="preview-overlay">
                <span className="preview-text">Click to view full screen</span>
              </div>
            </div>
            <div className="resume-actions">
              <button 
                className="download-button"
                onClick={this.handleDownload}
              >
                Download Resume
              </button>
              <button 
                className="close-button"
                onClick={this.closeDropdown}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Full Screen PDF Modal */}
        {this.state.isFullScreenOpen && (
          <div className="pdf-modal-overlay" onClick={this.closeFullScreen}>
            <div className="pdf-modal" ref={this.modalRef} onClick={(e) => e.stopPropagation()}>
              <div className="pdf-modal-header">
                <h3>Adam Walid - Resume</h3>
                <button className="modal-close-button" onClick={this.closeFullScreen}>
                  ×
                </button>
              </div>
              <div className="pdf-modal-content">
                <iframe 
                  src="images/Adam-Walid-Resume.pdf#toolbar=1&navpanes=1&scrollbar=1"
                  width="100%"
                  height="100%"
                  title="Full Screen Resume"
                />
              </div>
              <div className="pdf-modal-footer">
                <button 
                  className="download-button"
                  onClick={this.handleDownload}
                >
                  Download Resume
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

// App Component
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      showSpeechBubble: false
    };
  }

  componentDidMount() {
    this.loadProjects();
    
    // Show speech bubble immediately when page loads
    this.setState({ showSpeechBubble: true });
  }

  loadProjects() {
    fetch('data/projects.json')
      .then(response => response.json())
      .then(data => {
        console.log('Loaded projects:', data);
        this.setState({ projects: data || [] });
      })
      .catch(error => {
        console.error('Error loading projects:', error);
        // Fallback data if projects.json fails to load
        this.setState({
          projects: [
            {
              title: "Purchase Pulse: Customer Repurchase Prediction Dashboard",
              description: "Developed a full-stack machine learning web application to predict customer repurchase behavior. Combined a Python-based logistic regression model with an interactive React.js + Flask dashboard, enabling actionable insights for marketing teams.",
              details: [
                "Integrated frontend inputs with backend ML inference via REST APIs",
                "Designed a responsive UI using Bootstrap, Recharts, and CSS to visualize predictions and model performance",
                "Engineered SQL-derived features and interaction terms, optimized binary cross-entropy loss via gradient descent, and achieved high prediction accuracy on a Kaggle dataset"
              ],
              tech: ["Python", "Flask", "React.js", "Bootstrap", "Recharts", "SQL", "Gradient Descent"],
              date: "Spring 2025",
              role: "Data Science & Full-Stack Developer"
            },
            {
              title: "FightMetrics AI: Automated UFC Stats Pipeline for Insight/Predictive Power",
              description: "Designed and implemented an end-to-end data pipeline that scraped, cleaned, and stored over 60,000 UFC data points in SQL to power advanced machine learning models, achieving fight outcome predictions more accurate than the average bettor.",
              details: [
                "Trained and fine-tuned an XGBoost model using complex fighter stats and custom skill ratings",
                "Created R visualizations for performance trends, prediction confidence, and key feature importance",
                "Developed Python-based scrapers with pagination, live feature engineering, and automated data cleaning",
                "Automated thousands of SQL queries to maintain a structured database for ML and analytics"
              ],
              tech: ["Python", "XGBoost", "R", "SQL", "Web Scraping", "ETL Pipeline"],
              date: "Summer 2025",
              role: "ML & Data Pipeline Engineer"
            },
            {
              title: "Physique Forged: Full-stack fitness and nutrition tracker with a medieval RPG twist",
              description: "Built a medieval-themed fitness & diet tracker featuring a React frontend served by an Express backend. Designed a cohesive pixel‑art UI, added login and signup functionality with in‑memory authentication, and configured deployment on Vercel.",
              details: [
                "Developed interactive React components with custom fonts and responsive styling",
                "Implemented Express routes for signup and login using an in-memory user store",
                "Configured a serverless API handler and deployment via Vercel",
                "Included placeholder workout and diet planning features with pixel-art cards"
              ],
              tech: ["Node.js", "React.js", "Express", "HTML", "CSS", "Vercel"],
              date: "Summer 2025",
              role: "Full-Stack Developer & Web Designer"
            }
          ]
        });
      });
  }

  render() {
    const { projects } = this.state;
    
    return (
      <div className="App">
        {/* Main container for consistent width */}
        <main className="main-container">
          {/* Header with links */}
          <header className="hero">
            <div className="header-contact">
              <ResumeButton />
              <a href="https://www.linkedin.com/in/adamwalid/" target="_blank" rel="noopener">LinkedIn</a>
              <a href="https://github.com/adamwalid64" target="_blank" rel="noopener">GitHub</a>
            </div>
            
            <div id="bar-container" className="bar-container" aria-hidden="true"></div>
            

            
            <h1 className="title">Hi, I'm <strong>Adam Walid</strong></h1>
            <p className="subtitle">Data Science & Full-Stack Developer | CS + Data Analytics @ Syracuse University</p>
            
            <div className="profile-pic-container">
              <div className="profile-pic">
                <img 
                  src="images/linkedin.jpg" 
                  alt="Profile picture" 
                  onClick={() => this.setState({ showSpeechBubble: !this.state.showSpeechBubble })}
                  style={{ cursor: 'pointer' }}
                />
              </div>
              {this.state.showSpeechBubble && (
                <SpeechBubble 
                  isVisible={this.state.showSpeechBubble}
                  text="I'm a passionate developer who loves turning ideas into reality with code and exploring the future through machine learning and RAG pipelines. My coding experience mainly combines full-stack applications with intricate data pipelines that power advanced models to predict outcomes, uncover insights others can't see, and automate time-intensive tasks. In my free time I love skateboarding, going to the gym, watching UFC, building passion projects around my hobbies, and hanging out with friends."
                  position="top-right"
                  delay={100}
                  onClose={() => {}} // No longer needed - bubble returns to minimized state
                />
              )}
            </div>
          </header>
        </main>
        
        {/* Projects section - full width */}
        <div className="projects-section">
          <h2 className="projects-title">Projects</h2>
          <section className="projects">
            {projects.length > 0 ? (
              <ProjectCarousel projects={projects} />
            ) : (
              <div style={{ textAlign: 'center', color: '#fff', padding: '2rem' }}>
                Loading projects...
              </div>
            )}
          </section>
        </div>
        
        {/* Footer with contact info */}
        <footer className="contact">
          <h2>Contact</h2>
          <p>Email: <a href="mailto:adamwalidprof@gmail.com">adamwalidprof@gmail.com</a></p>
          <p>Phone: <a href="tel:9084773134">908-477-3134</a></p>
          <p>
            <a href="https://www.linkedin.com/in/adamwalid/" target="_blank" rel="noopener">LinkedIn</a> | 
            <a href="https://github.com/adamwalid64" target="_blank" rel="noopener">GitHub</a>
          </p>
        </footer>
      </div>
    );
  }
}

// Make App globally available
window.App = App;

ReactDOM.render(
  React.createElement(App),
  document.getElementById('root')
); 