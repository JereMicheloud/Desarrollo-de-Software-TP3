import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function FavoriteSongs() {
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    const favoritosGuardados = JSON.parse(localStorage.getItem('favoritos')) || [];
    setFavoritos(favoritosGuardados);
  }, []);

  return (
    <div>
      <h2>Canciones Favoritas</h2>
      {favoritos.length === 0 ? (
        <p>No hay canciones favoritas aún.</p>
      ) : (
        <ul>
          {favoritos.map((cancion) => (
            <li key={cancion.id}>
              <Link to={`/artist/album/${cancion.albumId}`}>
                {cancion.name} - {cancion.artistName} ({cancion.albumName})
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FavoriteSongs;
