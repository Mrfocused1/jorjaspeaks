interface CtaSectionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  items?: string[];
}

const defaultItems = [
  "Engaging Keynote Presentations",
  "Interactive Workshops",
  "Customized Content for Your Audience",
  "Virtual & In-Person Events",
  "Post-Event Resources",
];

export const CtaSection = ({
  title = "Get Started with Jorja",
  description = "Ready to inspire your audience? Book a speaking engagement today and bring Jorja's transformative message to your next event.",
  buttonText = "Book Now",
  buttonUrl = "#contact",
  items = defaultItems,
}: CtaSectionProps) => {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-content">
          <div className="cta-background-image"></div>
          <div className="cta-text">
            <h2 className="animate-on-scroll">{title}</h2>
            <p className="animate-on-scroll">{description}</p>
            <a href={buttonUrl} className="btn btn-primary cta-button animate-on-scroll">
              {buttonText}
            </a>
          </div>
          <div className="cta-list">
            <ul>
              {items.map((item, idx) => (
                <li key={idx}>
                  <span className="cta-check">✔</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
