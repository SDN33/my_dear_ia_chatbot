import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SpotifyPlaylist {
  name: string;
  tracks: {
    total: number;
  };
  images: {
    url: string;
  }[];
}

const SpotifyPlayer = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  // Use explicit redirect URI that matches Spotify Dashboard
  const REDIRECT_URI = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || 'http://localhost:3000/callback';
  const SCOPES = ['user-read-private', 'playlist-read-private', 'playlist-read-collaborative'];

  const handleLogin = () => {
    // Encode redirect URI to handle special characters
    const encodedRedirectUri = encodeURIComponent(REDIRECT_URI);
    const encodedScopes = encodeURIComponent(SCOPES.join(' '));

    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodedRedirectUri}&scope=${encodedScopes}&show_dialog=true`;

    // Log the URL in development to verify it's correct
    if (process.env.NODE_ENV === 'development') {
      console.log('Auth URL:', authUrl);
    }

    window.location.href = authUrl;
  };

  useEffect(() => {
    // Check for access token in URL hash after redirect
    const hash = window.location.hash;
    if (hash) {
      // Parse hash to get access token and other params
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get('access_token');

      if (token) {
        setAccessToken(token);
        window.location.hash = '';
        localStorage.setItem('spotify_access_token', token);

        // Store token expiration time
        const expiresIn = params.get('expires_in');
        if (expiresIn) {
          const expirationTime = Date.now() + (parseInt(expiresIn) * 1000);
          localStorage.setItem('spotify_token_expiration', expirationTime.toString());
        }
      }
    }

    // Check for existing valid token in localStorage
    const storedToken = localStorage.getItem('spotify_access_token');
    const tokenExpiration = localStorage.getItem('spotify_token_expiration');

    if (storedToken && tokenExpiration) {
      // Check if token is still valid
      if (Date.now() < parseInt(tokenExpiration)) {
        setAccessToken(storedToken);
      } else {
        // Token expired, clean up
        localStorage.removeItem('spotify_access_token');
        localStorage.removeItem('spotify_token_expiration');
      }
    }
  }, []);

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!accessToken) return;

      setIsLoading(true);
      try {
        const response = await fetch('https://api.spotify.com/v1/me/playlists', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('spotify_access_token');
          localStorage.removeItem('spotify_token_expiration');
          setAccessToken(null);
          return;
        }

        const data = await response.json();
        setPlaylists(data.items);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylists();
  }, [accessToken]);

  const handlePrevious = () => {
    setCurrentIndex(current => (current > 0 ? current - 1 : playlists.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex(current => (current < playlists.length - 1 ? current + 1 : 0));
  };

  if (!accessToken) {
    return (
      <div className="flex flex-col md:flex-row justify-center items-center min-h-64 bg-transparent rounded-lg gap-8 md:gap-8">
        <iframe
          style={{ borderRadius: "12px" }}
          src="https://open.spotify.com/embed/playlist/37i9dQZEVXbMDoHDwVN2tF?utm_source=generator"
          width="100%"
          height="152"
          className="w-full"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>
        <button
          onClick={handleLogin}
          className="bg-green-500/80 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors text-xs w-full md:w-fit"
        >
          Connexion avec Spotify
        </button>
        {playlists.length > 0 && (
          <div
            className="w-full touch-pan-y select-none"
            onTouchStart={(e) => {
              const touch = e.touches[0];
              const startX = touch.clientX;

              const handleTouchMove = (e: TouchEvent) => {
                const touch = e.touches[0];
                const diff = startX - touch.clientX;

                if (Math.abs(diff) > 50) {
                  if (diff > 0) {
                    handleNext();
                  } else {
                    handlePrevious();
                  }
                  document.removeEventListener('touchmove', handleTouchMove);
                }
              };

              document.addEventListener('touchmove', handleTouchMove);
              document.addEventListener('touchend', () => {
                document.removeEventListener('touchmove', handleTouchMove);
              }, { once: true });
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl h-fit mx-auto p-4">
      {isLoading ? (
        <div className="flex justify-center items-center h-64 ">
          <div className="animate-spin rounded-full size-12 border-4 border-green-500 border-t-transparent bg-transparent"></div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrevious}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Playlist précédente"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex-1 px-4">
              {playlists.length > 0 && currentIndex >= 0 && currentIndex < playlists.length && (
                <div className="text-center">
                  <h3 className="text-sm font-bold">{playlists[currentIndex].name}</h3>
                  <p className="text-gray-600 text-xs">{playlists[currentIndex].tracks.total} titres</p>
                </div>
              )}
            </div>
            <button
              onClick={handleNext}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Playlist suivante"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          <div className="relative size-40 overflow-hidden rounded-lg">
            {playlists.length > 0 ? (
              <img
                src={playlists[currentIndex]?.images[0]?.url || "/api/placeholder/400/320"}
                alt={playlists[currentIndex]?.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-200">
                <p className="text-gray-600">Aucune playlist trouvée</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SpotifyPlayer;
