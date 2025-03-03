
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-spotify/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container px-4 md:px-6">
        <div className="relative rounded-2xl overflow-hidden border shadow-lg gradient-blur bg-background p-6 sm:p-8 md:p-12">
          <div className="relative z-10 flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">
              Ready to Convert Your Playlists?
            </h2>
            <p className="text-xl text-muted-foreground text-balance">
              Try TuneMigrate today and experience the most accurate YouTube to Spotify conversion available.
            </p>
            <div className="pt-4">
              <Link to="/migrate">
                <Button size="lg" className="group">
                  Get Started Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
