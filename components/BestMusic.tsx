const BestMusic = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-64 bg-transparent rounded-lg gap-8">
      <iframe
        className="rounded-xl"
        src="https://open.spotify.com/embed/playlist/37i9dQZEVXbMDoHDwVN2tF?utm_source=generator"
        width="100%"
        height="152"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    </div>
  );
};

export default BestMusic;
