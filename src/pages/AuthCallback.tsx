
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { handleSpotifyCallback } from "@/services/spotifyService";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const code = params.get("code");
        const state = params.get("state");

        if (!code || !state) {
          throw new Error("Invalid callback parameters");
        }

        const success = await handleSpotifyCallback(code, state);
        
        if (!success) {
          throw new Error("Authentication failed");
        }

        // Redirect to the migration page
        navigate("/migrate");
      } catch (error) {
        console.error("Auth callback error:", error);
        setError("Authentication failed. Please try again.");
      }
    };

    handleCallback();
  }, [location.search, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      {error ? (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Authentication Error</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => navigate("/migrate")}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
          >
            Go Back
          </button>
        </div>
      ) : (
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Authenticating with Spotify</h2>
          <p className="text-muted-foreground">Please wait...</p>
        </div>
      )}
    </div>
  );
};

export default AuthCallback;
