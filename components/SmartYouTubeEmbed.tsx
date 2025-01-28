import React, { useState, useEffect } from 'react';
import { ExternalLink, PlayCircle, Search, AlertCircle } from 'lucide-react';

interface YouTubeVideo {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      high: {
        url: string;
      };
    };
  };
}


const Alert = ({ children, variant = "default", className = "" }: { children: React.ReactNode; variant?: "default" | "destructive"; className?: string }) => {
  const baseStyles = "p-4 rounded-lg flex gap-2 items-start";
  const variantStyles = {
    default: "bg-blue-50 text-blue-700 border border-blue-200",
    destructive: "bg-red-50 text-red-700 border border-red-200"
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
};

const AlertDescription = ({ children }: { children: React.ReactNode }) => {
  return <div className="text-sm">{children}</div>;
};

const SmartYouTubeEmbed = ({
  searchQuery, // Le sujet/contexte de la conversation
  maxResults = 3 // Nombre maximum de vidéos à afficher
}: {
  searchQuery: string;
  maxResults?: number;
}) => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    const searchVideos = async () => {
      setLoading(true);
      setError(null);
      try {
        // Ici, vous devrez implémenter l'appel à votre backend qui gère l'API YouTube
        const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(searchQuery)}&maxResults=${maxResults}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Failed to fetch videos');

        setVideos(data.items || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        console.error('Error fetching YouTube videos:', err);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      searchVideos();
    }
  }, [searchQuery, maxResults]);

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4 animate-pulse">
        <div className="h-48 bg-muted rounded-lg mb-4"></div>
        <div className="h-4 bg-muted rounded w-3/4"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="w-full max-w-2xl mx-auto my-4">
        <AlertCircle className="size-4" />
        <AlertDescription>
          Une erreur est survenue lors de la recherche de vidéos: {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!videos.length) {
    return (
      <Alert className="w-full max-w-2xl mx-auto my-4">
        <Search className="size-4" />
        <AlertDescription>
          Aucune vidéo pertinente trouvée pour: {searchQuery}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 my-4">
      {videos.map((video) => (
        <div key={video.id.videoId} className="rounded-lg overflow-hidden bg-background border">
          {activeVideo === video.id.videoId ? (
            <div className="relative aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${video.id.videoId}?autoplay=1`}
                title={video.snippet.title}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="relative">
              <img
                src={video.snippet.thumbnails.high.url}
                alt={video.snippet.title}
                className="w-full aspect-video object-cover"
              />
              <button
                onClick={() => setActiveVideo(video.id.videoId)}
                className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition-colors group"
              >
                <PlayCircle className="w-16 h-16 text-white opacity-90 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          )}

          <div className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-medium leading-tight mb-2">
                  {video.snippet.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {video.snippet.description}
                </p>
              </div>
              <a
                href={`https://youtube.com/watch?v=${video.id.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors shrink-0"
              >
                <span className="hidden sm:inline">Voir sur YouTube</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SmartYouTubeEmbed;
