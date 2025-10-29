import { useState, useEffect } from 'react';
import { StickyScroll } from './components/StickyScroll';
import { VerticalAccordion, AccordionItem } from './components/VerticalAccordion';
import { TestimonialsSection } from './components/TestimonialsSection';
import Counter from './components/Counter';
import { CtaSection } from './components/CtaSection';
import { FiBarChart, FiBell, FiDollarSign, FiPlay } from "react-icons/fi";
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
  const words = ['Lead.', 'Innovate.', 'Engage.', 'Succeed.'];
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.pageYOffset);
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

  const speakingTopics = [
    {
      title: "Leadership Excellence",
      description: "Transform your leadership approach with actionable strategies that inspire teams and drive organizational success. Georgia delivers powerful insights on authentic leadership, emotional intelligence, and creating cultures of accountability.",
      content: (
        <div className="sticky-scroll-image-container">
          <img src="/images/leadership.png" alt="Leadership Excellence" />
        </div>
      )
    },
    {
      title: "Personal Development",
      description: "Unlock your full potential through proven strategies for growth, resilience, and peak performance. Georgia combines research-backed frameworks with practical tools to help individuals break through limitations and achieve sustainable success.",
      content: (
        <div className="sticky-scroll-image-container">
          <img src="/images/personal development.jpg" alt="Personal Development" />
        </div>
      )
    },
    {
      title: "Innovation & Change",
      description: "Navigate organizational transformation with practical frameworks that turn resistance into momentum. Georgia provides actionable strategies for leading change initiatives, fostering innovation, and building adaptive organizations.",
      content: (
        <div className="sticky-scroll-image-container">
          <img src="/images/innovation.png" alt="Innovation & Change" />
        </div>
      )
    },
    {
      title: "Communication Skills",
      description: "Master the art of influential communication that builds relationships, resolves conflicts, and drives results. Georgia teaches practical techniques for clear messaging, active listening, and adapting your communication style for maximum impact.",
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
      text: "Georgia's presentation was the highlight of our conference. Her insights were practical and immediately applicable to our work. The team left inspired and ready to implement real change."
    },
    {
      author: {
        name: "Michael Chen",
        title: "Event Organizer",
      },
      text: "An incredible speaker who connects with the audience on a personal level. Our team left inspired and motivated. Georgia has a unique ability to make complex topics accessible."
    },
    {
      author: {
        name: "Jennifer Williams",
        title: "HR Director, GlobalEnt",
      },
      text: "Georgia delivered exactly what we needed. Professional, engaging, and full of valuable takeaways. The feedback from our leadership team was overwhelmingly positive."
    },
    {
      author: {
        name: "David Martinez",
        title: "VP of Operations",
      },
      text: "We've had many speakers at our events, but Georgia stands out. Her energy is contagious and her message resonates long after the presentation ends."
    },
    {
      author: {
        name: "Lisa Anderson",
        title: "Learning & Development Manager",
      },
      text: "Georgia's workshop transformed our approach to leadership development. The tools and frameworks she provided are now core to our training program."
    },
    {
      author: {
        name: "Robert Taylor",
        title: "Conference Chair",
      },
      text: "Booking Georgia was one of the best decisions we made. Her keynote was powerful, authentic, and perfectly tailored to our audience. Highly recommend!"
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your message! Georgia will be in touch soon.');
  };

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="logo">Georgia Green</div>
          <ul className="nav-links">
            <li><a href="#about">About</a></li>
            <li><a href="#speaking">Speaking</a></li>
            <li><a href="#testimonials">Testimonials</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
      </nav>

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
        <div className="about-image">
          {/* Image is now a CSS background */}
        </div>
        <div className="about-text">
          <h2>About Georgia</h2>
          <p>Georgia Green is a dynamic public speaker who brings energy, expertise, and authenticity to every stage. With years of experience inspiring audiences worldwide, she delivers powerful messages that drive real change.</p>
          <p>Her engaging speaking style combines research-backed insights with relatable stories that resonate long after the event ends.</p>
          <div className="stats-container">
            <div className="stat-item">
              <span className="stat-number"><Counter target={20} />+</span>
              <span className="stat-text">Speeches Given</span>
            </div>
            <div className="stat-item">
              <span className="stat-number"><Counter target={50} />+</span>
              <span className="stat-text">Happy Clients</span>
            </div>
            <div className="stat-item">
              <span className="stat-number"><Counter target={10} />+</span>
              <span className="stat-text">Years of Experience</span>
            </div>
          </div>
        </div>
      </section>

      {/* Speaking Topics Section */}
      <section id="speaking" className="speaking-section">
        <div className="container">
          <h2 className="speaking-title">Speaking Topics</h2>
        </div>
        {isMobile ? (
          <VerticalAccordion items={accordionItems} />
        ) : (
          <StickyScroll content={speakingTopics} />
        )}
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection
        title="What People Say"
        description="Hear from event organizers, executives, and teams who have experienced Georgia's transformative presentations."
        testimonials={testimonialsData}
      />

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <h2>Get in Touch</h2>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
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
          <p>&copy; 2025 Georgia Green. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
