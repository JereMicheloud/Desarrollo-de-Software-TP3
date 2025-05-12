function AlbumCard({album}) {
    return (
      <div>
        <img src={album.images[0]?.url} alt={album.name} width="100" />
        <h3>{album.name}</h3>
        <p>Año: {album.release_date?.substring(0, 4)}</p>
      </div>
    );
  }
  
  export default AlbumCard;
  