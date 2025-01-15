import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Music, Film, Clock, Tv } from 'lucide-react';
import Parser from 'rss-parser'; // Importation de rss-parser
import { motion, AnimatePresence } from 'framer-motion';


const TrendingCards = () => {
  const [activeModule, setActiveModule] = useState(0);
  const modules = [
    {
      title: 'Top Musiques',
      icon: <Music className="size-4" />,
      content: (
        <iframe
          style={{ borderRadius: '12px' }}
          src="https://open.spotify.com/embed/playlist/37i9dQZF1DWVuV87wUBNwc?utm_source=generator"
          width="100%"
          height="152"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>
      ),
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
        <button onClick={handlePrev} aria-label="Previous">
          <ChevronLeft />
        </button>
        <Card className="w-full max-w-md mx-4 overflow-hidden">
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              {modules[activeModule].icon}
              {modules[activeModule].title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeModule}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
              >
                {modules[activeModule].content}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
        <button onClick={handleNext} aria-label="Next">
          <ChevronRight />
        </button>
      </div>
    );
  };

// Module pour les actualités
const NewsModule = () => {
  const [news, setNews] = useState<Array<{
    title: string;
    link: string;
    description: string;
    pubDate?: string;
    enclosure?: { url: string };
  }>>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const parser = new Parser();
        const response = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://news.google.com/rss?hl=fr'));
        const data = await response.json();

        const feed = await parser.parseString(data.contents);
        setNews(feed.items.map(item => ({
          title: item.title || '',
          link: item.link || '',
          description: item.contentSnippet || item.content || '',
          pubDate: item.pubDate || '',
          enclosure: item.enclosure
        })));
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

  return (
    <div>
      {news.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
          {news.slice(0, 4).map((item, index) => (
            <div key={index} className="text-center">
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-sm mt-2 hover:underline">
                {item.title.length > 100 ? `${item.title.substring(0, 100)}...` : item.title}
              </a>
              {item.pubDate && (
              <p className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
                <Clock className="size-3" />
                {formatDate(item.pubDate)}
              </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>Chargement des actualités...</p>
      )}
    </div>
  );
};


// Module pour les devinettes
const RiddlesModule = () => {
  return (
    <div>
     <span>Chargement...</span>
    </div>
  );
};

export default TrendingCards;
