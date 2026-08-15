import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products/")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data)
        setLoading(false)
      })
      .catch((err) => console.error("Error fetching products:", err))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-50">
        <h2 className="text-xs font-medium text-gray-500 animate-pulse">
          Loading products...
        </h2>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {products.map((product) => (


          <div
            key={product.id}
            className="w-full max-w-42.5 flex flex-col gap-1 font-sans cursor-pointer group mx-auto"
          >
            <Link to={`/product/${product.slug}`}>
            
            
      
            <div className="relative w-full h-60 bg-[#FFFFFF] rounded-xl p-2 flex items-center justify-center overflow-hidden">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-28 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                />
              )}

              

               
              <div 
              className="absolute bottom-1.5 left-1.5 bg-white px-1.5 py-0.5 rounded text-[11px] font-semibold
                           text-gray-800 shadow-sm flex items-center gap-0.5">
                <span>{product.display_rating}</span>
                <span className="text-emerald-700 text-[9px]">★</span>
              </div>
            </div>

            

            
            <div className="flex flex-col px-0.5 mt-1">
              <h3
                className="text-xs font-normal text-gray-800 truncate"
                title={product.name}
              >
                {product.name}
              </h3>

              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-sm font-bold text-gray-900">
                  ₹{product.discounted_price}
                </span>

                {product.price > product.discounted_price && (
                  <span className="text-[11px] text-gray-400 line-through">
                    ₹{product.price}
                  </span>
                )}
                
              </div>
            </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}