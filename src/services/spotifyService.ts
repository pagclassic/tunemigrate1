import { SpotifyTrack, TrackMatch, YouTubeTrack, PlaylistMigrationResult } from "@/types/api";

// Spotify API configuration
// These values should be stored in environment variables for better security in production
const SPOTIFY_CONFIG = {
  CLIENT_ID: "0fbc333975954f79bac406cb74d04dbc",
  CLIENT_SECRET: "3c5e40ae5d5e41d79e74364e5c420e41",
  REDIRECT_URI: window.location.origin + "/auth/callback",
  AUTH_ENDPOINT: "https://accounts.spotify.com/authorize",
  TOKEN_ENDPOINT: "https://accounts.spotify.com/api/token",
  API_BASE_URL: "https://api.spotify.com/v1",
  SCOPES: [
    "playlist-read-private",
    "playlist-modify-private",
    "playlist-modify-public",
    "user-read-email"
  ].join(" ")
};

// Generate a random string for state parameter
const generateRandomString = (length: number) => {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let text = "";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// Get the login URL for Spotify OAuth
export const getSpotifyLoginUrl = () => {
  const state = generateRandomString(16);
  localStorage.setItem("spotify_auth_state", state);
  
  const url = new URL(SPOTIFY_CONFIG.AUTH_ENDPOINT);
  url.searchParams.append("client_id", SPOTIFY_CONFIG.CLIENT_ID);
  url.searchParams.append("response_type", "code");
  url.searchParams.append("redirect_uri", SPOTIFY_CONFIG.REDIRECT_URI);
  url.searchParams.append("state", state);
  url.searchParams.append("scope", SPOTIFY_CONFIG.SCOPES);
  
  return url.toString();
};

// Check if user is logged in to Spotify
export const isLoggedInToSpotify = (): boolean => {
  const accessToken = localStorage.getItem("spotify_access_token");
  const expiresAt = localStorage.getItem("spotify_expires_at");
  
  if (!accessToken || !expiresAt) {
    return false;
  }
  
  return Date.now() < Number(expiresAt);
};

// Handle the callback from Spotify OAuth
export const handleSpotifyCallback = async (code: string, state: string): Promise<boolean> => {
  const storedState = localStorage.getItem("spotify_auth_state");
  
  if (state === null || state !== storedState) {
    return false;
  }
  
  try {
    const response = await fetch(SPOTIFY_CONFIG.TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: SPOTIFY_CONFIG.REDIRECT_URI,
        client_id: SPOTIFY_CONFIG.CLIENT_ID,
        client_secret: SPOTIFY_CONFIG.CLIENT_SECRET,
      }),
    });
    
    if (!response.ok) {
      throw new Error("Failed to exchange authorization code for tokens");
    }
    
    const data = await response.json();
    
    localStorage.setItem("spotify_access_token", data.access_token);
    localStorage.setItem("spotify_refresh_token", data.refresh_token);
    localStorage.setItem("spotify_expires_at", (Date.now() + data.expires_in * 1000).toString());
    
    return true;
  } catch (error) {
    console.error("Error during Spotify callback handling:", error);
    return false;
  }
};

// Get a valid access token (refreshing if necessary)
const getValidAccessToken = async (): Promise<string> => {
  const accessToken = localStorage.getItem("spotify_access_token");
  const refreshToken = localStorage.getItem("spotify_refresh_token");
  const expiresAt = localStorage.getItem("spotify_expires_at");
  
  if (!accessToken || !refreshToken || !expiresAt) {
    throw new Error("Not logged in to Spotify");
  }
  
  if (Date.now() < Number(expiresAt)) {
    return accessToken;
  }
  
  // Token expired, refresh it
  try {
    const response = await fetch(SPOTIFY_CONFIG.TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: SPOTIFY_CONFIG.CLIENT_ID,
        client_secret: SPOTIFY_CONFIG.CLIENT_SECRET,
      }),
    });
    
    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }
    
    const data = await response.json();
    
    localStorage.setItem("spotify_access_token", data.access_token);
    if (data.refresh_token) {
      localStorage.setItem("spotify_refresh_token", data.refresh_token);
    }
    localStorage.setItem("spotify_expires_at", (Date.now() + data.expires_in * 1000).toString());
    
    return data.access_token;
  } catch (error) {
    console.error("Error refreshing Spotify token:", error);
    throw error;
  }
};

