import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Music, Film } from 'lucide-react';

const TrendingCards = () => {
  interface YouTubeVideo {
    snippet: {
      title: string;
      channelTitle: string;
    };
  }

  interface Movie {
    title: string;
    release_date: string;
    vote_average: number;
  }

  const [trendingMusic, setTrendingMusic] = useState<YouTubeVideo[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [currentMusicIndex, setCurrentMusicIndex] = useState(0);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);

  const fetchTrendingMusic = async () => {
    try {
      const response = await fetch(`https://youtube.googleapis.com/youtube/v3/playlists?part=snippet&chart=mostPopular&maxResults=5&videoCategoryId=10&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`);

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (data && data.items) {
        setTrendingMusic(data.items);
      } else {
        console.warn('Aucune playlist de musique tendance trouvée');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des playlists de musique:', error);
    }
  };

  // Fonction pour récupérer les films en temps réel depuis l'API Allociné
  const fetchTrendingMovies = async () => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.TMDB_API_KEY}&language=fr-FR&page=1&region=FR`);
      const data = await response.json();

      // Formatter les données
      const formattedMovies = data.results.map((movie: any) => ({
        title: movie.title,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        director: '', // TMDB API doesn't provide director in this endpoint
        genre: '' // TMDB API doesn't provide genre in this endpoint
      }));

      setTrendingMovies(formattedMovies);
    } catch (error) {
      console.error('Erreur lors de la récupération des films:', error);

      // En cas d'erreur, on peut faire un fallback sur du web scraping
      try {
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const targetUrl = encodeURIComponent('https://www.allocine.fr/film/aucinema/');

        const response = await fetch(proxyUrl + targetUrl);
        const html = await response.text();

        // Parser le HTML pour extraire les films
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const movies = Array.from(doc.querySelectorAll('.card-entity-list .card')).slice(0, 5).map(card => ({
          title: card.querySelector('.meta-title-link')?.textContent?.trim() ?? '',
          release_date: card.querySelector('.meta-date')?.textContent?.trim() ?? '',
          vote_average: parseFloat(card.querySelector('.rating-item-value')?.textContent?.trim() ?? '0'),
          poster: (card.querySelector('.thumbnail-img') as HTMLImageElement)?.src ?? '',
          director: card.querySelector('.meta-director')?.textContent?.trim() ?? '',
          genre: card.querySelector('.meta-category')?.textContent?.trim() ?? ''
        }));

        setTrendingMovies(movies);
      } catch (scrapingError) {
        console.error('Erreur lors du scraping:', scrapingError);
        setTrendingMovies([]);
      }
    }
  };

  // Fonction pour rafraîchir les données toutes les heures
  useEffect(() => {
    fetchTrendingMovies();
    const interval = setInterval(fetchTrendingMovies, 3600000); // 1 heure

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchTrendingMusic();
    fetchTrendingMovies();
  }, []);

  const nextMusic = () => {
    setCurrentMusicIndex((prev) => (prev + 1) % 5);
  };

  const previousMusic = () => {
    setCurrentMusicIndex((prev) => (prev - 1 + 5) % 5);
  };

  const nextMovie = () => {
    setCurrentMovieIndex((prev) => (prev + 1) % 5);
  };

  const previousMovie = () => {
    setCurrentMovieIndex((prev) => (prev - 1 + 5) % 5);
  };

  return (
    <div className="grid sm:grid-cols-2 gap-4 w-full">
      {/* Carte Musique */}
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <div className="flex items-center gap-2">
              <Music className="size-4" />
              Top Musiques
            </div>
          </CardTitle>
          <div className="flex gap-1">
            <button
              onClick={previousMusic}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMusic}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {trendingMusic[currentMusicIndex] ? (
            <div className="space-y-2">
              <img
          src={trendingMusic[currentMusicIndex].snippet?.thumbnails?.high?.url || `/api/placeholder/320/180`}
          alt="Music thumbnail"
          className="w-full h-32 object-cover rounded"
              />
              <h3 className="font-medium text-sm">
          {trendingMusic[currentMusicIndex].snippet?.title || "Chargement..."}
              </h3>
              <p className="text-sm text-gray-500">
          {trendingMusic[currentMusicIndex].snippet?.channelTitle || ""}
              </p>
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center">
              <p className="text-sm text-gray-500">Chargement...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Carte Films */}
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4" />
              Films Tendance
            </div>
          </CardTitle>
          <div className="flex gap-1">
            <button
              onClick={previousMovie}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMovie}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {trendingMovies[currentMovieIndex] ? (
            <div className="space-y-2">
              <img
                src={`/api/placeholder/320/180`}
                alt="Movie poster"
                className="w-full h-32 object-cover rounded"
              />
              <h3 className="font-medium text-sm">
                {trendingMovies[currentMovieIndex].title || "Chargement..."}
              </h3>
              <p className="text-sm text-gray-500">
                {trendingMovies[currentMovieIndex].release_date?.split('-')[0] || ""}
                {trendingMovies[currentMovieIndex].vote_average &&
                  ` • ${trendingMovies[currentMovieIndex].vote_average.toFixed(1)}/10`}
              </p>
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center">
              <p className="text-sm text-gray-500">Chargement...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendingCards;
