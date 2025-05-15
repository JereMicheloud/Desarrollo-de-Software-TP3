import { Link } from 'react-router-dom';

function AlbumCard({ album }) {
  // Muestra la cantidad de canciones si está disponible
  const trackCount = album.total_tracks || (album.tracks && album.tracks.items ? album.tracks.items.length : null);

  return (
    <div
      className="album-card"
      style={{
        background: '#232323',
        borderRadius: '14px',
        padding: '1.2em 0.5em',
        marginBottom: '0.5em',
        transition: 'box-shadow 0.2s, transform 0.18s',
        boxShadow: '0 2px 8px rgba(30,185,84,0.08)',
        cursor: 'pointer'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 8px 32px #1db95455';
        e.currentTarget.style.transform = 'scale(1.03)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(30,185,84,0.08)';
        e.currentTarget.style.transform = 'none';
      }}
    >
      <Link to={`/artist/album/${album.id}`}>
        <img
          src={album.images[0]?.url}
          alt={album.name}
          width="100"
          height="100"
          style={{
            objectFit: 'cover',
            borderRadius: '12px',
            marginBottom: '0.7em',
            boxShadow: '0 2px 8px #1db95433'
          }}
        />
        <h3 style={{ fontSize: '1em', color: '#fff', margin: 0 }}>{album.name}</h3>
        <p style={{ color: '#b3b3b3', fontSize: '0.97em', margin: '0.5em 0 0 0' }}>
          {album.release_date?.substring(0, 4)}
          {trackCount !== null && (
            <span style={{ marginLeft: 8, color: '#1db954', fontWeight: 600, fontSize: '0.98em' }}>
              • {trackCount} canciones
            </span>
          )}
        </p>
      </Link>
    </div>
  );
}

export default AlbumCard;
