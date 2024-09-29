import React, { useState } from 'react'

interface SearchBarProps {
  onSearch: (query: string) => void
  initialValue?: string
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialValue = '' }) => {
  const [query, setQuery] = useState(initialValue)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="border rounded p-2 mr-2"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 transition-colors rounded hover:bg-blue-500/90">
        Search
      </button>
    </form>
  )
}

export default SearchBar