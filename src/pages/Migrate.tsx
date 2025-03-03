
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Youtube, Music, Search, CheckCircle, AlertCircle } from 'lucide-react';

// Mock playlist data for demonstration
const mockPlaylist = {
  title: "My Awesome Mix",
  thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  trackCount: 12,
  creator: "John Doe"
};

// Mock tracks with match confidence
const mockTracks = [
  { id: 1, title: "Never Gonna Give You Up", artist: "Rick Astley", duration: "3:32", confidence: 98, status: "high" },
  { id: 2, title: "Bohemian Rhapsody", artist: "Queen", duration: "5:54", confidence: 96, status: "high" },
  { id: 3, title: "Imagine", artist: "John Lennon", duration: "3:03", confidence: 92, status: "high" },
  { id: 4, title: "Hotel California", artist: "Eagles", duration: "6:30", confidence: 89, status: "medium" },
  { id: 5, title: "The Sound of Silence (Live)", artist: "Disturbed", duration: "4:08", confidence: 67, status: "low" },
  { id: 6, title: "Sweet Child O' Mine", artist: "Guns N' Roses", duration: "5:56", confidence: 95, status: "high" },
  { id: 7, title: "Billie Jean", artist: "Michael Jackson", duration: "4:54", confidence: 94, status: "high" },
  { id: 8, title: "Stairway to Heaven", artist: "Led Zeppelin", duration: "8:02", confidence: 88, status: "medium" },
  { id: 9, title: "Smells Like Teen Spirit", artist: "Nirvana", duration: "5:01", confidence: 91, status: "high" },
  { id: 10, title: "Despacito Remix", artist: "Luis Fonsi ft. Justin Bieber", duration: "3:48", confidence: 72, status: "medium" },
  { id: 11, title: "Random Indie Track (Official Audio)", artist: "Unknown Artist", duration: "4:17", confidence: 45, status: "low" },
  { id: 12, title: "Custom Song Name That's Hard to Match", artist: "Various Artists", duration: "6:29", confidence: 33, status: "low" },
];

const ConfidenceIndicator = ({ confidence }: { confidence: number }) => {
  let color = "bg-red-500";
  if (confidence >= 90) {
    color = "bg-green-500";
  } else if (confidence >= 70) {
    color = "bg-yellow-500";
  }
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={`h-full ${color}`} 
          style={{ width: `${confidence}%` }}
        ></div>
      </div>
      <span className="text-sm font-medium w-8">{confidence}%</span>
    </div>
  );
};

const StatusIndicator = ({ status }: { status: string }) => {
  if (status === "high") {
    return (
      <div className="flex items-center text-green-500">
        <CheckCircle className="mr-1 h-4 w-4" />
        <span className="text-xs font-medium">High Match</span>
      </div>
    );
  } else if (status === "medium") {
    return (
      <div className="flex items-center text-yellow-500">
        <CheckCircle className="mr-1 h-4 w-4" />
        <span className="text-xs font-medium">Medium Match</span>
      </div>
    );
  } else {
    return (
      <div className="flex items-center text-red-500">
        <AlertCircle className="mr-1 h-4 w-4" />
        <span className="text-xs font-medium">Low Match</span>
      </div>
    );
  }
};

