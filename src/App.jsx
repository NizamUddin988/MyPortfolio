import { useState, useEffect, useRef } from 'react'
import './App.css'

const TypewriterText = ({ text, delay = 0, speed = 60, className = '', tag: Tag = 'span', onDone }) => {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) {
      onDone && onDone();
      return;
    }
    const t = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);
    return () => clearTimeout(t);
  }, [started, displayed, text, speed, onDone]);

  return (
    <Tag className={className}>
      {displayed}
      {displayed.length < text.length && started && (
        <span className="tw-cursor">|</span>
      )}
    </Tag>
  );
};
const SkillBubble = ({ skill, index, total }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const bubbleRef = useRef(null);
  
  const getResponsiveRadius = () => {
    const width = window.innerWidth;
    if (width < 480) return 130;     
    if (width < 768) return 165;      
    if (width < 1024) return 185;     
    return 210;                       
  };
  
  const getBubbleSize = () => {
    const width = window.innerWidth;
    if (width < 480) return 42;
    if (width < 768) return 50;
    return 65;
  };
  
  useEffect(() => {
    const updatePosition = () => {
      const radius = getResponsiveRadius();
      const angle = (index * 2 * Math.PI) / total;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      
      if (bubbleRef.current) {
        bubbleRef.current.style.setProperty('--tx', `calc(-50% + ${x}px)`);
        bubbleRef.current.style.setProperty('--ty', `calc(-50% + ${y}px)`);
        const bubbleSize = getBubbleSize();
        bubbleRef.current.style.width = `${bubbleSize}px`;
        bubbleRef.current.style.height = `${bubbleSize}px`;
      }
    };
    
    updatePosition();
    
    const timer = setTimeout(() => setIsVisible(true), index * 60 + 200);
 
    window.addEventListener('resize', updatePosition);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePosition);
    };
  }, [index, total]);
  
  const getGradient = (name) => {
    const colors = {
      'React.js': 'linear-gradient(135deg, #61dafb, #2c3e50)',
      'JavaScript': 'linear-gradient(135deg, #f7df1e, #e6a117)',
      'HTML5': 'linear-gradient(135deg, #e34f26, #f06529)',
      'CSS3': 'linear-gradient(135deg, #264de4, #2965f1)',
      'Bootstrap': 'linear-gradient(135deg, #7952b3, #563d7c)',
      'Node.js': 'linear-gradient(135deg, #339933, #68a063)',
      'Express.js': 'linear-gradient(135deg, #ffffff, #888888)',
      'Spring Boot': 'linear-gradient(135deg, #6db33f, #4a8f2e)',
      'Python': 'linear-gradient(135deg, #3776ab, #ffd845)',
      'Java': 'linear-gradient(135deg, #007396, #e76f00)',
      'MongoDB': 'linear-gradient(135deg, #47a248, #4db33d)',
      'MySQL': 'linear-gradient(135deg, #4479a1, #00758f)',
      'AWS': 'linear-gradient(135deg, #ffffff, #666666)',
      'Figma': 'linear-gradient(135deg, #f24e1e, #ff7262)',
      'Postman': 'linear-gradient(135deg, #ff6c37, #ef5b25)',
      'Vercel': 'linear-gradient(135deg, #ffffff, #666666)',
      'Netlify': 'linear-gradient(135deg, #00c7b7, #2b7a6e)',
      'GitHub': 'linear-gradient(135deg, #ffffff, #999999)',
      'Maven': 'linear-gradient(135deg, #c71a36, #8a1a2c)',
      'Render': 'linear-gradient(90deg, #000000, #434343)',
      'Railway': 'linear-gradient(90deg, #000000, #434343)',
      'JDBC': 'linear-gradient(135deg, #007396, #00a8ff)'
    };
    return colors[name] || `linear-gradient(135deg, #6e57e0, #4a33c0)`;
  };
  
  return (
    <div 
      ref={bubbleRef}
      className={`skill-bubble ${isVisible ? 'visible' : ''}`}
      style={{
        transitionDelay: `${index * 0.03}s`,
        background: getGradient(skill.name)
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onTouchStart={() => setShowTooltip(!showTooltip)}
    >
      <div className="bubble-glow-ring" />
      <div className="bubble-content">
        <img 
          src={skill.icon} 
          alt={skill.name}
          onError={(e) => {
            e.target.style.display = 'none';
            const fallback = document.createElement('span');
            fallback.textContent = skill.name.charAt(0);
            fallback.className = 'bubble-fallback';
            e.target.parentElement.appendChild(fallback);
          }}
        />
      </div>
      {showTooltip && (
        <div className="bubble-tooltip">
          <span className="tooltip-skill">{skill.name}</span>
          <span className="tooltip-level">{skill.level || 'Expert'}</span>
        </div>
      )}
    </div>
  );
};

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Animation observers
    const containerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
        }
      });
    }, { threshold: 0.1 });

    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    const containerElements = document.querySelectorAll('.container');
    containerElements.forEach(element => {
      containerObserver.observe(element);
    });

    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
      item.style.transitionDelay = `${index * 0.15}s`;
      timelineObserver.observe(item);
    });

    return () => {
      containerElements.forEach(el => containerObserver.unobserve(el));
      timelineItems.forEach(el => timelineObserver.unobserve(el));
    };
  }, []);

  const allSkills = [
    // Frontend
    { name: "React.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg", category: "frontend", level: "Intermediate" },
    { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg", category: "frontend", level: "Intermediate" },
    { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg", category: "frontend", level: "Expert" },
    { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg", category: "frontend", level: "Expert" },
    { name: "Bootstrap", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg", category: "frontend", level: "Advanced" },
    
    // Backend
    { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg", category: "backend", level: "Intermediate" },
    { name: "Express.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg", category: "backend", level: "Core" },
    { name: "Spring Boot", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg", category: "backend", level: "Core" },
    { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg", category: "backend", level: "Core" },
    { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg", category: "backend", level: "Advanced" },
    
    // Database
    { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg", category: "database", level: "Core" },
    { name: "JDBC", icon: "https://cdn-icons-png.flaticon.com/128/5772/5772037.png", category: "database", level: "Intermediate" },
    { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg", category: "database", level: "Intermediate" },
    { name: "AWS", icon: "https://img.icons8.com/?size=48&id=33039&format=png", category: "database", level: "Core" },

    // Tools
    { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg", category: "tools", level: "Intermediate" },
    { name: "Figma", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg", category: "tools", level: "Intermediate" },
    { name: "Postman", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg", category: "tools", level: "Intermediate" },
    { name: "Vercel", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg", category: "tools", level: "Advanced" },
    { name: "Netlify", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/netlify/netlify-original.svg", category: "tools", level: "Advanced" },
    { name: "Maven", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apache/apache-original.svg", category: "tools", level: "Intermediate" },
    { name: "Render", icon: "data:image/png;base64,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", category: "tools", level: "Intermediate" },
    { name: "Railway", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/railway/railway-original.svg", category: "tools", level: "Intermediate" }
  ];
  
  const getFilteredSkills = () => {
    if (selectedCategory === 'all') return allSkills;
    return allSkills.filter(skill => skill.category === selectedCategory);
  };

  const galleryImages = [
    { id: 1, src: "https://wallpapercave.com/wp/wp7250087.jpg", title: "Efficient Coder", desc: "Deep focus while solving complex problems"},
    { id: 2, src: "/images/1.png", title: "Project Work", desc: "Working on a full-stack application" },
    { id: 3, src: "/images/2.png", title: "Consistency", desc: "My Efforts On HackerRank Platform" },
    { id: 4, src: "/images/3.png", title: "LeetCoder", desc: "Coding Practice On LeetCode" },
    { id: 5, src: "/images/4.png", title: "Code Review", desc: "Reviewing and optimizing code quality" },
    { id: 6, src: "/images/5.png", title: "Goals", desc: "Presenting My Life" }
  ];

  const certificates = [
    {id:  1, title:"Fullstack development using Java and Python", issuer:"Vstan4U Technolgies", desc:"Full-Stack Certification", filePath: "/certificates/intern.jpeg"},
    { id: 2, title: "Java Completion Course", issuer: "Intellipaat", desc: "Java Certification", filePath: "/certificates/intellipad.jpeg" },
    { id: 3, title: "AI Completion Course", issuer: "Infosys", desc: "AI Certification", filePath: "/certificates/infosys.pdf" },
    { id: 4, title: "Java Programming", issuer: "HackerRank", desc: "Java Development", filePath: "https://www.hackerrank.com/certificates/301ef5423e38" },
    { id: 5, title: "React Specialization", issuer: "HackerRank", desc: "Front-End Development with React", filePath: "https://www.hackerrank.com/certificates/f3cdc48cedc3" },
    { id: 6, title: "Python Programming", issuer: "HackerRank", desc: "Python Certification", filePath: "https://www.hackerrank.com/certificates/15089465d6a5" },
    { id: 7, title: "JavaScript Programming", issuer: "HackerRank", desc: "JavaScript Certification", filePath: "https://www.hackerrank.com/certificates/c0ec388f6e0e" },
    { id: 8, title: "Problem Solving", issuer: "HackerRank", desc: "Problem Solver Certification", filePath: "https://www.hackerrank.com/certificates/4c5f8ff73600" },
    { id: 9, title: "Java & SQL" , issuer:"Vstan4U Technolgies",desc:"Coding Certificate",filePath:"/certificates/vs4u.png"}
  ];

  const projects = [
    {
      id: 1,
      title: "House Rental Platform",
      tech: ["Java", "Spring-Boot", "HTML", "CSS", "JS", "MySQL", "Render", "Railway", "Vercel"],
      desc: "House Rental Platform is a full-stack web application built using Spring Boot that enables users to register securely with OTP-based email verification and manage rental listings.",
      demo: "https://nearbyhomes.vercel.app/",
      code: "https://github.com/NizamUddin988/House-Rental-Platform"
    },
    {
      id: 2,
      title: "Informer(ChatBot)",
      tech: ["HTML", "CSS", "JS", "Node.js", "Express.js", "Vercel"],
      desc: "Developed an interactive web-based chatbot named 'Informer' using HTML, CSS, and JavaScript, integrating external APIs to provide real-time information.",
      demo: "https://informer-chatbot.vercel.app/",
      code: "https://github.com/NizamUddin988/Informer-Chatbot-"
    },
    {
      id: 3,
      title: "Portfolio Website",
      tech: ["React", "CSS", "JavaScript", "BootStrap", "Figma", "Vercel"],
      desc: "A responsive portfolio website showcasing projects, skills and experience with modern design principles.",
      demo: "#",
      code: "https://github.com/NizamUddin988/MyPortfolio"
    },
    {
      id: 4,
      title: "SkyCast DashBoard",
      tech: ["React", "BootStrap", "Figma", "Vercel"],
      desc: "Developed a weather monitoring system that tracks real-time environmental data and displays weather conditions.",
      demo: "https://sky-cast-dashboard.vercel.app/",
      code: "https://github.com/NizamUddin988/SkyCast-DashBoard"
    },
    {
      id: 5,
      title: "To-Do-List",
      tech: ["React", "BootStrap", "Figma", "Vercel"],
      desc: "A To-Do List application for managing tasks with features like adding, updating, deleting, and marking tasks as completed.",
      demo: "https://process-todo-list.vercel.app/",
      code: "https://github.com/NizamUddin988/To-Do-List"
    },
    {
      id: 6,
      title: "Tic-Tac-Toe Game",
      tech: ["HTML", "CSS", "JS", "vercel"],
      desc: "Developed a Tic Tac Toe game with game logic for player turns, win conditions, and draw scenarios.",
      demo: "https://tictactoe-refresh.vercel.app/",
      code: "https://github.com/NizamUddin988/Tic_Tac_Toe"
    }
  ];

  const filteredSkills = getFilteredSkills();

  // Likes Logic
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchLikes = async () => {
    try {
      const response = await fetch('/api/likes');
      const data = await response.json();
      setLikes(data.count || 0);
    } catch (error) {
      console.error('Error fetching likes:', error);
    } finally {
      setLoading(false);
    }
  };

  const like = async () => {
    if (liked || loading) return;

    try {
      setLoading(true);
      setLiked(true);
      setLikes(prev => prev + 1);
      localStorage.setItem('portfolio_liked', 'true');

      const response = await fetch('/api/likes', { method: 'POST' });
      const data = await response.json();

      if (!response.ok) throw new Error();
      setLikes(data.count);
    } catch (error) {
      console.error('Error liking:', error);
      setLiked(false);
      setLikes(prev => prev - 1);
      localStorage.removeItem('portfolio_liked');
      alert('Failed to like. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikes();
    const hasLiked = localStorage.getItem('portfolio_liked');
    if (hasLiked === 'true') {
      setLiked(true);
    }
  }, []);
  
  const [greetingDone, setGreetingDone] = useState(false);

  return (
    <>
      <div className="nav">
        <div className="nav-container">
          <h1>MyPortfolio</h1>
          <button 
            className="menu-toggle" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
            </svg>
          </button>
          <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <a href="#home" onClick={() => setIsMenuOpen(false)}>Home</a>
            <a href="#skills" onClick={() => setIsMenuOpen(false)}>Skills</a>
            <a href="#projects" onClick={() => setIsMenuOpen(false)}>Projects</a>
            <a href="#certifications" onClick={() => setIsMenuOpen(false)}>Certifications</a>
            <a href="#gallery" onClick={() => setIsMenuOpen(false)}>Gallery</a>
            <a href="#about" onClick={() => setIsMenuOpen(false)}>About</a>
          </div>
        </div>
      </div>
      
      <div className="main-content">
        <div className="hero-section" id="home">
          <div className="hero-container">
            <div className="hero-text"><h1 style={{
             background: 'linear-gradient(135deg, #6e57e0, #fdbb2d, #ff6b6b)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}}>
              <TypewriterText
                text="Hello! Welcome to my site"
                delay={400}
                speed={80}
                className="niz"
                tag="p"
                onDone={() => setGreetingDone(true)}
              /></h1>
              <h2 id="dev">
                <span style={{
                  background: 'linear-gradient(135deg, #6e57e0, #fdbb2d, #ff6b6b)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>I am</span>
                <br />
                {greetingDone && (
                  <TypewriterText
                    text="Nizam Uddin"
                    delay={400}
                    speed={80}
                    tag="span"
                    className="name-tw"
                  />
                )}
              </h2>
                 
              <div className="title-container">
                <span className="title-text">I'm a</span>
                <div className="sequence">
                  <span className='text-slide'>Full-Stack Developer</span>
                  <span className="text-slide">MERN-Stack Developer</span>
                  <span className="text-slide">Software Developer</span>
                  <span className="text-slide">Java Developer</span>
                </div>
              </div>
              
              <div className="hero-image">
                <div className='me'>
                  <img src="./developer.png" alt="Developer" className='img' />
                </div>
              </div>

              <button 
                onClick={like} 
                style={{
                  height: "clamp(36px, 6vw, 50px)",
                  width: "clamp(90px, 22vw, 120px)",
                  fontSize: "clamp(14px, 2.5vw, 20px)",   
                  background: liked ? "#888" : "#e74c3c",
                  fontWeight: 600,
                  color: 'white',
                  textAlign: "center",
                  border: "2px solid white",
                  borderRadius: "1em",
                  position: "fixed",
                  top: "4rem",
                  right: "0.5rem",
                  zIndex: "1000",
                  cursor: liked ? "default" : "pointer",
                  transition: "all 0.3s ease"
                }}
              >
                {liked ? "❤️" : "🤍"} {likes}
              </button>   
              <div className="scroll">↓ Scroll Down ↓</div>
            </div>
          </div>
        </div>
        
        <section className="skills-section-circle" id="skills">
          <div className="skills-header-circle">
            <h2 className="skills-title-circle">My Tech Stack</h2>
            <p className="skills-subtitle-circle">Hover over any bubble to explore</p>
            <div className="skills-divider">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <div className="skills-filters">
            {[
              { key: 'all', label: 'All Skills', icon: '✦' },
              { key: 'frontend', label: 'Frontend', icon: '🎨' },
              { key: 'backend', label: 'Backend', icon: '⚙️' },
              { key: 'database', label: 'Database', icon: '🗄️' },
              { key: 'tools', label: 'Tools', icon: '🛠️' },
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                className={`filter-chip ${selectedCategory === key ? 'active' : ''}`}
                onClick={() => setSelectedCategory(key)}
              >
                {icon} {label}
              </button>
            ))}
          </div>

          <div className="circle-container">
            <div className="circle-wrapper">
              <div className="orbit-glow orbit-glow-1" />
              <div className="orbit-glow orbit-glow-2" />
              <div className="orbit-glow orbit-glow-3" />

              <div className="circle-core">
                <div className="core-inner-ring" />
                <div className="core-text">
                  <span>⚡</span>
                  <span>SKILLS</span>
                  <span>HUB</span>
                </div>
              </div>
              <div className="circle-rings">
                <div className="ring ring-outer"></div>
                <div className="ring ring-middle"></div>
                <div className="ring ring-inner"></div>
              </div>
              {filteredSkills.map((skill, index) => (
                <SkillBubble
                  key={`${selectedCategory}-${skill.name}`}
                  skill={skill}
                  index={index}
                  total={filteredSkills.length}
                />
              ))}
            </div>
          </div>

          <div className="skills-stats-circle">
            <div className="stat-item">
              <div className="stat-number">{allSkills.length}+</div>
              <div className="stat-label">Technologies</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">10+</div>
              <div className="stat-label">Projects</div>
            </div>
          </div>
        </section>

        <section className="gallery-section" id="gallery">
          <h2 className="gallery-title">My Gallery</h2>
          <div className="gallery-grid">
            {galleryImages.map((image) => (
              <div key={image.id} className="gallery-item">
                <img src={image.src} alt={image.title} className="gallery-img" />
                <div className="gallery-overlay">
                  <h4>{image.title}</h4>
                  <p>{image.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="certificates-section" id="certifications">
          <h2 className="certificates-title">Certifications</h2>
          <div className="certificates-grid">
            {certificates.map((cert) => (
              <div 
                key={cert.id} 
                className="certificate-card"
                onClick={() => cert.filePath && window.open(cert.filePath, '_blank')}
                style={{ cursor: 'pointer' }}
              >
                <div className="certificate-icon">🏆</div>
                <h3>{cert.title}</h3>
                <p><strong>{cert.issuer}</strong></p>
                <p>{cert.desc}</p>
                <div className="view-certificate">
                  🔗 Click to Open Certificate
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="projects-section" id="projects">
          <h2 className="projects-title">Featured Projects</h2>
          <div className="projects-grid">
            {projects.map((project) => (
              <div key={project.id} className="project-card">
                <div className="project-header">
                  <h3>{project.title}</h3>
                  <div className="project-tech">
                    {project.tech.map((tech, idx) => (
                      <span key={idx} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
                <div className="project-body">
                  <p>{project.desc}</p>
                  <div className="project-links">
                    <a href={project.demo} className="project-link" target="_blank" rel="noopener noreferrer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"/>
                        <path d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"/>
                      </svg>
                      Live Demo
                    </a>
                    <a href={project.code} className="project-link" target="_blank" rel="noopener noreferrer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294l4-13zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z"/>
                      </svg>
                      Source Code
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <h2 className='flows'>Development Workflow</h2>
        
        <div className="con">
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-content">
                <h3>📋 Requirement Analysis</h3>
                <p>Gather and analyze project requirements, define objectives, and identify target audience.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-content">
                <h3>📐 Wireframing & Design</h3>
                <p>Create wireframes and high-fidelity mockups with modern UI/UX principles.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-content">
                <h3>⚛️ Frontend Development</h3>
                <p>Build responsive, interactive interfaces using React and modern frameworks.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-content">
                <h3>🖥️ Backend Development</h3>
                <p>Develop robust server-side logic, RESTful APIs, and database integration.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-content">
                <h3>🧪 Testing & QA</h3>
                <p>Comprehensive testing including unit, integration, and end-to-end tests.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-content">
                <h3>🚀 Deployment</h3>
                <p>Deploy to production with CI/CD pipelines and cloud infrastructure.</p>
              </div>
            </div>
          </div>
        </div>

        <div className='container' id="about">
          <div className='about'>
            <h2 className="about-title">About Me</h2>
            <p>
              I am a dedicated Full-Stack Java Developer and MERN-Stack Developer with expertise in
              designing and developing end-to-end applications. I am well-versed in React 
              for front-end with back-end technologies such as Node.js, Express.js, Spring Boot 
              and database management with MySQL and MongoDB. I have a moderate foundation
              in Data Structures & Algorithms (DSA) with Java, demonstrated 
              through consistent practice on LeetCode and HackerRank.
            </p>
            <a href='/NizamResume.pdf' className='button' download>
              Download Resume
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M4.5 9a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1zM4 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 1 0-1h4a.5.5 0 0 1 0 1z"/>
              </svg>
            </a>
          </div>
        </div>
        
        <footer>
          <h3>
            Get in Touch
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1"/>
            </svg>
          </h3>
          
          <div className="contact-info">
            <div className="contact-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 16 16">
                <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328z"/>
              </svg>
              <a href="tel:+917019706544">+91 7019706544</a>
            </div>
            <div className="contact-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.644-.182-.065-.315-.099-.445.099-.133.197-.513.644-.628.775-.114.133-.232.148-.43.05-.197-.1-.834-.308-1.588-.983a5.933 5.933 0 0 1-1.095-1.357c-.114-.198-.011-.304.087-.403.087-.088.197-.232.296-.347.1-.114.133-.198.198-.33.065-.132.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.38-.323-.319-.445-.33-.114-.01-.247-.01-.38-.01-.133 0-.348.05-.53.232-.182.18-.692.678-.692 1.654 0 .976.71 1.92.81 2.052.099.132 1.394 2.132 3.383 2.99.472.204.84.326 1.129.418.474.15.904.128 1.245.078.38-.056 1.17-.478 1.335-.94.164-.462.164-.857.114-.94-.05-.084-.182-.133-.38-.232z"/>
              </svg>
              <a href="https://wa.me/917019706544?text=Hello%20Nizam,%20I%20visited%20your%20portfolio%20and%20would%20like%20to%20connect%20with%20you." 
                target="_blank" 
                rel="noopener noreferrer">
                WhatsApp
              </a>
            </div>
            <div className="contact-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 16 16">
                <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"/>
              </svg>
              <a 
                href="https://mail.google.com/mail/?view=cm&fs=1&to=nizampasha218@gmail.com&su=Hello%20from%20Portfolio&body=Hi%20Nizam,%0A%0AI%20visited%20your%20portfolio%20and%20would%20like%20to%20connect."
                target="_blank"
                rel="noopener noreferrer"
              >
                nizampasha218@gmail.com
              </a>
            </div>
          </div>
          
          <div className='last'>
            <a href="https://github.com/NizamUddin988" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="45px" height="45px" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
              </svg>
            </a>
            
            <a href="https://www.linkedin.com/in/nizam-uddin-55404527b/" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="45px" height="45px" fill="currentColor" viewBox="0 0 16 16">
                <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
              </svg>
            </a>
          </div>
        </footer>
      </div>
    </>
  )
}

export default App
