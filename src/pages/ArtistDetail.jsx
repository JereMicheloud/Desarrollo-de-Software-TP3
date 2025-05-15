import {useEffect, useState, useContext} from 'react';
import {useParams, Link} from 'react-router-dom';
import {searchArtistAlbums, getArtistInfo, getAlbumDetails} from '../services/spotifyApi';
import {FavoritesContext} from '../contexts/FavoritesContext';
import AlbumCard from '../components/AlbumCard';
import { useNavigate } from 'react-router-dom';

function LoadingScreen() {
  return (
    <div style={{
      minHeight: '40vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: 60, height: 60, borderRadius: '50%',
        border: '6px solid #1db954',
        borderTop: '6px solid #191414',
        animation: 'spin 1s linear infinite',
        marginBottom: 20
      }} />
      <style>
        {`
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
        `}
      </style>
      <span style={{color: '#1db954', fontWeight: 600, fontSize: '1.2em', letterSpacing: '0.04em'}}>Cargando artista...</span>
    </div>
  );
}

function HeartIcon({ filled }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill={filled ? "#1db954" : "none"}
      stroke={filled ? "#1db954" : "#b3b3b3"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        verticalAlign: 'middle',
        transition: 'fill 0.2s, stroke 0.2s',
        filter: filled ? 'drop-shadow(0 0 6px #1db95488)' : 'none'
      }}
    >
      <path d="M12 21s-6.2-5.2-8.5-8.1C1.2 10.2 2.1 7.1 5 6.2c1.7-.5 3.4.4 4.3 1.7C10.7 7.1 12.3 6.2 14 6.2c2.9.9 3.8 4 1.5 6.7C18.2 15.8 12 21 12 21z"/>
    </svg>
  );
}

