// React component for interactive project grid
const { useRef, useEffect } = React;

function ChromaGrid({
  items,
  className = "",
  radius = 300,
  columns = 3,
  rows = 2,
  damping = 0.45,
  fadeOut = 0.6,
  ease = "power3.out",
}) {
  const rootRef = useRef(null);
  const fadeRef = useRef(null);
  const setX = useRef(null);
  const setY = useRef(null);
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setX.current = gsap.quickSetter(el, "--x", "px");
    setY.current = gsap.quickSetter(el, "--y", "px");
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const moveTo = (x, y) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true,
    });
  };

  const handleMove = (e) => {
    const r = rootRef.current.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      overwrite: true,
    });
  };

  const handleCardClick = (url) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleCardMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    React.createElement(
      "div",
      {
        ref: rootRef,
        className: `chroma-grid ${className}`,
        style: {
          "--r": `${radius}px`,
          "--cols": columns,
          "--rows": rows,
        },
        onPointerMove: handleMove,
        onPointerLeave: handleLeave,
      },
      items.map((c, i) =>
        React.createElement(
          "article",
          {
            key: i,
            className: "chroma-card",
            onMouseMove: handleCardMove,
            onClick: () => handleCardClick(c.link || c.url),
            style: {
              "--card-border": c.borderColor || "transparent",
              "--card-gradient": c.gradient,
              cursor: c.link || c.url ? "pointer" : "default",
            },
          },
          React.createElement(
            "div",
            { className: "chroma-img-wrapper" },
            React.createElement("img", {
              src: c.image,
              alt: c.title,
              loading: "lazy",
            })
          ),
          React.createElement(
            "footer",
            { className: "chroma-info" },
            React.createElement("h3", { className: "name" }, c.title),
            c.handle && React.createElement("span", { className: "handle" }, c.handle),
            React.createElement("p", { className: "role" }, c.subtitle || c.role),
            c.location && React.createElement("span", { className: "location" }, c.location)
          )
        )
      ),
      React.createElement("div", { className: "chroma-overlay" }),
      React.createElement("div", { ref: fadeRef, className: "chroma-fade" })
    )
  );
}

window.ChromaGrid = ChromaGrid;
