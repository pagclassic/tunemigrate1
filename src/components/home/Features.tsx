
import React from 'react';
import { cn } from '@/lib/utils';
import { Music, Zap, Sparkles, CheckCircle, Shuffle, Settings, Layers } from 'lucide-react';

const features = [
  {
    icon: <Music className="h-6 w-6" />,
    title: "Seamless Playlist Import",
    description: "Import your YouTube playlists with a single click. No more manual copying and pasting."
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "AI-Powered Matching",
    description: "Our advanced AI algorithms ensure that each song is matched with the correct version on Spotify."
  },
  {
    icon: <CheckCircle className="h-6 w-6" />,
    title: "Match Confidence Indicators",
    description: "See how confident our system is about each match, with visual indicators and percentage scores."
  },
  {
    icon: <Shuffle className="h-6 w-6" />,
    title: "Smart Replacement Suggestions",
    description: "For songs that can't be matched perfectly, we provide intelligent alternatives based on your preferences."
  },
  {
    icon: <Settings className="h-6 w-6" />,
    title: "Customizable Matching",
    description: "Fine-tune the matching process with preferences for original versions, remixes, or live recordings."
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Continuous Learning",
    description: "Our system learns from user feedback to improve matching accuracy for everyone over time."
  }
];

const FeatureCard = ({ feature, className }: { feature: typeof features[0], className?: string }) => {
  return (
    <div className={cn(
      "group relative rounded-lg border bg-card p-6 shadow-subtle transition-all hover:shadow-md", 
      className
    )}>
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        {feature.icon}
      </div>
      <h3 className="mb-2 font-semibold tracking-tight text-lg">{feature.title}</h3>
      <p className="text-muted-foreground">{feature.description}</p>
    </div>
  );
};

const Features = () => {
  return (
    <section className="py-20 relative overflow-hidden" id="features">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight max-w-[800px] text-balance">
            Powered by Advanced AI for Unmatched Accuracy
          </h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-[700px] text-balance">
            Our cutting-edge technology ensures your music transfers perfectly between platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index} 
              feature={feature} 
              className="animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
