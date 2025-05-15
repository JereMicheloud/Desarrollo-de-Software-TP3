import axios from 'axios';

const clientId = localStorage.getItem("CLIENT_ID");
const clientSecret = localStorage.getItem("CLIENT_SECRET");

// Función para obtener el access token
const getAccessToken = async () => {
  const clientId = localStorage.getItem('CLIENT_ID');
  const clientSecret = localStorage.getItem('CLIENT_SECRET');

  if (!clientId || !clientSecret) {
    throw new Error('Faltan CLIENT_ID o CLIENT_SECRET en el localStorage');
  }

  const credentials = btoa(`${clientId}:${clientSecret}`); // Codifica a base64

  const response = await axios.post(
    TOKEN_URL,
    new URLSearchParams({
      grant_type: 'client_credentials'
    }),
    {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return response.data.access_token;
};

// Creamos una instancia de axios (sin el token por ahora)
const api = axios.create({
  baseURL: API_URL,
});

// Interceptamos las peticiones para ponerle el token automáticamente
api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Funciones para usar la API
export const searchArtists = (query) => {
  return api.get(`/search`, {
    params: {
      q: query,
      type: 'artist',
    },
  });
};

export const searchArtistAlbums = (artistId) => {
  return api.get(`/artists/${artistId}/albums`);
};

export const getArtistInfo = (artistId) => {
  return api.get(`/artists/${artistId}`);
};

export const getAlbumDetails = (albumId) => {
    return api.get(`/albums/${albumId}`);
};
  