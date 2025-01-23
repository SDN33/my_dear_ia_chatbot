import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface Movie {
  title: string;
  poster: string;
  year: string;
  link: string;
}

const MovieModule: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [movies, setMovies] = useState<Movie[]>([]);

  const fetchTopMovies = async () => {
    const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;

    const topMovieTitles = [
      { title: 'The Brutalist' },
      { title: 'The Substance' },
      { title: 'Wicked' },
      { title: 'Emilia Pérez' },
      { title: 'Babygirl' },
      { title: 'Anora' },
      { title: 'Landman' },
      { title: 'Squid Game' },
      { title: 'Heretic' },
      { title: 'Nickel Boys' },
      { title: 'Je suis toujours là' },

    ];

    const moviePromises = topMovieTitles
      .slice(0, 4)
      .map(async ({ title }) => {
        const response = await fetch(
          `https://www.omdbapi.com/?t=${title}&apikey=${OMDB_API_KEY}`
        );
        const movie = await response.json();
        return {
          title: movie.Title,
          year: movie.Year,
          poster: movie.Poster,
          link: `https://www.imdb.com/title/${movie.imdbID}`,
        };
      });

    const movies = await Promise.all(moviePromises);
    setMovies(movies);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTopMovies();
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">Chargement des meilleurs films...</p>
      </div>
    );
  }

  return (
    <div className="h-full grid grid-cols-2 md:grid-cols-4 gap-4">
      {movies.map((movie, index) => (
        <div key={index} className="flex flex-col p-2 bg-gray-50 dark:bg-black rounded-lg">
          <div className="relative w-full h-40 mb-2">
            <a href={movie.link} target="_blank" rel="noopener noreferrer">
              <Image
                src={movie.poster || '/api/placeholder/160/200'}
                alt={movie.title}
                layout="fill"
                objectFit="cover"
                className="rounded-md"
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
  );
};

export default MovieModule;
