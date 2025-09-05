const { useState, useEffect } = React;

// Speech Bubble Component
const SpeechBubble = ({ 
  isVisible = false, 
  text = "Hi! I'm Adam, a passionate Data Science & Full-Stack Developer. I love building innovative solutions that combine machine learning with beautiful user interfaces. When I'm not coding, you can find me exploring new technologies or working on exciting projects!",
  position = "top-right",
  delay = 1000,
  onClose = () => {}
}) => {
  const [showBubble, setShowBubble] = useState(false);
  const [showText, setShowText] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer1 = setTimeout(() => {
        setShowBubble(true);
      }, delay);
      
      const timer2 = setTimeout(() => {
        setShowText(true);
      }, delay + 300);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      setShowBubble(false);
      setShowText(false);
      setIsClosing(false);
      setIsExpanded(false);
    }
  }, [isVisible, delay]);

  const getPositionClass = () => {
    switch (position) {
      case "top-left":
        return "speech-bubble-top-left";
      case "top-right":
        return "speech-bubble-top-right";
      case "bottom-left":
        return "speech-bubble-bottom-left";
      case "bottom-right":
        return "speech-bubble-bottom-right";
      default:
        return "speech-bubble-top-right";
    }
  };

  const handleClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsExpanded(false);
      setIsClosing(false);
    }, 200); // Reduced from 300ms to 200ms for faster response
  };

  return (
    <div className={`speech-bubble-container ${getPositionClass()}`}>
      <div 
        className={`speech-bubble ${showBubble ? 'visible' : ''} ${isClosing ? 'closing' : ''} ${isExpanded ? 'expanded' : 'minimized'}`}
        style={{
          opacity: showBubble && !isClosing ? 1 : 0,
          transform: showBubble && !isClosing ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(-10px)',
          transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          cursor: !isExpanded ? 'pointer' : 'default'
        }}
        onClick={handleClick}
      >
        {isExpanded ? (
          <>
            <div className="speech-bubble-content">
              <div className="speech-bubble-header">
                <span className="speech-bubble-title">About Me</span>
                <button 
                  className="speech-bubble-close"
                  onClick={handleClose}
                  aria-label="Close speech bubble"
                >
                  ×
                </button>
              </div>
              <div 
                className="speech-bubble-text"
                style={{
                  opacity: showText ? 1 : 0,
                  transition: 'opacity 0.15s ease-in-out 0.1s'
                }}
              >
                {text}
              </div>
            </div>
            <div className="speech-bubble-tail"></div>
          </>
        ) : (
          <>
            <div className="speech-bubble-minimized">
              <span className="minimized-text">Click to learn about me!</span>
              <div className="minimized-icon">💬</div>
            </div>
            <div className="speech-bubble-tail"></div>
          </>
        )}
      </div>
    </div>
  );
};

// Make SpeechBubble globally available
window.SpeechBubble = SpeechBubble;
