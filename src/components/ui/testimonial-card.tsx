

export interface TestimonialAuthor {
  name: string;
  title: string;
  avatar?: string;
}

interface TestimonialCardProps {
  author: TestimonialAuthor;
  text: string;
  href?: string;
}

export function TestimonialCard({ author, text, href }: TestimonialCardProps) {
  const CardWrapper = href ? 'a' : 'div';
  const cardProps = href ? { href, target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <CardWrapper
      className="testimonial-card-wrapper"
      {...cardProps}
    >
      <div className="testimonial-card">
        <p className="testimonial-card-text">{text}</p>
        <div className="testimonial-card-author">
          {author.avatar && (
            <img
              src={author.avatar}
              alt={author.name}
              className="testimonial-card-avatar"
            />
          )}
          <div className="testimonial-card-author-info">
            <p className="testimonial-card-author-name">{author.name}</p>
            <p className="testimonial-card-author-title">{author.title}</p>
          </div>
        </div>
      </div>
    </CardWrapper>
  );
}
