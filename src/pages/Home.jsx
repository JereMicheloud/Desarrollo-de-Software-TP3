import {searchArtists} from '../services/spotifyApi';
import ArtistCard from '../components/ArtistCard';
import SearchBar from '../components/SearchBar';
import {useContext, useState, useRef} from "react";
import {FavoritesContext} from "../contexts/FavoritesContext";
import {Link, useNavigate} from 'react-router-dom';

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
    <div style={{display: 'flex', gap: '2em', minHeight: '70vh', width: '100%', justifyContent: 'center'}}>
      {/* Columna de artistas favoritos */}
      <div style={{
        width: '25%',
        minWidth: 200,
        maxWidth: 260,
        padding: '1.5em 1em',
        borderRight: '1.5px solid #282828',
        background: '#191414',
        borderRadius: '16px 0 0 16px',
        display: 'flex',
        flzexDirection: 'column',
        alignItems: 'center'
      }}>
        <style>
          {`
            .fav-artist-row {
              display: flex;
              align-items: center;
              gap: 1em;
              background: #232323;
              border-radius: 50px;
              padding: 0.5em 1em;
              margin-bottom: 1em;
              box-shadow: 0 2px 8px #1db95433;
              border: 2px solid #1db954;
              min-width: 0;
              max-width: 260px;
              position: relative;
              transition: box-shadow 0.25s cubic-bezier(.4,0,.2,1), transform 0.22s cubic-bezier(.4,0,.2,1), opacity 0.5s cubic-bezier(.4,0,.2,1);
              cursor: pointer;
              opacity: 0;
              transform: translateY(30px);
              animation: fadeinartist 0.7s forwards;
            }
            @keyframes fadeinartist {
              to {
                opacity: 1;
                transform: none;
              }
            }
            .fav-artist-row:hover {
              box-shadow: 0 8px 32px #1db95455;
              transform: scale(1.04);
            }
            .fav-artist-delete {
              opacity: 0;
              transition: opacity 0.18s;
              position: absolute;
              top: 50%;
              right: 8px;
              transform: translateY(-50%);
              background: #191414;
              color: #e74c3c;
              border: none;
              font-size: 1.1em;
              cursor: pointer;
              padding: 0.2em 0.5em;
              border-radius: 50%;
              z-index: 2;
              box-shadow: 0 2px 8px #0002;
            }
            .fav-artist-row:hover .fav-artist-delete {
              opacity: 1;
            }
            .fav-artist-link {
              display: flex;
              align-items: center;
              gap: 1em;
              flex: 1;
              text-decoration: none;
              color: #fff;
              overflow: visible;
              text-overflow: unset;
              white-space: normal;
              height: 100%;
              font-weight: 700;
              font-size: 1.05em;
              min-width: 0;
              word-break: break-word;
            }
            .link-btn {
              display: inline-block;
              border-radius: 24px;
              padding: 0.6em 1.5em;
              font-size: 1em;
              font-weight: 600;
              background-color: #1db954;
              color: #fff !important;
              text-decoration: none;
              cursor: pointer;
              transition: background 0.2s, color 0.2s, box-shadow 0.2s;
              box-shadow: 0 2px 8px rgba(30,185,84,0.08);
              margin: 0.5em 0;
            }
            .link-btn:hover {
              background-color: #1ed760;
              color: #191414 !important;
              box-shadow: 0 4px 16px rgba(30,185,84,0.18);
            }
          `}
        </style>
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
                style={{
                  objectFit: 'cover',
                  borderRadius: '50%',
                  border: '2px solid #1db954',
                  background: '#191414'
                }}
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

      {/* Columna de búsqueda de artistas */}
      <div style={{ flex: 1, padding: '1.5em 1em', background: '#191414', borderRadius: '0 16px 16px 0' }}>
        <h1>Buscar Artistas</h1>
        <form onSubmit={e => { e.preventDefault(); handleSearch(query); }} style={{display: 'flex', gap: '1em', justifyContent: 'center', margin: '1em 0'}}>
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
        <div style={{ marginTop: '2em', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5em' }}>
          {artists.length > 0 ? (
            artists.map((artist, idx) => (
              <div
                key={artist.id}
                style={{
                  opacity: 0,
                  transform: 'translateY(30px)',
                  animation: `fadeinartist 0.7s forwards`,
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
