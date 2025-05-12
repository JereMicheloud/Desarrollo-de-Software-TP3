import {Link} from 'react-router-dom';

function ArtistCard({artist}) {
  return (
    <div>
      <Link to={`/artist/${artist.id}`}>
        <img src={artist.images[0]?.url} alt={artist.name} width="100" />
        <h2>{artist.name}</h2>
      </Link>
    </div>
  );
}

export default ArtistCard;
