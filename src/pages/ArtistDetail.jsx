import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {searchArtistAlbums} from '../services/spotifyApi';
import {getArtistInfo} from '../services/spotifyApi';
import {Link} from 'react-router-dom';
import {FavoritesContext} from '../contexts/FavoritesContext';
import {useContext} from 'react';
import AlbumCard from '../components/AlbumCard';



function ArtistDetail() {
  const {id} = useParams();
  const [albums, setAlbums] = useState([]);
  const [artist, setArtist] = useState([]);
  const [loading, setLoading] = useState(true); // Para controlar el cargando
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const artistResponse = await getArtistInfo(id); // Obtiene nombre y foto
        setArtist(artistResponse.data);

        const albumsResponse = await searchArtistAlbums(id);
        setAlbums(albumsResponse.data.items);
      } catch (error) {
        console.error('Error cargando los álbumes:', error);
        setError('No se pudieron cargar los álbumes.');
      } finally {
        setLoading(false); // Siempre termina cargando
      }
    };

    fetchAlbums();
  }, [id]);

  const {favorites, addFavorite, removeFavorite} = useContext(FavoritesContext);
  
  const isFavorite = favorites.some(fav => fav.id === artist.id);

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFavorite(artist.id);
    } else {
      addFavorite(artist);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
        <Link to="/">Volver</Link>
        <img src={artist.images[0]?.url} alt={artist.name} width="100" />
        <h2>{artist.name}</h2>
        <button onClick={toggleFavorite}>
            {isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
        </button>
        <h1>Álbumes</h1>
        <div>
            {albums.length > 0 ? (
            albums.map((album) => (
                <div key={album.id}>
                    <AlbumCard album={album} />
                </div>

            ))
            ) : (
            <p>No se encontraron álbumes para este artista.</p>
            )}
        </div>
    </div>
  );
}

export default ArtistDetail;
