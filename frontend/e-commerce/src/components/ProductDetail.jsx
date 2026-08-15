import { useEffect, useState } from "react";
import axios from 'axios'
import { useParams } from "react-router-dom";

export default function ProductDetail(){


    const [product, setProduct] = useState()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState()

    const {slug} = useParams()


    useEffect(() => {

        axios.get(`http://127.0.0.1:8000/api/products/${slug}/`)
        .then((response) =>{

            setProduct(response.data)
            setLoading(false)
        })

        .catch((err) => {
        setError(err.response?.status === 404 ? "Product not found." : "Failed to load product.");
        setLoading(false);
        });

    }, [slug])


    if (loading) {
    return (
      <div className="flex justify-center items-center min-h-50">
        <h2 className="text-xs font-medium text-gray-500 animate-pulse">
          Loading product...
        </h2>
      </div>
    )
    }

    if (error) {
    return (
        <div className="text-center p-8 text-red-500">
        <h2>{error}</h2>
        </div>
    );
    }

   return (
  <div className="max-w-6xl mx-auto p-4 md:p-8">
     
    <div className="flex flex-col md:flex-row gap-8 items-start">
      
      <section className="w-full md:w-1/2 flex justify-center bg-gray-50 p-6 rounded-lg border border-gray-100">
        <img 
          src={product.image} 
          alt={product.name} 
          className="max-h-112.5 object-contain rounded-md" 
        />
      </section>

       
      <section className="w-full md:w-1/2 flex flex-col gap-4">
        
        
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-snug">
          {product.name}
        </h1>

        <div className="inline-flex items-center gap-2 bg-[#F5F5F5] px-3 py-1 rounded-md w-max">
        <span className="flex items-center gap-1 font-bold text-gray-900 text-sm">
            {product.display_rating} <span className="text-emerald-600">★</span>
        </span>
        <div className="h-4 w-px bg-gray-300"></div>
        <span className="text-gray-500 text-sm">
            {product.rating_count ? product.rating_count.toLocaleString() : 0}
        </span>
        </div>
        
        <div className="flex items-baseline gap-3 my-2">
          <span className="text-3xl font-bold text-gray-900">
            ₹{product.discounted_price}
          </span>
          {product.price && (
            <span className="text-lg text-gray-400 line-through">
              ₹{product.price}
            </span>
          )}
        </div>

        <div className="border-t border-b border-gray-200 py-4 my-2">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">About this Item</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <button 
          className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 px-6 rounded-lg transition-colors shadow-sm">
            Add to Cart
          </button>
          <button 
          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-sm">
            Buy Now
          </button>
        </div>

      </section>
    </div>
  </div>
);

}