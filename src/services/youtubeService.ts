
import { YouTubePlaylist, YouTubeTrack } from "@/types/api";

// YouTube API key - in production, use environment variables
const YOUTUBE_API_KEY = "AIzaSyBi-wrtS__IN67vSvK3poSimRoBBQqJAog";
const YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3";

export const extractPlaylistIdFromUrl = (url: string): string | null => {
  const regexPatterns = [
    /(?:youtube\.com\/playlist\?list=)([^&]+)/,
    /(?:youtube\.com\/watch\?v=[^&]+&list=)([^&]+)/,
    /(?:youtube\.com\/watch\?list=)([^&]+)/,
    /(?:youtu\.be\/[^&]+\?list=)([^&]+)/
  ];

  for (const pattern of regexPatterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

export const fetchPlaylistDetails = async (playlistId: string): Promise<YouTubePlaylist> => {
  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE_URL}/playlists?part=snippet,contentDetails&id=${playlistId}&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      throw new Error("Playlist not found");
    }

    const playlist = data.items[0];
    const thumbnail = playlist.snippet.thumbnails.high || 
                     playlist.snippet.thumbnails.medium || 
                     playlist.snippet.thumbnails.default;

    return {
      id: playlist.id,
      title: playlist.snippet.title,
      description: playlist.snippet.description,
      thumbnailUrl: thumbnail ? thumbnail.url : "",
      trackCount: playlist.contentDetails.itemCount,
      creator: playlist.snippet.channelTitle
    };
  } catch (error) {
    console.error("Error fetching playlist details:", error);
    throw error;
  }
};

export const fetchPlaylistTracks = async (playlistId: string): Promise<YouTubeTrack[]> => {
  try {
    console.log(`Fetching tracks for playlist ID: ${playlistId}`);
    const tracks: YouTubeTrack[] = [];
    let nextPageToken: string | null = null;
    
    do {
      const url = new URL(`${YOUTUBE_API_BASE_URL}/playlistItems`);
      url.searchParams.append("part", "snippet,contentDetails");
      url.searchParams.append("maxResults", "50");
      url.searchParams.append("playlistId", playlistId);
      url.searchParams.append("key", YOUTUBE_API_KEY);
      
      if (nextPageToken) {
        url.searchParams.append("pageToken", nextPageToken);
      }
      
      console.log(`Fetching playlist items page, URL: ${url.toString()}`);
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`YouTube API error ${response.status}: ${errorText}`);
        throw new Error(`YouTube API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Received ${data.items?.length || 0} items from YouTube API`);
      nextPageToken = data.nextPageToken || null;
      
      // Process each video item
      for (const item of data.items) {
        if (item.snippet && item.snippet.title !== "Deleted video" && item.snippet.title !== "Private video") {
          const videoId = item.contentDetails.videoId;
          
          // Simplified approach: Don't fetch extra details to speed up the process
          // Just extract info from the playlist item
          const title = item.snippet.title;
          // Extract artist from title (best effort)
          let artist = "Unknown Artist";
          if (title.includes("-")) {
            const parts = title.split("-");
            artist = parts[0].trim();
          }
          
          tracks.push({
            id: videoId,
            title: title,
            artist: artist,
            duration: "3:30", // Placeholder duration
            thumbnailUrl: item.snippet.thumbnails?.high?.url || 
                         item.snippet.thumbnails?.medium?.url || 
                         item.snippet.thumbnails?.default?.url
          });
        }
      }
      
      // Add a small delay between requests to avoid rate limiting
      if (nextPageToken) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
    } while (nextPageToken);
    
    console.log(`Fetched ${tracks.length} tracks from YouTube playlist`);
    return tracks;
  } catch (error) {
    console.error("Error fetching playlist tracks:", error);
    throw error;
  }
};

// Helper function to convert ISO 8601 duration to readable format
const formatDuration = (isoDuration: string): string => {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "0:00";
  
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
};
