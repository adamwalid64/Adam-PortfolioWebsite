const { useState, useEffect, useRef } = React;

// ProjectCarousel Component
const ProjectCarousel = ({ projects }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const carouselRef = useRef(null);

  const totalProjects = projects.length;

  const goToNext = () => {
    if (!isAnimating && totalProjects > 1) {
      setIsAnimating(true);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalProjects);
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  const goToPrev = () => {
    if (!isAnimating && totalProjects > 1) {
      setIsAnimating(true);
      setCurrentIndex((prevIndex) => (prevIndex - 1 + totalProjects) % totalProjects);
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  const goToIndex = (index) => {
    if (!isAnimating && index !== currentIndex) {
      setIsAnimating(true);
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isAnimating]);

  // Drag/swipe functionality removed to prevent conflicts with button clicks

  const getCardPosition = (index) => {
    const relativeIndex = (index - currentIndex + totalProjects) % totalProjects;
    
    if (relativeIndex === 0) return 'center';
    if (relativeIndex === 1) return 'right';
    if (relativeIndex === totalProjects - 1) return 'left';
    return 'hidden';
  };

  const getProjectTheme = (project) => {
    const title = project.title.toLowerCase();
    if (title.includes('purchase') || title.includes('pulse')) return 'purchase-pulse';
    if (title.includes('fight') || title.includes('metrics')) return 'fightmetrics-ai';
    if (title.includes('nfl') || title.includes('fantasy') || title.includes('rag')) return 'nfl-fantasy-rag';
    return '';
  };

  // Generate working placeholder images
  const getPlaceholderImage = (project, size = 80) => {
    const colors = {
      'purchase-pulse': 'A63D40',
      'fightmetrics-ai': 'A63D40',
      'nfl-fantasy-rag': 'A63D40'
    };
    const theme = getProjectTheme(project);
    const color = colors[theme] || 'A63D40';
    const text = project.title.substring(0, 2).toUpperCase();
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#${color}"/>
        <text x="50%" y="50%" font-family="Arial" font-size="${size/3}" fill="#D5CCC3" text-anchor="middle" dy=".3em">${text}</text>
      </svg>
    `)}`;
  };

  // Get project-specific image
  const getProjectImage = (project) => {
    const theme = getProjectTheme(project);
    console.log('Project:', project.title, 'Theme:', theme);
    
    if (theme === 'purchase-pulse') {
      return '/images/purchase_pulse_logo.png';
    }
    if (theme === 'fightmetrics-ai') {
      return '/images/redrobo.png';
    }
    if (theme === 'nfl-fantasy-rag') {
      const imagePath = '/images/nfl_RAG_logo.png';
      console.log('NFL RAG image path:', imagePath);
      return imagePath;
    }
    return project.image || getPlaceholderImage(project, 80);
  };

  return (
    <div className="carousel-container" ref={carouselRef}>
      <div className="carousel-track">
        {projects.map((project, index) => {
          const position = getCardPosition(index);
          const theme = getProjectTheme(project);
          const isVisible = position !== 'hidden';
          
          return (
            <div
              key={index}
              className={`carousel-card ${position} ${theme} ${isVisible ? 'visible' : 'hidden'}`}
            >
              <div className="card-inner">
                <div className="card-content">
                  <div className="card-avatar">
                    <img
                      className="avatar"
                      src={getProjectImage(project)}
                      alt={`${project.title} icon`}
                      loading="lazy"
                      onError={(e) => {
                        console.log('Image failed to load:', e.target.src, 'for project:', project.title);
                        e.target.src = getPlaceholderImage(project, 80);
                      }}
                      onLoad={(e) => {
                        console.log('Image loaded successfully:', e.target.src, 'for project:', project.title);
                      }}
                    />
                  </div>
                  
                  <div className="card-details">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    
                    {project.date && (
                      <div className="card-date">{project.date}</div>
                    )}
                    
                    {project.details && project.details.length > 0 && (
                      <div className="card-features">
                        <h4>Key Features</h4>
                        <ul>
                          {project.details.slice(0, 3).map((detail, idx) => (
                            <li key={idx}>{detail}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {project.tech && project.tech.length > 0 && (
                      <div className="card-tech">
                        <h4>Tech Stack</h4>
                        <div className="tech-tags">
                          {project.tech.map((tech, idx) => (
                            <span key={idx} className="tech-tag">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="card-status">
                    {project.role || "Active"}
                  </div>
                  
                  <div className="card-links">
                    {project.projectLink && theme !== 'nfl-fantasy-rag' && (
                      <a 
                        href={project.projectLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="project-link"
                        onClick={(e) => {
                          console.log('Project link clicked:', project.projectLink);
                          // Ensure the link opens
                          window.open(project.projectLink, '_blank', 'noopener,noreferrer');
                        }}
                      >
                        View Project
                      </a>
                    )}
                    <a 
                      href={project.githubLink || "#"} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="project-link github"
                      onClick={(e) => {
                        console.log('GitHub link clicked:', project.githubLink);
                        if (project.githubLink) {
                          // Ensure the link opens
                          window.open(project.githubLink, '_blank', 'noopener,noreferrer');
                        }
                      }}
                    >
                      View GitHub
                    </a>
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      {totalProjects > 1 && (
        <>
          <button
            className="carousel-nav prev"
            onClick={goToPrev}
            disabled={isAnimating}
            aria-label="Previous project"
          >
            ‹
          </button>
          <button
            className="carousel-nav next"
            onClick={goToNext}
            disabled={isAnimating}
            aria-label="Next project"
          >
            ›
          </button>
        </>
      )}

      {/* Indicators - Moved below carousel */}
      {totalProjects > 1 && (
        <div className="carousel-indicators-container">
          <ul className="carousel-indicators">
            {projects.map((_, index) => (
              <li
                key={index}
                className={`carousel-indicator ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToIndex(index)}
                aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Make ProjectCarousel globally available
window.ProjectCarousel = ProjectCarousel; 