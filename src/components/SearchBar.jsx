function SearchBar({onSearch}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const value = e.target.elements.search.value;
    onSearch(value);
    console.log(value);
  };

  return (
    <form onSubmit={handleSubmit} className="home-search-form">
      <input type="text" name="search" placeholder="Buscar artista..." />
      <button type="submit">Buscar</button>
    </form>
  );
}

export default SearchBar;