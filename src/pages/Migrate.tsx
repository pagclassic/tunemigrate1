
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Youtube, Music, Search, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { 
  extractPlaylistIdFromUrl, 
  fetchPlaylistDetails, 
  fetchPlaylistTracks 
} from '@/services/youtubeService';
import { 
  isLoggedInToSpotify, 
  getSpotifyLoginUrl, 
  matchTracks, 
  createSpotifyPlaylist 
} from '@/services/spotifyService';
import { 
  YouTubePlaylist, 
  YouTubeTrack, 
  TrackMatch, 
  PlaylistMigrationResult 
} from '@/types/api';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [playlist, setPlaylist] = useState<YouTubePlaylist | null>(null);
  const [tracks, setTracks] = useState<YouTubeTrack[]>([]);
  const [trackMatches, setTrackMatches] = useState<TrackMatch[]>([]);
  const [migrationResult, setMigrationResult] = useState<PlaylistMigrationResult | null>(null);
  const { toast } = useToast();

  // Check if user is logged in to Spotify
  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = isLoggedInToSpotify();
      console.log("Spotify authentication status:", authenticated);
      setIsAuthenticated(authenticated);
    };
    
    checkAuth();
  }, []);

  const handleLogin = () => {
    const loginUrl = getSpotifyLoginUrl();
    console.log("Redirecting to Spotify login:", loginUrl);
    window.location.href = loginUrl;
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast({
        title: "Missing URL",
        description: "Please enter a YouTube playlist URL",
        variant: "destructive",
      });
      return;
    }
    
    const playlistId = extractPlaylistIdFromUrl(url);
    console.log("Extracted playlist ID:", playlistId);
    
    if (!playlistId) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid YouTube playlist URL",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Fetch playlist details
      console.log("Fetching playlist details...");
      const playlistDetails = await fetchPlaylistDetails(playlistId);
      console.log("Playlist details:", playlistDetails);
      setPlaylist(playlistDetails);
      
      // Fetch playlist tracks
      console.log("Fetching playlist tracks...");
      const playlistTracks = await fetchPlaylistTracks(playlistId);
      console.log(`Retrieved ${playlistTracks.length} tracks from YouTube`);
      setTracks(playlistTracks);
      
      setStep(2);
      
      // Start matching tracks with Spotify
      console.log("Starting Spotify track matching...");
      const matches = await matchTracks(playlistTracks);
      console.log(`Matched ${matches.length} tracks with Spotify`);
      setTrackMatches(matches);
    } catch (error) {
      console.error("Error processing playlist:", error);
      toast({
        title: "Error",
        description: "Failed to process YouTube playlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!playlist || trackMatches.length === 0) {
      toast({
        title: "Error",
        description: "No tracks to migrate",
        variant: "destructive",
      });
      return;
    }
    
    if (!isAuthenticated) {
      handleLogin();
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await createSpotifyPlaylist(
        `${playlist.title} - Migrated from YouTube`,
        `This playlist was migrated from YouTube by TuneMigrate. Original creator: ${playlist.creator}`,
        trackMatches
      );
      
      setMigrationResult(result);
      setStep(3);
      
      toast({
        title: "Success!",
        description: "Your playlist has been created on Spotify",
      });
    } catch (error) {
      console.error("Error creating playlist:", error);
      
      // Check if it's an auth error
      if (error instanceof Error && error.message.includes("Not logged in")) {
        toast({
          title: "Authentication Required",
          description: "Please log in to Spotify to create playlists",
          variant: "destructive",
        });
        setIsAuthenticated(false);
      } else {
        toast({
          title: "Error",
          description: "Failed to create Spotify playlist. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFindAlternative = async (index: number) => {
    if (!trackMatches[index]) return;
    
    const match = trackMatches[index];
    const searchQuery = `${match.youtubeTrack.artist} ${match.youtubeTrack.title}`;
    
    setIsLoading(true);
    
    try {
      // Implement a modal or dropdown with search results here
      // For now, we'll just show a toast
      toast({
        title: "Finding alternatives",
        description: `Searching for alternatives to "${match.youtubeTrack.title}"`,
      });
      
      // This would be replaced with actual UI for selecting alternatives
    } catch (error) {
      console.error("Error finding alternatives:", error);
      toast({
        title: "Error",
        description: "Failed to find alternative tracks",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        "Analyze Playlist"
                      )}
                    </Button>
                  </div>

                  {/* Spotify Auth Status */}
                  <div className="mt-4 flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center">
                      <Music className="mr-2 h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm font-medium">Spotify Connection</p>
                        <p className="text-xs text-muted-foreground">
                          {isAuthenticated 
                            ? "Connected to Spotify" 
                            : "Not connected to Spotify"}
                        </p>
                      </div>
                    </div>
                    {!isAuthenticated && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleLogin}
                      >
                        Connect to Spotify
                      </Button>
                    )}
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
          {step === 2 && playlist && (
            <div className="space-y-6 animate-fade-up">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{playlist.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {playlist.trackCount} tracks • Created by {playlist.creator}
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
                  {isLoading || trackMatches.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 border-t">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                      <p className="text-muted-foreground">Matching tracks with Spotify...</p>
                      <p className="text-xs text-muted-foreground mt-1">This may take a minute for larger playlists</p>
                    </div>
                  ) : (
                    <div className="relative overflow-x-auto border-t">
                      <table className="w-full text-sm">
                        <thead className="text-xs bg-muted/50">
                          <tr>
                            <th className="px-6 py-3 text-left">#</th>
                            <th className="px-6 py-3 text-left">YouTube Track</th>
                            <th className="px-6 py-3 text-left">Spotify Match</th>
                            <th className="px-6 py-3 text-left">Match Confidence</th>
                            <th className="px-6 py-3 text-left">Status</th>
                            <th className="px-6 py-3 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {trackMatches.map((match, index) => (
                            <tr key={match.id} className="border-t hover:bg-muted/50 transition-colors">
                              <td className="px-6 py-4">{index + 1}</td>
                              <td className="px-6 py-4">
                                <div>
                                  <div className="font-medium">{match.youtubeTrack.title}</div>
                                  <div className="text-muted-foreground text-xs mt-1">{match.youtubeTrack.artist}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div>
                                  <div className="font-medium">{match.spotifyTrack.title}</div>
                                  <div className="text-muted-foreground text-xs mt-1">{match.spotifyTrack.artist}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 min-w-[200px]">
                                <ConfidenceIndicator confidence={match.confidence} />
                              </td>
                              <td className="px-6 py-4">
                                <StatusIndicator status={match.status} />
                              </td>
                              <td className="px-6 py-4">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 px-2"
                                  onClick={() => handleFindAlternative(index)}
                                >
                                  <Search className="h-4 w-4" />
                                  <span className="ml-1">Find Alternative</span>
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between border-t py-4">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button 
                    onClick={handleCreatePlaylist} 
                    disabled={isLoading || trackMatches.length === 0}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : !isAuthenticated ? (
                      "Connect & Create Spotify Playlist"
                    ) : (
                      "Create Spotify Playlist"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && migrationResult && (
            <Card className="animate-fade-up">
              <CardHeader>
                <CardTitle className="flex items-center text-green-500">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Playlist Successfully Created!
                </CardTitle>
                <CardDescription>
                  Your YouTube playlist has been successfully converted to Spotify
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-4 bg-muted/30">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{migrationResult.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{migrationResult.trackCount} tracks • Created just now</p>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => window.open(migrationResult.spotifyUrl, "_blank")}>
                      <Music className="h-4 w-4" />
                      Open in Spotify
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center p-4 rounded-lg border bg-muted/30">
                  <div className="mr-4 text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>{migrationResult.trackMatches.high} High confidence matches</span>
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <CheckCircle className="h-5 w-5 text-yellow-500" />
                      <span>{migrationResult.trackMatches.medium} Medium confidence matches</span>
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <span>{migrationResult.trackMatches.low} Low confidence matches</span>
                    </div>
                  </div>
                  <div className="flex-1 flex justify-end">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {migrationResult.averageConfidence}%
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
                <Button 
                  variant="default"
                  onClick={() => {
                    const shareText = `I just converted my YouTube playlist to Spotify with ${migrationResult.averageConfidence}% accuracy using TuneMigrate!`;
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank");
                  }}
                >
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
