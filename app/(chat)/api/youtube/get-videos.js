import axios from "axios";
import { useEffect, useState } from "react";

const API_KEY = process.env.YOUTUBE_API_KEY; // Utilise la clé API depuis les variables d'environnement
const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/videos";

const fetchTrendingVideos = async () => {
  try {
    const response = await axios.get(YOUTUBE_API_URL, {
      params: {
        part: "snippet",
        chart: "mostPopular",
        regionCode: "FR", // Code de région (FR pour la France)
        maxResults: 10,  // Nombre maximum de vidéos à récupérer
        key: API_KEY,
      },
    });
    return response.data.items; // Renvoie les vidéos
  } catch (error) {
    console.error("Erreur lors de la récupération des vidéos YouTube :", error);
    return [];
  }
};

export default function handler(req, res) {
  fetchTrendingVideos().then((videos) => {
    res.status(200).json(videos);
  });
}
