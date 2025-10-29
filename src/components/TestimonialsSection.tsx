import { cn } from "../lib/utils"
import { TestimonialCard, TestimonialAuthor } from "./ui/testimonial-card"

interface TestimonialsSectionProps {
  title: string
  description: string
  testimonials: Array<{
    author: TestimonialAuthor
    text: string
    href?: string
  }>
  className?: string
}

export function TestimonialsSection({
  title,
  description,
  testimonials,
  className
}: TestimonialsSectionProps) {
  return (
    <section className={cn("testimonials-marquee-section", className)}>
      <div className="testimonials-marquee-container">
        <div className="testimonials-marquee-header">
          <h2 className="testimonials-marquee-title">
            {title}
          </h2>
          <p className="testimonials-marquee-description">
            {description}
          </p>
        </div>

        <div className="testimonials-marquee-wrapper">
          <div className="testimonials-marquee-track">
            <div className="testimonials-marquee-content">
              {[...Array(4)].map((_, setIndex) => (
                testimonials.map((testimonial, i) => (
                  <TestimonialCard
                    key={`${setIndex}-${i}`}
                    {...testimonial}
                  />
                ))
              ))}
            </div>
          </div>

          <div className="testimonials-marquee-gradient-left" />
          <div className="testimonials-marquee-gradient-right" />
        </div>
      </div>
    </section>
  )
}
