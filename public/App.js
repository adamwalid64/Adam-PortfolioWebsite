const { useState, useEffect } = React;

// App Component
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: []
    };
  }

  componentDidMount() {
    this.loadProjects();
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
              <a href="https://www.linkedin.com/in/adamwalid/" target="_blank" rel="noopener">LinkedIn</a>
              <a href="https://github.com/adamwalid64" target="_blank" rel="noopener">GitHub</a>
            </div>
            
            <div id="bar-container" className="bar-container" aria-hidden="true"></div>
            

            
            <h1 className="title">Hi, I'm <strong>Adam Walid</strong></h1>
            <p className="subtitle">Data Science & Full-Stack Developer | CS + Data Analytics @ Syracuse University</p>
            
            <div className="profile-pic">
              <img src="images/linkedin.jpg" alt="Profile picture" />
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