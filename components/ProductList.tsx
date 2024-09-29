import React from 'react'
import { Product } from '@/lib/types'
import Image from 'next/image'

interface ProductListProps {
  products: Product[]
  lastProductRef: (node: HTMLDivElement | null) => void
}

const ProductList: React.FC<ProductListProps> = ({ products, lastProductRef }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product, i) => (
        <div key={product.id} ref={i === products.length - 1 ? lastProductRef : null} className="border rounded p-4">
          <div>
          <Image width={192} height={192} src={product.thumbnail} alt={product.title} className=" h-48 w-full object-contain mb-2" />
          </div>
          <h2 className="text-xl font-semibold">{product.title}</h2>
          <p className="text-gray-600">${product.price}</p>
          <p className="text-sm text-gray-500">{product.description}</p>
        </div>
      ))}
    </div>
  )
}

export default ProductList