function SearchBar({onSearch}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const value = e.target.elements.search.value;
    onSearch(value);
    console.log(value);
  };

  return (
    <form onSubmit={handleSubmit} style={{display: 'flex', gap: '1em', justifyContent: 'center', margin: '1em 0'}}>
      <input type="text" name="search" placeholder="Buscar artista..." />
      <button type="submit">Buscar</button>
    </form>
  );
}

export default SearchBar;