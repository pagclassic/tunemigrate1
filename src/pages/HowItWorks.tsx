
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Youtube, Music, Zap, Search, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Step = ({ 
  number, 
  title, 
  description, 
  icon 
}: { 
  number: number; 
  title: string; 
  description: string; 
  icon: React.ReactNode;
}) => {
  return (
    <div className="relative pl-12 pb-10 animate-fade-up" style={{ animationDelay: `${number * 100}ms` }}>
      {/* Line connecting steps */}
      {number < 5 && (
        <div className="absolute left-6 top-10 bottom-0 w-px bg-border -translate-x-1/2"></div>
      )}
      {/* Step number with icon */}
      <div className="absolute left-0 top-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-2 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

const HowItWorks = () => {
  return (
    <AppLayout>
      <section className="py-12 md:py-24">
        <div className="container max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight mb-4 animate-fade-down">How TuneMigrate Works</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-up">
              Our advanced AI-powered process ensures the most accurate YouTube to Spotify conversions possible.
            </p>
          </div>
          
          <div className="space-y-6">
            <Step 
              number={1}
              title="Input Your YouTube Playlist"
              description="Simply paste the URL of your YouTube playlist. Our system will fetch all the necessary data including track titles, artists, and durations."
              icon={<Youtube className="h-6 w-6" />}
            />
            
            <Step 
              number={2}
              title="AI-Powered Analysis"
              description="Our sophisticated AI analyzes each track's metadata to extract accurate song information, even from unclear or incomplete titles."
              icon={<Zap className="h-6 w-6" />}
            />
            
            <Step 
              number={3}
              title="Advanced Matching Algorithm"
              description="We use a multi-factor matching system that considers title, artist, duration, album, and popularity to find the exact right version of each song on Spotify."
              icon={<Search className="h-6 w-6" />}
            />
            
            <Step 
              number={4}
              title="Match Confidence Scoring"
              description="Each match is assigned a confidence score. High scores (90-100%) indicate perfect matches, while lower scores might suggest alternative versions or potential mismatches."
              icon={<CheckCircle className="h-6 w-6" />}
            />
            
            <Step 
              number={5}
              title="Spotify Playlist Creation"
              description="After reviewing and approving the matches, we create a new playlist directly in your Spotify account with all the matched songs."
              icon={<Music className="h-6 w-6" />}
            />
          </div>
          
          <div className="mt-16 space-y-8">
            <div className="rounded-lg border p-6 bg-muted/30 animate-fade-up">
              <h3 className="text-xl font-semibold mb-4">What Makes Our AI Matching Special?</h3>
              <ul className="space-y-3">
                <li className="flex">
                  <div className="mr-3 mt-1 flex-shrink-0">
                    <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-primary" />
                    </div>
                  </div>
                  <p><span className="font-medium">Fuzzy Title Matching:</span> Identifies songs even when titles contain extra words or slight variations</p>
                </li>
                <li className="flex">
                  <div className="mr-3 mt-1 flex-shrink-0">
                    <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-primary" />
                    </div>
                  </div>
                  <p><span className="font-medium">Artist Recognition:</span> Correctly identifies primary artists even when collaborators are listed differently</p>
                </li>
                <li className="flex">
                  <div className="mr-3 mt-1 flex-shrink-0">
                    <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-primary" />
                    </div>
                  </div>
                  <p><span className="font-medium">Version Selection:</span> Distinguishes between original recordings, remixes, and live versions</p>
                </li>
                <li className="flex">
                  <div className="mr-3 mt-1 flex-shrink-0">
                    <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-primary" />
                    </div>
                  </div>
                  <p><span className="font-medium">Duration Verification:</span> Ensures the correct version by comparing track lengths</p>
                </li>
                <li className="flex">
                  <div className="mr-3 mt-1 flex-shrink-0">
                    <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-primary" />
                    </div>
                  </div>
                  <p><span className="font-medium">Continuous Learning:</span> Our system improves with each conversion based on user feedback</p>
                </li>
              </ul>
            </div>
            
            <div className="rounded-lg border overflow-hidden animate-fade-up" style={{ animationDelay: "200ms" }}>
              <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="bg-youtube/10 p-6 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r">
                  <Youtube className="h-10 w-10 text-youtube mb-4" />
                  <h3 className="text-lg font-semibold">YouTube</h3>
                  <p className="text-sm text-muted-foreground mt-2">Your original playlist content</p>
                </div>
                <div className="p-6 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r">
                  <Zap className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-lg font-semibold">TuneMigrate AI</h3>
                  <p className="text-sm text-muted-foreground mt-2">Our advanced matching technology</p>
                </div>
                <div className="bg-spotify/10 p-6 flex flex-col items-center justify-center text-center">
                  <Music className="h-10 w-10 text-spotify mb-4" />
                  <h3 className="text-lg font-semibold">Spotify</h3>
                  <p className="text-sm text-muted-foreground mt-2">Your new perfectly matched playlist</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center animate-fade-up" style={{ animationDelay: "300ms" }}>
            <h3 className="text-2xl font-semibold mb-4">Ready to Convert Your Playlist?</h3>
            <Link to="/migrate">
              <Button size="lg" className="group">
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </AppLayout>
  );
};

export default HowItWorks;
