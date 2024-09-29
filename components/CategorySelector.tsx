import { Category } from '@/lib/types'
import React from 'react'

interface CategorySelectorProps {
  categories: Category[]
  selectedCategory: string | null
  onSelectCategory: (category: string | null) => void
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="mb-4">
      <select
        value={selectedCategory || ''}
        onChange={(e) => onSelectCategory(e.target.value || null)}
        className="border rounded p-2"
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category.slug} value={category.slug}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default CategorySelector