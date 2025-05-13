import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {getAlbumDetails} from "../services/spotifyApi";
import {Link} from 'react-router-dom';

function AlbumDetail() {
  const {albumId} = useParams(); // <-- ID del álbum desde la URL
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlbum = async () => {
        try {
          const response = await getAlbumDetails(albumId);
          setAlbum(response.data);
        } catch (error) {
          console.error('Error al obtener detalles del álbum:', error);
          setError('No se pudieron cargar los álbumes.');
        } finally {
          setLoading(false);
        }
    };
    
        fetchAlbum();
    }, [albumId]);

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>{error}</div>;

    const addFavorites = (track) => {
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
        const nuevoFavorito = {
          id: track.id,
          name: track.name,
          albumName: album.name,
          artistName: album.artists[0].name,
          albumId: album.id,
        };
        localStorage.setItem('favoritos', JSON.stringify([...favoritos, nuevoFavorito]));
      };      
    
  return (
    <div>
        <Link to={`/artist/${album.artists[0].id}`}>Volver</Link>
        <h2>{album.name}</h2>
        <h3>Artista: {album.artists[0].name}</h3>
        <img src={album.images[0]?.url} alt={album.name} style={{ width: '300px' }} />
        <h4>Lista de Canciones:</h4>
        <ul>
            {album.tracks.items.map((track) => (
                <li key={track.id}>
                    {track.name}
                    <button onClick={() => addFavorites(track)}>❤️</button>
                </li>
            ))}
        </ul>
    </div>
  );
}

export default AlbumDetail;
