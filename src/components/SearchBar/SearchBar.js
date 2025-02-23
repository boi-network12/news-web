import React from 'react'
import { BiSearch } from 'react-icons/bi'
import "./SearchBar.css"

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="searchWrapper">
        <BiSearch size={20} color='#333' />
        <input 
           type="text" 
           placeholder="Search by title, content, or category..."
           value={searchQuery}
           onChange={(e) => setSearchQuery(e.target.value)}
        />
    </div>
  )
}

export default SearchBar