import {useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";
import {getAlbumDetails} from "../services/spotifyApi";

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

function formatDuration(ms) {
  const min = Math.floor(ms / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function AlbumDetail() {
  const {albumId} = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    const fetchAlbum = async () => {
        try {
          const response = await getAlbumDetails(albumId);
          setAlbum(response.data);
        } catch (error) {
          setError('No se pudieron cargar los álbumes.');
        } finally {
          setLoading(false);
        }
    };
    fetchAlbum();
    setFavoritos(JSON.parse(localStorage.getItem('favoritos')) || []);
  }, [albumId]);

  const isFavorite = (trackId) =>
    favoritos.some(fav => fav.id === trackId);

  const toggleFavorite = (track) => {
    let nuevosFavoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    const exists = nuevosFavoritos.some(fav => fav.id === track.id);
    if (!exists) {
      const nuevoFavorito = {
        id: track.id,
        name: track.name,
        albumName: album.name,
        artistName: album.artists[0].name,
        albumId: album.id,
        albumImage: album.images[0]?.url || ''
      };
      nuevosFavoritos = [...nuevosFavoritos, nuevoFavorito];
    } else {
      nuevosFavoritos = nuevosFavoritos.filter(fav => fav.id !== track.id);
    }
    setFavoritos(nuevosFavoritos);
    localStorage.setItem('favoritos', JSON.stringify(nuevosFavoritos));
  };

  if (loading) return <div style={{color: '#1db954', textAlign: 'center', marginTop: '3em'}}>Cargando álbum...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{textAlign: 'center', maxWidth: 600, margin: '0 auto', padding: '2em 1em'}}>
        <style>
          {`
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
        <Link to={`/artist/${album.artists[0].id}`} className="link-btn" style={{marginBottom: '1em', display: 'inline-block'}}>Volver</Link>
        <h2>{album.name}</h2>
        <h3>Artista: {album.artists[0].name}</h3>
        <img src={album.images[0]?.url} alt={album.name} style={{ width: '220px', borderRadius: '12px', marginBottom: '1em' }} />
        <h4>Lista de Canciones:</h4>
        {/* Cabecera de la tabla */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          fontWeight: 700,
          color: '#b3b3b3',
          fontSize: '0.98em',
          padding: '0.2em 1em 0.2em 1em',
          borderBottom: '1px solid #232323',
          marginBottom: '0.2em'
        }}>
          <span style={{flex: 2, textAlign: 'left'}}>Nombre</span>
          <span style={{flex: 1, textAlign: 'right'}}>Duración</span>
        </div>
        <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
            {album.tracks.items.map((track) => (
                <li
                  key={track.id}
                  style={{
                    marginBottom: '0.7em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    transition: 'background 0.18s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#232323'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                    <span style={{flex: 2, textAlign: 'left', color: '#fff'}}>{track.name}</span>
                    <span style={{
                      color: '#b3b3b3',
                      flex: 1,
                      textAlign: 'right',
                      fontSize: '0.97em',
                      minWidth: 40,
                      marginRight: 50 // Alinea con el header
                    }}>
                      {formatDuration(track.duration_ms)}
                    </span>
                    <button
                      className="fav-btn"
                      onClick={() => toggleFavorite(track)}
                      title={isFavorite(track.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.2em 0.7em',
                        borderRadius: '50%',
                        transition: 'background 0.18s',
                        marginLeft: 16
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#232323'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <HeartIcon filled={isFavorite(track.id)} />
                    </button>
                </li>
            ))}
        </ul>
    </div>
  );
}

export default AlbumDetail;
