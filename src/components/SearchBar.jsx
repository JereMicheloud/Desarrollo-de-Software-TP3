function SearchBar({onSearch}) {
    const handleSubmit = (e) => {
      e.preventDefault();
      const value = e.target.elements.search.value;
      onSearch(value);
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <input type="text" name="search" placeholder="Buscar artista..." />
        <button type="submit">Buscar</button>
      </form>
    );
  }
  
  export default SearchBar;
  