// Helper para formatear duración mm:ss
function formatDuration(ms) {
  const min = Math.floor(ms / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function ArtistDetail() {
  const {artistid} = useParams();
  const [albums, setAlbums] = useState([]);
  const [artist, setArtist] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [albumTracks, setAlbumTracks] = useState({}); // albumId -> tracks
  const {favorites, addFavorite, removeFavorite} = useContext(FavoritesContext);
  const [hoveredArtist, setHoveredArtist] = useState(false);
  const [hoveredAlbum, setHoveredAlbum] = useState(null);
  const [favSongs, setFavSongs] = useState(() => JSON.parse(localStorage.getItem('favoritos')) || []);
  const [favBtnAnim, setFavBtnAnim] = useState(false);
  const [favBtnHover, setFavBtnHover] = useState(false);
  const [openAlbumId, setOpenAlbumId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (artistid) {
      const fetchAlbums = async () => {
        try {
          const artistResponse = await getArtistInfo(artistid);
          setArtist(artistResponse.data);

          const albumsResponse = await searchArtistAlbums(artistid);
          setAlbums(albumsResponse.data.items);

          // Cargar tracks de todos los álbumes (no solo los primeros 3)
          const tracksObj = {};
          for (let i = 0; i < albumsResponse.data.items.length; i++) {
            const album = albumsResponse.data.items[i];
            try {
              const albumDetail = await getAlbumDetails(album.id);
              tracksObj[album.id] = albumDetail.data.tracks.items;
            } catch {}
          }
          setAlbumTracks(tracksObj);
        } catch (error) {
          setError('No se pudieron cargar los álbumes.');
        } finally {
          setLoading(false);
        }
      };
      fetchAlbums();
    }
  }, [artistid]);

  const isFavorite = favorites.some(fav => fav.id === artist.id);

  const toggleFavorite = () => {
    setFavBtnAnim(true);
    setTimeout(() => setFavBtnAnim(false), 350);
    if (isFavorite) {
      removeFavorite(artist.id);
    } else {
      addFavorite(artist);
    }
  };

  // Canción favorita
  const isSongFavorite = (trackId) => favSongs.some(fav => fav.id === trackId);
  const toggleSongFavorite = (track, album) => {
    let nuevos = JSON.parse(localStorage.getItem('favoritos')) || [];
    const exists = nuevos.some(fav => fav.id === track.id);
    if (!exists) {
      const nuevoFavorito = {
        id: track.id,
        name: track.name,
        albumName: album.name,
        artistName: artist.name,
        albumId: album.id,
        albumImage: album.images[0]?.url || '',
      };
      nuevos = [...nuevos, nuevoFavorito];
    } else {
      nuevos = nuevos.filter(fav => fav.id !== track.id);
    }
    setFavSongs(nuevos);
    localStorage.setItem('favoritos', JSON.stringify(nuevos));
  };

  if (loading) return <LoadingScreen />;
  if (error) return <div>{error}</div>;

  return (
    <div
      style={{
        textAlign: 'center',
        maxWidth: 900,
        margin: '0 auto',
        padding: '2em 1em',
        position: 'relative',
        animation: 'fadein 1.1s cubic-bezier(.4,0,.2,1)'
      }}
    >
      <style>
        {`
        @keyframes fadein {
          from { opacity: 0; transform: translateY(40px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .fav-anim {
          transition: background 0.2s, color 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .fav-anim:active {
          transform: scale(0.92);
        }
        .fav-anim.fav-anim-pulse {
          animation: favpulse 0.35s;
        }
        @keyframes favpulse {
          0% { box-shadow: 0 0 0 0 #1db95455; transform: scale(1);}
          60% { box-shadow: 0 0 0 10px #1db95422; transform: scale(1.09);}
          100% { box-shadow: 0 0 0 0 #1db95400; transform: scale(1);}
        }
        .fav-anim.fav-anim-hover {
          box-shadow: 0 0 0 6px #1db95433;
          transform: scale(1.04);
        }
        .track-row {
          transition: background 0.18s;
        }
        .track-row:hover {
          background: #232323;
        }
        .fav-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0.2em 0.7em;
          border-radius: 50%;
          transition: background 0.18s;
        }
        .fav-btn:hover {
          background: #232323;
        }
        .artist-img-anim {
          transition: box-shadow 0.3s, transform 0.2s;
        }
        .artist-img-anim:hover {
          box-shadow: 0 8px 32px #1db95455;
          transform: scale(1.04);
        }
        .album-anim {
          transition: box-shadow 0.32s cubic-bezier(.4,0,.2,1), transform 0.28s cubic-bezier(.4,0,.2,1), opacity 0.5s cubic-bezier(.4,0,.2,1);
          background: #232323;
          border-radius: 18px;
          padding: 1.5em 1em 1em 1em;
          margin-bottom: 1.5em;
          box-shadow: 0 2px 16px #1db95422;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          opacity: 0;
          transform: translateY(40px);
          animation: fadein 0.8s forwards;
        }
        .album-anim:hover {
          box-shadow: 0 8px 32px #1db95455;
          transform: scale(1.03);
        }
        .album-header {
          display: flex;
          align-items: center;
          gap: 1.5em;
          margin-bottom: 1em;
          width: 100%;
        }
        .album-header img {
          border-radius: 12px;
          width: 80px;
          height: 80px;
          object-fit: cover;
          box-shadow: 0 2px 8px #1db95433;
        }
        .album-header-info {
          text-align: left;
        }
        .album-header-info h3 {
          margin: 0 0 0.2em 0;
          color: #fff;
          font-size: 1.15em;
        }
        .album-header-info span {
          color: #b3b3b3;
          font-size: 0.98em;
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
        .album-tracks-anim {
          overflow: hidden;
          animation: slideDownTracks 0.45s cubic-bezier(.4,0,.2,1);
        }
        @keyframes slideDownTracks {
          from { opacity: 0; transform: translateY(-30px);}
          to { opacity: 1; transform: translateY(0);}
        }
        `}
      </style>
      <header style={{width: '100%', display: 'flex', justifyContent: 'flex-start', marginBottom: '2em'}}>
        <Link to="/home" className="link-btn">Volver</Link>
      </header>
      <img
        src={artist.images && artist.images[0]?.url}
        alt={artist.name}
        width="120"
        height="120"
        className="artist-img-anim"
        style={{
          objectFit: 'cover',
          borderRadius: '12px',
          marginBottom: '1em',
          boxShadow: '0 4px 24px #1db95433'
        }}
        onMouseEnter={() => setHoveredArtist(true)}
        onMouseLeave={() => setHoveredArtist(false)}
      />
      <h2 style={{
        fontWeight: 800,
        letterSpacing: '0.01em',
        marginBottom: '0.3em',
        color: '#fff'
      }}>{artist.name}</h2>
      <button
        onClick={toggleFavorite}
        className={
          `fav-anim${favBtnAnim ? ' fav-anim-pulse' : ''}${favBtnHover ? ' fav-anim-hover' : ''}`
        }
        style={{
          marginBottom: '2em',
          background: isFavorite ? '#1db954' : '#282828',
          color: isFavorite ? '#fff' : '#b3b3b3',
          border: 'none',
          borderRadius: '24px',
          padding: '0.6em 1.5em',
          fontWeight: 600,
          fontSize: '1em',
          cursor: 'pointer',
          boxShadow: isFavorite ? '0 2px 8px #1db95455' : 'none'
        }}
        onMouseEnter={() => setFavBtnHover(true)}
        onMouseLeave={() => setFavBtnHover(false)}
      >
        {isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
      </button>
      <h1 style={{marginBottom: '1em'}}>Álbumes</h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2em',
        marginTop: '1.5em'
      }}>
        {albums.length > 0 ? (
          albums.map((album, idx) => (
            <div
              key={album.id}
              className="album-anim"
              style={{
                animationDelay: `${idx * 0.10}s`
              }}
              onMouseEnter={() => setOpenAlbumId(album.id)}
              onMouseLeave={() => setOpenAlbumId(null)}
            >
              <div
                className="album-header"
                style={{ cursor: 'pointer', width: '100%' }}
                onClick={() => navigate(`/artist/album/${album.id}`)}
              >
                <img src={album.images[0]?.url} alt={album.name} />
                <div className="album-header-info">
                  <h3>{album.name}</h3>
                  <span>{album.release_date?.substring(0, 4)} • {album.total_tracks} canciones</span>
                </div>
              </div>
              {/* Mostrar canciones solo si se cargaron para este álbum y está abierto */}
              {albumTracks[album.id] && openAlbumId === album.id && (
                <div className="album-tracks-anim" style={{margin: '0.5em 0 0 0', width: '100%'}}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: 700,
                    color: '#b3b3b3',
                    fontSize: '0.98em',
                    padding: '0.2em 1em 0.2em 1em',
                    borderBottom: '1px solid #232323'
                  }}>
                    <span style={{flex: 2, textAlign: 'left'}}>Nombre</span>
                    <span style={{
                      flex: 1,
                      textAlign: 'right',
                      minWidth: 70,
                      marginRight: 16 // Igual que el botón de favoritos
                    }}>Duración</span>
                  </div>
                  <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                    {albumTracks[album.id].slice(0, 5).map((track) => (
                      <li
                        key={track.id}
                        className="track-row"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.4em 1em',
                          borderRadius: '7px',
                          marginBottom: '0.2em'
                        }}
                      >
                        <span style={{color: '#fff', flex: 2, textAlign: 'left'}}>{track.name}</span>
                        <span style={{
                          color: '#b3b3b3',
                          flex: 1,
                          textAlign: 'right',
                          fontSize: '0.97em',
                          minWidth: 70,
                          marginRight: 16
                        }}>
                          {formatDuration(track.duration_ms)}
                        </span>
                        <button
                          className="fav-btn"
                          style={{marginLeft: 16}}
                          onClick={() => toggleSongFavorite(track, album)}
                          title={isSongFavorite(track.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
                        >
                          <HeartIcon filled={isSongFavorite(track.id)} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        ) : (
          <p style={{color: '#b3b3b3'}}>No se encontraron álbumes para este artista.</p>
        )}
      </div>
    </div>
  );
}

export default ArtistDetail;
