import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { RefreshCw } from 'lucide-react';

interface Movie {
  title: string;
  poster: string;
  year: string;
  link: string;
}

const MovieModule: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0); // Pour gérer une pagination simple

  const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;
  const MOVIES_PER_PAGE = 4;

  const topMovieTitles = [
    'The Brutalist',
    'The Substance',
    'Wicked',
    'Late Night with the Devil',
    'Emilia Pérez',
    'Babygirl',
    'Anora',
    'Landman',
    'Squid Game',
    'Heretic',
  ];

  const fetchTopMovies = useCallback(async () => {
    if (!OMDB_API_KEY) {
      setError('Clé API manquante.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const moviePromises = topMovieTitles
        .slice(page * MOVIES_PER_PAGE, (page + 1) * MOVIES_PER_PAGE)
        .map(async (title) => {
          const response = await fetch(
            `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${OMDB_API_KEY}`
          );
          if (!response.ok) throw new Error(`Erreur pour le film "${title}"`);

          const movie = await response.json();

          return {
            title: movie.Title || title,
            year: movie.Year || 'N/A',
            poster: movie.Poster !== 'N/A' ? movie.Poster : '/api/placeholder/160/200',
            link: movie.imdbID ? `https://www.imdb.com/title/${movie.imdbID}` : '#',
          };
        });

      const fetchedMovies = await Promise.all(moviePromises);
      setMovies((prev) => [...prev, ...fetchedMovies]);
    } catch (err) {
      setError(`Erreur lors du chargement des films.`);
    } finally {
      setIsLoading(false);
    }
  }, [OMDB_API_KEY, page]);

  useEffect(() => {
    fetchTopMovies();
  }, [fetchTopMovies]);

  return (
    <div className="h-full">
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {movies.map((movie, index) => (
          <div key={index} className="flex flex-col p-2 bg-gray-50 dark:bg-black rounded-lg">
            <div className="relative w-full h-40 mb-2">
              <a href={movie.link} target="_blank" rel="noopener noreferrer">
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                  loading="lazy"
                />
              </a>
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm font-medium text-center line-clamp-2" title={movie.title}>
                {movie.title}
              </p>
              <p className="text-xs text-gray-500">{movie.year}</p>
            </div>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center mt-4">
          <RefreshCw className="size-6 animate-spin text-gray-400" />
        </div>
      ) : (
        !error && page < Math.ceil(topMovieTitles.length / MOVIES_PER_PAGE) - 1 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setPage((prev) => prev + 1)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
            >
              Charger plus
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default MovieModule;