const Migrate = () => {
  const [url, setUrl] = useState("");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid YouTube playlist URL",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleCreatePlaylist = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep(3);
      toast({
        title: "Success!",
        description: "Your playlist has been created on Spotify",
        variant: "default",
      });
    }, 2000);
  };

  return (
    <AppLayout className="py-10">
      <div className="container max-w-5xl">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Convert YouTube to Spotify</h1>
            <p className="mt-2 text-muted-foreground">Transform your YouTube playlists into Spotify collections with perfect matching</p>
          </div>

          {/* Progress steps */}
          <div className="relative">
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-1 bg-muted"></div>
            <div className="relative flex justify-between max-w-xl mx-auto">
              <div className={`flex flex-col items-center ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`size-10 rounded-full flex items-center justify-center z-10 ${step >= 1 ? "bg-primary text-white" : "bg-muted"}`}>
                  <span>1</span>
                </div>
                <span className="mt-2 text-sm">Import</span>
              </div>
              <div className={`flex flex-col items-center ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`size-10 rounded-full flex items-center justify-center z-10 ${step >= 2 ? "bg-primary text-white" : "bg-muted"}`}>
                  <span>2</span>
                </div>
                <span className="mt-2 text-sm">Review Matches</span>
              </div>
              <div className={`flex flex-col items-center ${step >= 3 ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`size-10 rounded-full flex items-center justify-center z-10 ${step >= 3 ? "bg-primary text-white" : "bg-muted"}`}>
                  <span>3</span>
                </div>
                <span className="mt-2 text-sm">Create Playlist</span>
              </div>
            </div>
          </div>

          {/* Step 1: URL input */}
          {step === 1 && (
            <Card className="animate-fade-up">
              <CardHeader>
                <CardTitle>Enter Your YouTube Playlist URL</CardTitle>
                <CardDescription>
                  Paste the URL of your YouTube playlist to begin the conversion process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUrlSubmit} className="space-y-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        className="pl-10"
                        placeholder="https://www.youtube.com/playlist?list=..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                      />
                    </div>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Analyzing..." : "Analyze Playlist"}
                    </Button>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between items-center border-t pt-6">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Youtube className="mr-1 h-4 w-4" />
                  <span>YouTube</span>
                  <ArrowRight className="mx-2 h-4 w-4" />
                  <Music className="mr-1 h-4 w-4" />
                  <span>Spotify</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  We'll analyze your playlist and find the best matches on Spotify
                </p>
              </CardFooter>
            </Card>
          )}

          {/* Step 2: Review matches */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-up">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{mockPlaylist.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {mockPlaylist.trackCount} tracks • Created by {mockPlaylist.creator}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-sm text-muted-foreground">Match Quality</div>
                      <div className="flex items-center mt-1">
                        <div className="flex items-center mr-3">
                          <div className="size-3 rounded-full bg-green-500 mr-1.5"></div>
                          <span className="text-xs">High</span>
                        </div>
                        <div className="flex items-center mr-3">
                          <div className="size-3 rounded-full bg-yellow-500 mr-1.5"></div>
                          <span className="text-xs">Medium</span>
                        </div>
                        <div className="flex items-center">
                          <div className="size-3 rounded-full bg-red-500 mr-1.5"></div>
                          <span className="text-xs">Low</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative overflow-x-auto border-t">
                    <table className="w-full text-sm">
                      <thead className="text-xs bg-muted/50">
                        <tr>
                          <th className="px-6 py-3 text-left">#</th>
                          <th className="px-6 py-3 text-left">Track</th>
                          <th className="px-6 py-3 text-left">Duration</th>
                          <th className="px-6 py-3 text-left">Match Confidence</th>
                          <th className="px-6 py-3 text-left">Status</th>
                          <th className="px-6 py-3 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockTracks.map((track, index) => (
                          <tr key={track.id} className="border-t hover:bg-muted/50 transition-colors">
                            <td className="px-6 py-4">{index + 1}</td>
                            <td className="px-6 py-4">
                              <div>
                                <div className="font-medium">{track.title}</div>
                                <div className="text-muted-foreground text-xs mt-1">{track.artist}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4">{track.duration}</td>
                            <td className="px-6 py-4 min-w-[200px]">
                              <ConfidenceIndicator confidence={track.confidence} />
                            </td>
                            <td className="px-6 py-4">
                              <StatusIndicator status={track.status} />
                            </td>
                            <td className="px-6 py-4">
                              <Button variant="ghost" size="sm" className="h-8 px-2">
                                <Search className="h-4 w-4" />
                                <span className="ml-1">Find Alternative</span>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t py-4">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button onClick={handleCreatePlaylist} disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Spotify Playlist"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <Card className="animate-fade-up">
              <CardHeader>
                <CardTitle className="flex items-center text-green-500">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Playlist Successfully Created!
                </CardTitle>
                <CardDescription>
                  Your YouTube playlist "{mockPlaylist.title}" has been successfully converted to Spotify
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-4 bg-muted/30">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{mockPlaylist.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{mockPlaylist.trackCount} tracks • Created just now</p>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Music className="h-4 w-4" />
                      Open in Spotify
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center p-4 rounded-lg border bg-muted/30">
                  <div className="mr-4 text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>{mockTracks.filter(t => t.status === "high").length} High confidence matches</span>
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <CheckCircle className="h-5 w-5 text-yellow-500" />
                      <span>{mockTracks.filter(t => t.status === "medium").length} Medium confidence matches</span>
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <span>{mockTracks.filter(t => t.status === "low").length} Low confidence matches</span>
                    </div>
                  </div>
                  <div className="flex-1 flex justify-end">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {Math.round(mockTracks.reduce((acc, track) => acc + track.confidence, 0) / mockTracks.length)}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Average match accuracy
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Convert Another Playlist
                </Button>
                <Button variant="default">
                  Share Result
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Migrate;
