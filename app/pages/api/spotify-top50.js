import { NextResponse } from 'next/server';
import SpotifyWebApi from 'spotify-web-api-node';

export async function GET() {
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  });

  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body['access_token']);

    const topTracks = await spotifyApi.getPlaylistTracks('37i9dQZF1DXcBWIGoYBM5M');
    const tracks = topTracks.body.items.map(item => item.track);

    return NextResponse.json(tracks);
  } catch (error) {
    console.error('Erreur dans l’API Spotify :', error);
    return NextResponse.json({ error: 'Impossible de récupérer les tracks' }, { status: 500 });
  }
}
