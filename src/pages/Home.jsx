import {searchArtists} from '../services/spotifyApi';
import ArtistCard from '../components/ArtistCard';
import SearchBar from '../components/SearchBar';
import {useContext, useState, useRef} from "react";
import {FavoritesContext} from "../contexts/FavoritesContext";
import {Link, useNavigate} from 'react-router-dom';
import "../App.css";

function Home() {
  const {favorites, removeFavorite} = useContext(FavoritesContext);
  const [query, setQuery] = useState('');
  const [artists, setArtists] = useState([]);
  const [hoveredArtistId, setHoveredArtistId] = useState(null);
  const navigate = useNavigate();
  const typingTimeout = useRef();

  // Búsqueda reactiva al escribir
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      if (value.trim() !== '') handleSearch(value);
      else setArtists([]);
    }, 350);
  };

  const handleSearch = async (q) => {
    try {
      const response = await searchArtists(q);
      setArtists(response.data.artists.items);
    } catch (error) {
      console.error('Error buscando artistas:', error);
    }
  };

  return (
    <div className="home-root">
      <div className="home-fav-col">
        <Link to="/artist/album/favoritos" className="link-btn" style={{marginBottom: '1em'}}>Ver Canciones Favoritas</Link>
        <h2 style={{color: '#fff'}}>Artistas Favoritos:</h2>
        {favorites.length > 0 ? (
          favorites.map((artist, idx) => (
            <div
              key={artist.id}
              className="fav-artist-row"
              style={{
                animationDelay: `${idx * 0.13}s`,
                userSelect: 'none'
              }}
              onMouseEnter={() => setHoveredArtistId(artist.id)}
              onMouseLeave={() => setHoveredArtistId(null)}
              onClick={e => {
                if (e.target.classList.contains('fav-artist-delete')) return;
                navigate(`/artist/${artist.id}`);
              }}
              tabIndex={0}
              role="button"
            >
              <img
                src={artist.images[0]?.url}
                alt={artist.name}
                width="44"
                height="44"
                className="fav-artist-img"
              />
              <span className="fav-artist-link">{artist.name}</span>
              <button
                className="fav-artist-delete"
                style={{
                  opacity: hoveredArtistId === artist.id ? 1 : 0
                }}
                title="Eliminar de favoritos"
                onClick={e => {
                  e.stopPropagation();
                  removeFavorite(artist.id);
                }}
              >✕</button>
            </div>
          ))
        ) : (
          <p style={{color: '#b3b3b3'}}>No hay artistas favoritos aún.</p>
        )}
      </div>
      <div className="home-search-col">
        <h1>Buscar Artistas</h1>
        <form onSubmit={e => { e.preventDefault(); handleSearch(query); }} className="home-search-form">
          <input
            type="text"
            name="search"
            placeholder="Buscar artista..."
            value={query}
            onChange={handleInputChange}
            autoComplete="off"
          />
          <button type="submit" className="link-btn">Buscar</button>
        </form>
        <div className="home-search-results">
          {artists.length > 0 ? (
            artists.map((artist, idx) => (
              <div
                key={artist.id}
                className="home-artist-anim"
                style={{
                  animationDelay: `${idx * 0.13}s`
                }}
              >
                <ArtistCard artist={artist} />
              </div>
            ))
          ) : (
            <p style={{color: '#b3b3b3'}}>No se han encontrado artistas.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;