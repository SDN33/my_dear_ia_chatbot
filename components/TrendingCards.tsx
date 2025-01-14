import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Music, Film } from 'lucide-react';
import Image from 'next/image';

const TrendingCards = () => {


  return (
    <div className="grid sm:grid-cols-2 gap-4 w-full">
      {/* Music Card */}
      <Card className="w-full">
        <CardHeader className="flex justify-between pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Music className="size-4" />
            Top Musiques
          </CardTitle>
        </CardHeader>
        <CardContent>
        <iframe style={{borderRadius: '12px'}} src="https://open.spotify.com/embed/playlist/37i9dQZF1DWVuV87wUBNwc?utm_source=generator" width="100%" height="152" frameBorder="0" allowFullScreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        </CardContent>
      </Card>

      {/* Movie Card */}
      <Card className="w-full">
        <CardHeader className="flex justify-between pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Film className="size-4" />
            Actualités
          </CardTitle>
        </CardHeader>
        <CardContent>
            <div>
              <div className="relative w-full h-32">
              <p className="text-center text-gray-500">Chargement...</p>
              </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
};


export default TrendingCards;
