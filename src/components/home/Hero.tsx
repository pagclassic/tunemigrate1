
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Youtube, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Hero = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Gradient blur background */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-1/4 w-1/2 h-1/2 bg-youtube/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-1/2 h-1/2 bg-spotify/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium bg-background">
            <span className="block sm:hidden">New</span>
            <span className="hidden sm:block">Introducing TuneMigrate — Seamlessly convert between platforms</span>
            <svg
              className="h-3.5 w-3.5 ml-1"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round" 
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance max-w-3xl font-display animate-fade-up">
            Your Music, <span className="text-primary">Anywhere</span>, Without Compromise
          </h1>

          <p className="text-muted-foreground max-w-[42rem] text-balance text-lg md:text-xl animate-fade-up" style={{ animationDelay: "100ms" }}>
            Experience the most accurate YouTube to Spotify playlist conversion with our AI-powered matching. No more wrong versions, missing tracks, or manual fixes.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "200ms" }}>
            <Link to="/migrate">
              <Button size="lg" className="group">
                Start Converting
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button size="lg" variant="outline">
                How It Works
              </Button>
            </Link>
          </div>

          <div className="mt-12 md:mt-16 rounded-lg border bg-card p-2 shadow-subtle animate-fade-up" style={{ animationDelay: "300ms" }}>
            <div className="rounded-md overflow-hidden aspect-video w-full max-w-4xl bg-black">
              <div className="h-full w-full flex items-center justify-center bg-black/90">
                <div className="text-center p-8">
                  <div className="flex justify-center space-x-4 mb-4">
                    <div className="size-12 rounded-full bg-youtube/10 flex items-center justify-center">
                      <Youtube className="size-6 text-youtube" />
                    </div>
                    <ArrowRight className="size-6 text-muted-foreground self-center" />
                    <div className="size-12 rounded-full bg-spotify/10 flex items-center justify-center">
                      <Music className="size-6 text-spotify" />
                    </div>
                  </div>
                  <p className="text-white text-lg font-medium">Demo Video Preview</p>
                  <p className="text-white/70 text-sm mt-1">See how seamlessly TuneMigrate works</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
