import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Music, Film, Clock, Brain } from 'lucide-react';
import Parser from 'rss-parser'; // Importation de rss-parser

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
      title: 'Devinettes',
      icon: <Brain className="size-4" />,
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
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="flex justify-between pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {modules[activeModule].icon}
            {modules[activeModule].title}
          </CardTitle>
        </CardHeader>
        <CardContent>{modules[activeModule].content}</CardContent>
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
              {item.title}
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
  const riddles = [
    { question: 'Qu’est-ce qui a un cou mais pas de tête ?', answer: 'Une bouteille.' },
    { question: 'Plus je sèche, plus je grandis. Que suis-je ?', answer: 'Une serviette.' },
    { question: 'Quel est l’animal qui a la queue devant ?', answer: 'Un serpent.' },
  ];

  const [currentRiddle, setCurrentRiddle] = useState(0);

  return (
    <div>
      <p className="font-medium">{riddles[currentRiddle].question}</p>
      <button
        onClick={() => alert(riddles[currentRiddle].answer)}
        className="text-blue-500 hover:underline mt-2"
      >
        Voir la réponse
      </button>
      <button
        onClick={() => setCurrentRiddle((prev) => (prev === riddles.length - 1 ? 0 : prev + 1))}
        className="mt-2 block text-gray-500 hover:text-gray-700"
      >
        Devinette suivante
      </button>
    </div>
  );
};

export default TrendingCards;
