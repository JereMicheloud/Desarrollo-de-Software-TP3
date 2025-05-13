import {searchArtists} from '../services/spotifyApi';
import ArtistCard from '../components/ArtistCard';
import {useContext, useState} from "react";
import {FavoritesContext} from "../contexts/FavoritesContext";
import {Link} from 'react-router-dom';

function Home() {
  const {favorites} = useContext(FavoritesContext);
  const [query, setQuery] = useState('');
  const [artists, setArtists] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await searchArtists(query);
      setArtists(response.data.artists.items);
    } catch (error) {
      console.error('Error buscando artistas:', error);
    }
  };

  return (
    <div style={{display: 'flex'}}>
      
      {/* Columna de artistas favoritos */}
      <Link to="/artist/album/favoritos">Ver Canciones Favoritas</Link>
      <div style={{ width: '25%', padding: '10px', borderRight: '1px solid gray' }}>
        <h2>Artistas Favoritos:</h2>
        {favorites.length > 0 ? (
          favorites.map((artist) => (
            <div key={artist.id} style={{ marginBottom: '10px' }}>
              <Link to={`/artist/${artist.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                <img 
                  src={artist.images[0]?.url || 'https://via.placeholder.com/50'}
                  alt={artist.name}
                  style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%' }}
                />
                <p>{artist.name}</p>
              </Link>
            </div>
          ))
        ) : (
          <p>No hay artistas favoritos aún.</p>
        )}
      </div>

      {/* Columna de búsqueda de artistas */}
      <div style={{ flex: 1, padding: '10px' }}>
        <h1>Buscar Artistas</h1>
        <input
          type="text"
          placeholder="Buscar artista..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Buscar</button>

        <div style={{ marginTop: '20px' }}>
          {artists.length > 0 ? (
            artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))
          ) : (
            <p>No se han encontrado artistas.</p>
          )}
        </div>
      </div>

    </div>
  );
}

export default Home;
