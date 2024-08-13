
import React from 'react';

const SearchDropdown = ({ searchResults, onSelect }) => {
  return (
    <div className="search-dropdown">
      {searchResults.length > 0 ? (
        <ul className="search-results">
          {searchResults.map((item) => (
            <li key={item.id} onClick={() => onSelect(item)}>
              <img src={item.product.ImageURL} alt={item.product.Name} />
              <div>
                <strong>{item.product.Name}</strong>
                <p>${item.product.Price}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="no-results">No results found</div>
      )}
    </div>
  );
};

export default SearchDropdown;
