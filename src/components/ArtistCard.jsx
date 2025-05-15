import { Link } from 'react-router-dom';
import "../App.css";

function ArtistCard({ artist }) {
  return (
    <div
      className="artist-card"
    >
      <Link to={`/artist/${artist.id}`}>
        <img
          src={artist.images[0]?.url}
          alt={artist.name}
          width="100"
          height="100"
          className="artist-card-img"
        />
        <h2 className="artist-card-title">{artist.name}</h2>
      </Link>
    </div>
  );
}

export default ArtistCard;
