import { useState, useEffect } from 'react';
import { StickyScroll } from './components/StickyScroll';
import { VerticalAccordion, AccordionItem } from './components/VerticalAccordion';
import { TestimonialsSection } from './components/TestimonialsSection';
import Counter from './components/Counter';
import { CtaSection } from './components/CtaSection';
import { FiBarChart, FiBell, FiDollarSign, FiPlay, FiArrowUp, FiMail, FiPhone, FiMenu, FiX } from "react-icons/fi";
import { FaLinkedin, FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    eventDate: '',
    message: ''
  });

  const [isMobile, setIsMobile] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const words = ['Lead.', 'Innovate.', 'Engage.', 'Succeed.'];
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    // Preload all images
    const imagesToLoad = [
      '/images/4-desktop.jpg',
      '/images/mobile 4.jpg',
      '/images/about jorja 4.jpg',
      '/images/crowd-2.jpg',
      '/images/get in touch.jpg',
      '/images/Get Started.jpg',
      '/images/leadership.png',
      '/images/personal development.jpg',
      '/images/innovation.png',
      '/images/Communication skills.jpg'
    ];

    let loadedCount = 0;
    const totalImages = imagesToLoad.length;

    const imagePromises = imagesToLoad.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          setLoadingProgress(Math.round((loadedCount / totalImages) * 100));
          resolve(src);
        };
        img.onerror = () => {
          loadedCount++;
          setLoadingProgress(Math.round((loadedCount / totalImages) * 100));
          resolve(src); // Resolve anyway to not block loading
        };
        img.src = src;
      });
    });

    Promise.all(imagePromises).then(() => {
      // Wait a bit to show 100% before hiding loader
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);

      // Show button when scrolled past hero section (approximately 600px)
      setShowScrollTop(position > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Prevent body scroll when mobile menu is open
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
        }
      });
    }, observerOptions);

    // Observe all elements with animate-on-scroll class
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => observer.observe(el));

    return () => {
      animateElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  const speakingTopics = [
    {
      title: "Leadership Excellence",
      description: "Transform your leadership approach with actionable strategies that inspire teams and drive organizational success. Jorja delivers powerful insights on authentic leadership, emotional intelligence, and creating cultures of accountability.",
      content: (
        <div className="sticky-scroll-image-container">
          <img src="/images/leadership.png" alt="Leadership Excellence" />
        </div>
      )
    },
    {
      title: "Personal Development",
      description: "Unlock your full potential through proven strategies for growth, resilience, and peak performance. Jorja combines research-backed frameworks with practical tools to help individuals break through limitations and achieve sustainable success.",
      content: (
        <div className="sticky-scroll-image-container">
          <img src="/images/personal development.jpg" alt="Personal Development" />
        </div>
      )
    },
    {
      title: "Innovation & Change",
      description: "Navigate organizational transformation with practical frameworks that turn resistance into momentum. Jorja provides actionable strategies for leading change initiatives, fostering innovation, and building adaptive organizations.",
      content: (
        <div className="sticky-scroll-image-container">
          <img src="/images/innovation.png" alt="Innovation & Change" />
        </div>
      )
    },
    {
      title: "Communication Skills",
      description: "Master the art of influential communication that builds relationships, resolves conflicts, and drives results. Jorja teaches practical techniques for clear messaging, active listening, and adapting your communication style for maximum impact.",
      content: (
        <div className="sticky-scroll-image-container">
          <img src="/images/Communication skills.jpg" alt="Communication Skills" />
        </div>
      )
    },
  ];

  const accordionItems: AccordionItem[] = [
    {
      id: 1,
      title: "Leadership",
      Icon: FiDollarSign,
      imgSrc: "/images/leadership.png",
      description: "Transform your leadership approach with actionable strategies that inspire teams and drive organizational success.",
    },
    {
      id: 2,
      title: "Development",
      Icon: FiPlay,
      imgSrc: "/images/personal development.jpg",
      description: "Unlock your full potential through proven strategies for growth, resilience, and peak performance.",
    },
    {
      id: 3,
      title: "Innovation",
      Icon: FiBell,
      imgSrc: "/images/innovation.png",
      description: "Navigate organizational transformation with practical frameworks that turn resistance into momentum.",
    },
    {
      id: 4,
      title: "Communication",
      Icon: FiBarChart,
      imgSrc: "/images/Communication skills.jpg",
      description: "Master the art of influential communication that builds relationships, resolves conflicts, and drives results.",
    },
  ];

  const testimonialsData = [
    {
      author: {
        name: "Sarah Johnson",
        title: "CEO, TechCorp",
      },
      text: "Jorja's presentation was the highlight of our conference. Her insights were practical and immediately applicable to our work. The team left inspired and ready to implement real change."
    },
    {
      author: {
        name: "Michael Chen",
        title: "Event Organizer",
      },
      text: "An incredible speaker who connects with the audience on a personal level. Our team left inspired and motivated. Jorja has a unique ability to make complex topics accessible."
    },
    {
      author: {
        name: "Jennifer Williams",
        title: "HR Director, GlobalEnt",
      },
      text: "Jorja delivered exactly what we needed. Professional, engaging, and full of valuable takeaways. The feedback from our leadership team was overwhelmingly positive."
    },
    {
      author: {
        name: "David Martinez",
        title: "VP of Operations",
      },
      text: "We've had many speakers at our events, but Jorja stands out. Her energy is contagious and her message resonates long after the presentation ends."
    },
    {
      author: {
        name: "Lisa Anderson",
        title: "Learning & Development Manager",
      },
      text: "Jorja's workshop transformed our approach to leadership development. The tools and frameworks she provided are now core to our training program."
    },
    {
      author: {
        name: "Robert Taylor",
        title: "Conference Chair",
      },
      text: "Booking Jorja was one of the best decisions we made. Her keynote was powerful, authentic, and perfectly tailored to our audience. Highly recommend!"
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your message! Jorja will be in touch soon.');
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Loading Screen */}
      {isLoading && (
        <div className="loading-screen">
          <div className="loading-content">
            <h1 className="loading-title">Jorja Green</h1>
            <div className="loading-bar-container">
              <div className="loading-bar" style={{ width: `${loadingProgress}%` }}></div>
            </div>
            <p className="loading-percentage">{loadingProgress}%</p>
          </div>
        </div>
      )}

      <div className="app">
        {/* Navigation */}
        <nav className="navbar">
        <div className="container">
          <div className="logo">Jorja Green</div>
          <ul className="nav-links">
            <li><a href="#about">About</a></li>
            <li><a href="#speaking">Speaking</a></li>
            <li><a href="#testimonials">Testimonials</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <button
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu} />
      )}

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-menu-links">
          <li><a href="#about" onClick={closeMobileMenu}>About</a></li>
          <li><a href="#speaking" onClick={closeMobileMenu}>Speaking</a></li>
          <li><a href="#testimonials" onClick={closeMobileMenu}>Testimonials</a></li>
          <li><a href="#contact" onClick={closeMobileMenu}>Contact</a></li>
        </ul>

        <div className="mobile-menu-footer">
          <div className="mobile-menu-contact">
            <div className="mobile-menu-contact-item">
              <FiPhone />
              <span>020 5847 3453</span>
            </div>
            <div className="mobile-menu-contact-item">
              <FiMail />
              <span>info@jorjaspeaks.site</span>
            </div>
          </div>

          <div className="mobile-menu-social">
            <span aria-label="LinkedIn">
              <FaLinkedin />
            </span>
            <span aria-label="Instagram">
              <FaInstagram />
            </span>
            <span aria-label="Twitter">
              <FaTwitter />
            </span>
            <span aria-label="Facebook">
              <FaFacebook />
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section
        className="hero"
        style={{ backgroundPositionY: scrollPosition * 0.5 }}
      >
        <div className="hero-content">
          <div className="hero-text">
            <h1>Inspire. Transform. <span key={wordIndex} className="fading-word">{words[wordIndex]}</span></h1>
            <p className="hero-subtitle">Empowering audiences with actionable insights and authentic storytelling</p>
            <a href="#contact" className="btn btn-primary">Book a Speaking Engagement</a>
          </div>
        </div>
      </section>

      {/* Trusted By Section - removed as per earlier change */}

      {/* About Section */}
      <section id="about" className="about">
        <div className="about-image animate-on-scroll">
          {/* Image is now a CSS background */}
        </div>
        <div className="about-text animate-on-scroll">
          <h2 className="animate-on-scroll">About Jorja</h2>
          <p className="animate-on-scroll">Jorja Green is a dynamic public speaker who brings energy, expertise, and authenticity to every stage. With years of experience inspiring audiences worldwide, she delivers powerful messages that drive real change.</p>
          <p className="animate-on-scroll">Her engaging speaking style combines research-backed insights with relatable stories that resonate long after the event ends.</p>
          <div className="stats-container">
            <div className="stat-item animate-on-scroll">
              <span className="stat-number"><Counter target={20} />+</span>
              <span className="stat-text">Speeches Given</span>
            </div>
            <div className="stat-item animate-on-scroll">
              <span className="stat-number"><Counter target={50} />+</span>
              <span className="stat-text">Happy Clients</span>
            </div>
            <div className="stat-item animate-on-scroll">
              <span className="stat-number"><Counter target={10} />+</span>
              <span className="stat-text">Years of Experience</span>
            </div>
          </div>
        </div>
      </section>

      {/* Speaking Topics Section */}
      <section id="speaking" className="speaking-section">
        <div className="container">
          <h2 className="speaking-title animate-on-scroll">Speaking Topics</h2>
        </div>
        <div className="animate-on-scroll">
          {isMobile ? (
            <VerticalAccordion items={accordionItems} />
          ) : (
            <StickyScroll content={speakingTopics} />
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection
        title="What People Say"
        description="Hear from event organizers, executives, and teams who have experienced Jorja's transformative presentations."
        testimonials={testimonialsData}
      />

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <h2 className="animate-on-scroll">Get in Touch</h2>

          <form className="contact-form animate-on-scroll" onSubmit={handleSubmit}>
            <div className="form-row animate-on-scroll">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="organization">Organization</label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="event-date">Event Date</label>
              <input
                type="date"
                id="event-date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                value={formData.message}
                onChange={handleInputChange}
              />
            </div>

            <button type="submit" className="btn btn-primary">Send Message</button>
          </form>
        </div>
      </section>

      <CtaSection />

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section animate-on-scroll">
              <h3>Jorja Green</h3>
              <p>Inspiring audiences with actionable insights and authentic storytelling</p>
            </div>

            <div className="footer-section animate-on-scroll">
              <h4>Contact</h4>
              <div className="footer-contact">
                <div className="footer-link">
                  <FiPhone /> 020 5847 3453
                </div>
                <div className="footer-link">
                  <FiMail /> info@jorjaspeaks.site
                </div>
              </div>
            </div>

            <div className="footer-section animate-on-scroll">
              <h4>Follow</h4>
              <div className="footer-social">
                <span aria-label="LinkedIn">
                  <FaLinkedin />
                </span>
                <span aria-label="Instagram">
                  <FaInstagram />
                </span>
                <span aria-label="Twitter">
                  <FaTwitter />
                </span>
                <span aria-label="Facebook">
                  <FaFacebook />
                </span>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2025 Jorja Green. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <button
        className={`scroll-to-top ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <FiArrowUp />
      </button>
      </div>
    </>
  );
}

export default App;
