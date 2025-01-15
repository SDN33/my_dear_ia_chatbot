import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Music, Film, Clock, Tv, FilmIcon } from 'lucide-react';
import Parser from 'rss-parser';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { title } from 'process';

const TrendingCards = () => {
  const [activeModule, setActiveModule] = useState(0);
  const modules = [
    {
      title: 'Top Musiques',
      icon: <Music className="size-4" />,
      content: (
        <div className="h-full flex items-center justify-center mt-16 dark:bg-black">
          <iframe className='item-center -mt-40' style={{ borderRadius: '12px' }} src="https://open.spotify.com/embed/playlist/37i9dQZF1DWVuV87wUBNwc?utm_source=generator" width="100%" height="152" frameBorder="0" allowFullScreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        </div>
      ),
    },
    {
      title: 'Films populaires',
      icon: <FilmIcon className="size-4" />,
      content: <BestRatedMovies />,
    },
    {
      title: 'Actualités',
      icon: <Film className="size-4" />,
      content: <NewsModule />,
    },
    {
      title: 'Publicités',
      icon: <Tv className="size-4" />,
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
    <div className="w-full flex items-center justify-center">
      <button onClick={handlePrev} className="p-2 hover:bg-gray-100 rounded-full" aria-label="Previous">
        <ChevronLeft className="size-6" />
      </button>
      <Card className="w-full max-w-2xl mx-4">
        <CardHeader className="flex justify-between pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {modules[activeModule].icon}
            {modules[activeModule].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[260px] overflow-hidden dark:bg-black">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {modules[activeModule].content}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
      <button onClick={handleNext} className="p-2 hover:bg-gray-100 rounded-full" aria-label="Next">
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

  // Module pour les meilleurs films notés
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
        `http://www.omdbapi.com/?t=${title}&apikey=${OMDB_API_KEY}`
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
    <div className="h-full grid grid-cols-2 md:grid-cols-4 gap-4">
      {movies.map((movie, index) => (
        <div key={index} className="flex flex-col justify-between p-2 bg-gray-50 dark:bg-black rounded-lg">
          <div className="relative w-full h-40 mb-2">
            <Image
              src={movie.poster || '/api/placeholder/160/200'}
              alt={movie.title}
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm font-medium text-center line-clamp-2" title={movie.title}>
              {movie.title}
            </p>
            <p className="text-xs text-gray-500">{movie.year}</p>
            <a
              href={movie.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline"
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
          enclosure: item.enclosure
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

const RiddlesModule = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <p className="text-gray-500">Chargement...</p>
    </div>
  );
};

export default TrendingCards;
