import {Link} from 'react-router-dom';

function AlbumCard({album}) {
    return (
      <div>
        <Link to={`/artist/album/${album.id}`}>
            <img src={album.images[0]?.url} alt={album.name} width="100" />
            <h3>{album.name}</h3>
            <p>Año: {album.release_date?.substring(0, 4)}</p>
        </Link>
      </div>
    );
  }
  
  export default AlbumCard;
  