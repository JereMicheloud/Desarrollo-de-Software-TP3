import axios from 'axios';

const API_URL = 'https://api.spotify.com/v1'; 
const TOKEN = 'BQBqX8nEbQFB7qA3eakpzXlXmLHs1LgFiCxD-th-j6OjqDOysWxHNy7WMXHy3I9SUlGyi11nqdUhHyDpX_0iRUovk4PxchGHrQ9tfJ9EvVEQoogNgFgsJHIfbwcqbK72kBlFIFbArBU';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

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