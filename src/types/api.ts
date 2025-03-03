
export interface YouTubePlaylist {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl: string;
  trackCount: number;
  creator: string;
}

export interface YouTubeTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  thumbnailUrl?: string;
}

export interface SpotifyTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: string;
  thumbnailUrl?: string;
  uri: string;
}

export interface TrackMatch {
  id: string;
  youtubeTrack: YouTubeTrack;
  spotifyTrack: SpotifyTrack;
  confidence: number;
  status: "high" | "medium" | "low";
}

export interface PlaylistMigrationResult {
  id: string;
  title: string;
  trackCount: number;
  averageConfidence: number;
  trackMatches: {
    high: number;
    medium: number;
    low: number;
  };
  spotifyUrl: string;
}
