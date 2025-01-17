import React, { useState, useEffect } from 'react';
import Image from 'next/image';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

import { ChevronLeft, ChevronRight, Film, Clock, Link, Rss } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Parser from 'rss-parser';
import SpotifyPlayer from './BestMusic';

const TrendingCards = () => {
  const [activeModule, setActiveModule] = useState(0);
  interface Module {
    title: string;
    icon: React.ReactElement;
    content: React.ReactElement;
    className?: string;
  }

  const modules: Module[] = [
      {
        title: 'Spotify',
        icon: (
          <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
        ),
        content: (
          <div>
            <div className=" h-full items-center justify-center -mt-4  dark:bg-black">
              <SpotifyPlayer />
            </div>
          </div>
        ),
      },
      {
        title: 'Films populaires',
        icon: <Film className="size-4" />,
        content: <BestRatedMovies />,
      },
      {
        title: 'Actualités',
        icon: <Rss className="size-4" />,
        content: <NewsModule />,
      },
      {
        title: 'Youtube',
        icon: (
          <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        ),
        content: <YoutubeModule />,
      },
      {
        title: 'Publicités',
        icon: <Link className="size-4" />,
        content: <RiddlesModule />,
      },
  ];

  const handlePrev = () => {
    setActiveModule((prev) => (prev === 0 ? modules.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveModule((prev) => (prev === modules.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full flex items-center justify-center py-4 bg-gradient-to-b from-teal-400 to-rose-200">
      <button onClick={handlePrev} className="p-1 hover:scale-150 rounded-full" aria-label="Previous">
        <ChevronLeft className="size-6" />
      </button>
      <Card className="w-full max-w-4xl mx-4 shadow-md">
        <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
            {modules[activeModule].icon}
            {modules[activeModule].title}
            </CardTitle>
        </CardHeader>
        <CardContent className="h-[260px] w-auto overflow-hidden dark:bg-transparent">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className={`h-full ${modules[activeModule].className || ''}`}
            >
              {modules[activeModule].content}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
      <button onClick={handleNext} className="p-1 hover:scale-150 rounded-full" aria-label="Next">
        <ChevronRight className="size-6" />
      </button>
    </div>
  );
};


const BestRatedMovies = () => {
  interface Movie {
    title: string;
    poster: string;
    year: string;
    link: string;
  }

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
    ]

    const moviePromises = topMovieTitles
      .sort(() => 0.5 - Math.random())
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
          link: `https://www.imdb.com/title/${movie.imdbID}`
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
    <div className="h-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
      {movies.map((movie, index) => (
          <div key={index} className="flex flex-col justify-between p-1 md:p-2 bg-gray-50 dark:bg-black rounded-lg">
          <div className="relative w-full h-32 md:h-40 mb-1 md:mb-2">
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
          <div className="flex flex-col items-center gap-1 md:gap-2">
            <p className="text-xs md:text-sm font-medium text-center line-clamp-1 md:line-clamp-2" title={movie.title}>
              {movie.title}
            </p>
            <p className="text-xs md:hidden">{movie.year}</p>
            <p className="hidden md:block">{movie.year}</p>
            <a
              href={movie.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] md:text-xs text-teal-500 hover:underline"
            >
              Voir sur IMDb
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

const NewsModule = () => {
  interface NewsItem {
    title: string;
    link: string;
    pubDate?: string;
    image?: string;
  }

  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Check cache first
        const cachedData = localStorage.getItem('newsCache');
        const cacheTimestamp = localStorage.getItem('newsCacheTimestamp');
        const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

        // If we have valid cached data, use it
        if (cachedData && cacheTimestamp) {
          const isStillValid = Date.now() - parseInt(cacheTimestamp) < CACHE_DURATION;
          if (isStillValid) {
            setNews(JSON.parse(cachedData));
            setIsLoading(false);
            return;
          }
        }

        // If no cache or expired, fetch new data
        const parser = new Parser();
        const response = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://news.google.com/rss?hl=fr'));
        const data = await response.json();

        const feed = await parser.parseString(data.contents);
        const newsData = feed.items.map(item => ({
          title: item.title || '',
          link: item.link || '',
          description: item.contentSnippet || item.content || '',
          pubDate: item.pubDate || '',
          enclosure: item.enclosure,
          image: item.image
        }));

        // Update cache
        localStorage.setItem('newsCache', JSON.stringify(newsData));
        localStorage.setItem('newsCacheTimestamp', Date.now().toString());

        setNews(newsData);
      } catch (error) {
        console.error('Erreur lors de la récupération des actualités :', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };



  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">Chargement des actualités...</p>
      </div>
    );
  }

  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-4 ">
      {news.slice(0, 4).map((item, index) => (
        <div key={index} className="flex flex-col justify-between p-4 bg-gray-50 dark:bg-black rounded-lg">
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium hover:underline line-clamp-3"
            
          >
            {item.title}
          </a>
          {item.pubDate && (
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <Clock className="size-3" />
              {formatDate(item.pubDate)}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};


// Module pour les vidéos TikTok
const YoutubeModule = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <p className="text-gray-500">Chargement...</p>
    </div>
  );
}


// Module pour les publicités
const RiddlesModule = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <p className="text-gray-500">Chargement...</p>
    </div>
  );
};

export default TrendingCards;
