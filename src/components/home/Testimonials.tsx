
import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    text: "TuneMigrate is simply amazing. I transferred my entire YouTube music collection to Spotify without a single mismatch. This is a game-changer!",
    author: "Alex Johnson",
    role: "Music Producer",
    stars: 5
  },
  {
    text: "After trying several other tools, TuneMigrate is the only one that correctly identified all my obscure indie tracks and matched them properly.",
    author: "Sarah Williams",
    role: "Playlist Curator",
    stars: 5
  },
  {
    text: "The confidence scores for each match gave me peace of mind. I knew exactly which songs needed my attention and which were perfectly matched.",
    author: "Michael Chen",
    role: "DJ & Music Enthusiast",
    stars: 5
  },
  {
    text: "As someone who carefully curates playlists, the accuracy of TuneMigrate is impressive. No more hours spent fixing incorrect matches.",
    author: "Jamie Lee",
    role: "Music Blogger",
    stars: 5
  }
];

interface TestimonialCardProps {
  testimonial: typeof testimonials[0];
  style?: React.CSSProperties;
}

const TestimonialCard = ({ testimonial, style }: TestimonialCardProps) => {
  return (
    <div 
      className="rounded-lg border bg-card p-6 shadow-subtle flex flex-col h-full animate-fade-up"
      style={style}
    >
      <div className="flex mb-4">
        {Array(testimonial.stars).fill(0).map((_, i) => (
          <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <blockquote className="text-balance flex-grow">
        <p className="text-lg">{testimonial.text}</p>
      </blockquote>
      <footer className="mt-4 pt-4 border-t">
        <div className="font-semibold">{testimonial.author}</div>
        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
      </footer>
    </div>
  );
};

const Testimonials = () => {
  return (
    <section className="py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight max-w-[800px] text-balance">
            What Our Users Say
          </h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-[700px] text-balance">
            Don't just take our word for it. Hear from the music lovers who use TuneMigrate.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, i) => (
            <TestimonialCard 
              key={i} 
              testimonial={testimonial} 
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
