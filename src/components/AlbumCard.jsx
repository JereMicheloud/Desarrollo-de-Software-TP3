import { Link } from 'react-router-dom';
import "../App.css";

function AlbumCard({ album }) {
  const trackCount = album.total_tracks || (album.tracks && album.tracks.items ? album.tracks.items.length : null);

  return (
    <div
      className="album-card"
    >
      <Link to={`/artist/album/${album.id}`}>
        <img
          src={album.images[0]?.url}
          alt={album.name}
          width="100"
          height="100"
          className="album-card-img"
        />
        <h3 className="album-card-title">{album.name}</h3>
        <p className="album-card-info">
          {album.release_date?.substring(0, 4)}
          {trackCount !== null && (
            <span className="album-track-count">
              • {trackCount} canciones
            </span>
          )}
        </p>
      </Link>
    </div>
  );
}

export default AlbumCard;