// Search for a track on Spotify
export const searchTrack = async (query: string): Promise<SpotifyTrack[]> => {
  try {
    const accessToken = await getValidAccessToken();
    
    const url = new URL(`${SPOTIFY_CONFIG.API_BASE_URL}/search`);
    url.searchParams.append("q", query);
    url.searchParams.append("type", "track");
    url.searchParams.append("limit", "5");
    
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      console.error(`Spotify search API error: ${response.status}`);
      if (response.status === 429) {
        console.error("Rate limit exceeded, waiting before retrying");
        await new Promise(resolve => setTimeout(resolve, 2000));
        return searchTrack(query); // Retry after waiting
      }
      throw new Error(`Spotify API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.tracks || !data.tracks.items || data.tracks.items.length === 0) {
      console.log(`No tracks found for query: ${query}`);
      return [];
    }
    
    return data.tracks.items.map((item: any) => ({
      id: item.id,
      title: item.name,
      artist: item.artists.map((artist: any) => artist.name).join(", "),
      album: item.album.name,
      duration: msToMinutesAndSeconds(item.duration_ms),
      thumbnailUrl: item.album.images[0]?.url,
      uri: item.uri,
    }));
  } catch (error) {
    console.error(`Error searching for track "${query}":`, error);
    return [];
  }
};

// Match YouTube tracks to Spotify tracks
export const matchTracks = async (youtubeTracks: YouTubeTrack[]): Promise<TrackMatch[]> => {
  const matches: TrackMatch[] = [];
  console.log(`Starting to match ${youtubeTracks.length} YouTube tracks with Spotify`);
  
  // Create mock data for testing if there are issues with the real API
  if (youtubeTracks.length === 0) {
    console.error("No YouTube tracks to match");
    return [];
  }
  
  // Process in smaller batches to avoid rate limiting
  const batchSize = 5;
  for (let i = 0; i < youtubeTracks.length; i += batchSize) {
    const batch = youtubeTracks.slice(i, i + batchSize);
    
    await Promise.all(
      batch.map(async (youtubeTrack) => {
        try {
          // Create a normalized search query
          let searchQuery = `${youtubeTrack.title}`;
          
          // If we have a clear artist, include it
          if (youtubeTrack.artist !== "Unknown Artist") {
            searchQuery = `${youtubeTrack.artist} ${youtubeTrack.title}`;
          }
          
          // Remove common YouTube suffixes
          searchQuery = searchQuery
            .replace(/\(Official Video\)/i, "")
            .replace(/\(Official Audio\)/i, "")
            .replace(/\(Official Music Video\)/i, "")
            .replace(/\(Lyrics\)/i, "")
            .replace(/\[.*?\]/g, "") // Remove anything in square brackets
            .trim();
          
          console.log(`Searching Spotify for: ${searchQuery}`);
          const spotifyTracks = await searchTrack(searchQuery);
          
          if (spotifyTracks.length === 0) {
            console.log(`No Spotify matches found for: ${searchQuery}`);
            return;
          }
          
          // Calculate match confidence
          const bestMatch = spotifyTracks.map(track => {
            // Calculate title similarity
            const titleSimilarity = calculateStringSimilarity(
              youtubeTrack.title.toLowerCase(), 
              track.title.toLowerCase()
            );
            
            // Calculate artist similarity
            const artistSimilarity = calculateStringSimilarity(
              youtubeTrack.artist.toLowerCase(),
              track.artist.toLowerCase()
            );
            
            // Weighted confidence score
            const confidence = Math.round(
              (titleSimilarity * 0.7 + artistSimilarity * 0.3) * 100
            );
            
            return {
              track,
              confidence
            };
          }).sort((a, b) => b.confidence - a.confidence)[0];
          
          // Determine match status
          let status: "high" | "medium" | "low" = "low";
          if (bestMatch.confidence >= 90) {
            status = "high";
          } else if (bestMatch.confidence >= 70) {
            status = "medium";
          }
          
          matches.push({
            id: `${youtubeTrack.id}-${bestMatch.track.id}`,
            youtubeTrack,
            spotifyTrack: bestMatch.track,
            confidence: bestMatch.confidence,
            status
          });
          
          console.log(`Matched "${youtubeTrack.title}" with "${bestMatch.track.title}" (${bestMatch.confidence}%)`);
        } catch (error) {
          console.error(`Error matching track "${youtubeTrack.title}":`, error);
          // Continue with next track
        }
      })
    );
    
    // Small delay between batches to avoid rate limiting
    if (i + batchSize < youtubeTracks.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log(`Successfully matched ${matches.length} out of ${youtubeTracks.length} tracks`);
  return matches;
};

// Create a Spotify playlist with the matched tracks
export const createSpotifyPlaylist = async (
  title: string,
  description: string,
  trackMatches: TrackMatch[]
): Promise<PlaylistMigrationResult> => {
  try {
    const accessToken = await getValidAccessToken();
    
    // Get user ID
    const userResponse = await fetch(`${SPOTIFY_CONFIG.API_BASE_URL}/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    if (!userResponse.ok) {
      throw new Error(`Spotify API error: ${userResponse.status}`);
    }
    
    const userData = await userResponse.json();
    const userId = userData.id;
    
    // Create playlist
    const createResponse = await fetch(`${SPOTIFY_CONFIG.API_BASE_URL}/users/${userId}/playlists`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: title,
        description: description,
        public: false,
      }),
    });
    
    if (!createResponse.ok) {
      throw new Error(`Spotify API error: ${createResponse.status}`);
    }
    
    const playlistData = await createResponse.json();
    const playlistId = playlistData.id;
    
    // Add tracks to playlist
    const trackUris = trackMatches.map(match => match.spotifyTrack.uri);
    
    // Add tracks in batches of 100 (Spotify API limit)
    for (let i = 0; i < trackUris.length; i += 100) {
      const batch = trackUris.slice(i, i + 100);
      
      const addTracksResponse = await fetch(`${SPOTIFY_CONFIG.API_BASE_URL}/playlists/${playlistId}/tracks`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uris: batch,
        }),
      });
      
      if (!addTracksResponse.ok) {
        throw new Error(`Spotify API error: ${addTracksResponse.status}`);
      }
    }
    
    // Calculate result statistics
    const high = trackMatches.filter(match => match.status === "high").length;
    const medium = trackMatches.filter(match => match.status === "medium").length;
    const low = trackMatches.filter(match => match.status === "low").length;
    
    const averageConfidence = Math.round(
      trackMatches.reduce((sum, match) => sum + match.confidence, 0) / trackMatches.length
    );
    
    return {
      id: playlistId,
      title,
      trackCount: trackMatches.length,
      averageConfidence,
      trackMatches: {
        high,
        medium,
        low,
      },
      spotifyUrl: playlistData.external_urls.spotify,
    };
  } catch (error) {
    console.error("Error creating Spotify playlist:", error);
    throw error;
  }
};

// Utility functions
const msToMinutesAndSeconds = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
};

const durationToSeconds = (duration: string): number => {
  const parts = duration.split(":").map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return 0;
};

const calculateStringSimilarity = (str1: string, str2: string): number => {
  // Very basic similarity - for production, use a proper algorithm like Levenshtein distance
  if (str1 === str2) return 1;
  
  // Remove special characters and extra spaces
  const normalize = (s: string) => s
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
  
  const norm1 = normalize(str1);
  const norm2 = normalize(str2);
  
  if (norm1 === norm2) return 0.95;
  if (norm1.includes(norm2) || norm2.includes(norm1)) return 0.9;
  
  // Count matching words
  const words1 = new Set(norm1.split(" "));
  const words2 = new Set(norm2.split(" "));
  
  let matches = 0;
  for (const word of words1) {
    if (words2.has(word)) matches++;
  }
  
  const totalWords = words1.size + words2.size;
  return totalWords > 0 ? (matches * 2) / totalWords : 0;
};
