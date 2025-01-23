import React, { useState, useEffect } from 'react';
import Parser from 'rss-parser';
import Image from 'next/image';

interface NewsItem {
  title: string;
  link: string;
  pubDate?: string;
  imageUrl?: string;
}

const FootballNewsModule: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const parser = new Parser({
          customFields: {
            item: ['enclosure']
          }
        });
        const response = await fetch(
          'https://api.allorigins.win/get?url=' + encodeURIComponent('https://rmcsport.bfmtv.com/rss/football/')
        );
        const data = await response.json();

        const feed = await parser.parseString(data.contents);
        const newsData = feed.items.map((item) => ({
          title: item.title || '',
          link: item.link || '',
          pubDate: item.pubDate || '',
          imageUrl: item.enclosure ? item.enclosure.url : undefined,
        }));

        setNews(newsData.slice(0, 4));
      } catch (error) {
        console.error('Error fetching football news:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">Loading football news...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-8">
      {news.map((item, index) => (
        <div key={index} className="bg-gray-50 dark:bg-black rounded-lg overflow-hidden shadow-sm">
          {item.imageUrl && (
            <div className="relative h-40">
              <Image
                src={item.imageUrl}
                alt={item.title}
                className="object-cover"
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>
          )}
          <div className="p-2">
            <a href={item.link} target="_blank" rel="noopener noreferrer">
              <h3 className="text-xs font-medium line-clamp-2">{item.title}</h3>
            </a>
            <p className="text-[10px] text-gray-500">
              {new Date(item.pubDate || '').toLocaleString('fr-FR')}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FootballNewsModule;
