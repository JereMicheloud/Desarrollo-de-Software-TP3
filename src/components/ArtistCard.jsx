import { Link } from 'react-router-dom';

function ArtistCard({ artist }) {
  return (
    <div
      className="artist-card"
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
      <Link to={`/artist/${artist.id}`}>
        <img
          src={artist.images[0]?.url}
          alt={artist.name}
          width="100"
          height="100"
          style={{
            objectFit: 'cover',
            borderRadius: '12px',
            marginBottom: '0.7em',
            boxShadow: '0 2px 8px #1db95433'
          }}
        />
        <h2 style={{ fontSize: '1.1em', color: '#fff', margin: 0 }}>{artist.name}</h2>
      </Link>
    </div>
  );
}

export default ArtistCard;
