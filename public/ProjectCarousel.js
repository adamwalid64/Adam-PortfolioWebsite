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

  // Enhanced touch/swipe support with mouse drag
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    let dragDistance = 0;
    let isMouseDrag = false;

    const handleStart = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      
      startX = clientX;
      startY = clientY;
      isDragging = true;
      dragDistance = 0;
      isMouseDrag = !e.touches;
      
      // Prevent text selection during drag
      if (isMouseDrag) {
        e.preventDefault();
      }
    };

    const handleMove = (e) => {
      if (!isDragging) return;
      
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      
      const diffX = startX - clientX;
      const diffY = startY - clientY;
      dragDistance = Math.abs(diffX);

      // Prevent default for mouse drag to avoid text selection
      if (isMouseDrag) {
        e.preventDefault();
      }

      // Only handle horizontal swipes with minimum distance
      const minDistance = isMouseDrag ? 80 : 50; // Higher threshold for mouse
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minDistance) {
        if (diffX > 0) {
          goToNext();
        } else {
          goToPrev();
        }
        isDragging = false;
        dragDistance = 0;
      }
    };

    const handleEnd = () => {
      isDragging = false;
      dragDistance = 0;
    };

    const carousel = carouselRef.current;
    if (carousel) {
      // Touch events
      carousel.addEventListener('touchstart', handleStart, { passive: false });
      carousel.addEventListener('touchmove', handleMove, { passive: false });
      carousel.addEventListener('touchend', handleEnd);
      
      // Mouse events for desktop drag
      carousel.addEventListener('mousedown', handleStart);
      carousel.addEventListener('mousemove', handleMove);
      carousel.addEventListener('mouseup', handleEnd);
      carousel.addEventListener('mouseleave', handleEnd);
    }

    return () => {
      if (carousel) {
        carousel.removeEventListener('touchstart', handleStart);
        carousel.removeEventListener('touchmove', handleMove);
        carousel.removeEventListener('touchend', handleEnd);
        carousel.removeEventListener('mousedown', handleStart);
        carousel.removeEventListener('mousemove', handleMove);
        carousel.removeEventListener('mouseup', handleEnd);
        carousel.removeEventListener('mouseleave', handleEnd);
      }
    };
  }, [currentIndex, isAnimating]);

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
    if (title.includes('physique') || title.includes('forged')) return 'physique-forged';
    return '';
  };

  // Generate working placeholder images
  const getPlaceholderImage = (project, size = 80) => {
    const colors = {
      'purchase-pulse': 'A63D40',
      'fightmetrics-ai': 'A63D40', 
      'physique-forged': 'A63D40'
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
    if (theme === 'purchase-pulse') {
      return 'images/purchase_pulse_logo.png';
    }
    if (theme === 'fightmetrics-ai') {
      return 'images/redrobo.png';
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
                        e.target.src = getPlaceholderImage(project, 80);
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
                           {project.tech.slice(0, 4).map((tech, idx) => (
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
                    <a href={project.link || "#"} target="_blank" rel="noopener noreferrer" className="project-link">
                      View Project
                    </a>
                    <a href={project.github || "#"} target="_blank" rel="noopener noreferrer" className="project-link github">
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