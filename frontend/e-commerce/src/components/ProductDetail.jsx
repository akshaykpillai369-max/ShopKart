import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams, useNavigate} from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useLogin } from "../context/AuthContext"


export default function ProductDetail() {

  const { cart, addToCart } = useCart();
  const { access } = useLogin()
  const navigate = useNavigate()

  const [product, setProduct] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  const { slug } = useParams();

  const inCart = product
    ? cart.some(item => item.id === product.id)
    : false;

  useEffect(() => {

    axios
      .get(`http://localhost:8000/api/products/${slug}/`)
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(
          err.response?.status === 404
            ? "Product not found."
            : "Failed to load product."
        );
        setLoading(false);
      });

  }, [slug]);


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-50">
        <h2 className="text-xs font-medium text-gray-500 dark:text-gray-400 animate-pulse">
          Loading product...
        </h2>
      </div>
    );
  }


  if (error) {
    return (
      <div className="text-center p-8 text-red-500 dark:text-red-400">
        <h2>{error}</h2>
      </div>
    );
  }


  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">

      <div className="flex flex-col md:flex-row gap-8 items-start">

        {/* Product Image */}

        <section
          className="
            w-full md:w-1/2
            flex justify-center
            bg-white
            p-6 rounded-lg
            border border-gray-100 dark:border-gray-700
            transition-colors
          "
        >

          <img
            src={product.image}
            alt={product.name}
            className="max-h-112.5 object-contain rounded-md"
          />

        </section>


        {/* Product Information */}

        <section className="w-full md:w-1/2 flex flex-col gap-4">

          <h1
            className="
              text-2xl md:text-3xl
              font-semibold
              text-gray-900 dark:text-white
              leading-snug
            "
          >
            {product.name}
          </h1>


          {/* Rating */}

          <div
            className="
              inline-flex items-center gap-2
              bg-[#F5F5F5] dark:bg-gray-800
              px-3 py-1
              rounded-md
              w-max
            "
          >

            <span className="flex items-center gap-1 font-bold text-gray-900 dark:text-gray-100 text-sm">

              {product.display_rating}

              <span className="text-emerald-600 dark:text-emerald-400">
                ★
              </span>

            </span>

            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>

            <span className="text-gray-500 dark:text-gray-400 text-sm">

              {product.rating_count
                ? product.rating_count.toLocaleString()
                : 0}

            </span>

          </div>


          {/* Price */}

          <div className="flex items-baseline gap-3 my-2">

            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              ₹{product.discounted_price}
            </span>

            {product.price && (
              <span className="text-lg text-gray-400 dark:text-gray-500 line-through">
                ₹{product.price}
              </span>
            )}

          </div>


          {/* Description */}

          <div
            className="
              border-t border-b
              border-gray-200 dark:border-gray-700
              py-4 my-2
            "
          >

            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              About this Item
            </h3>

            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {product.description}
            </p>

          </div>


          {/* Buttons */}

          <div className="flex flex-col sm:flex-row gap-4 mt-2">

            {inCart ? (

              <Link
                to="/cart"
                className="
                  flex-1
                  bg-green-500
                  hover:bg-green-600
                  text-white
                  font-medium
                  py-3 px-6
                  rounded-lg
                  transition-colors
                  shadow-sm
                  text-center
                "
              >
                Go to Cart
              </Link>

            ) : (

              <button
                onClick={() => {

                if (!access) {
                    navigate("/login")
                    return
                }

                addToCart(product)
                }}
                  className="
                  flex-1
                  bg-yellow-400
                  hover:bg-yellow-500
                  text-black
                  font-medium
                  py-3 px-6
                  rounded-lg
                  transition-colors
                  shadow-sm
                "
              >
                Add to Cart
              </button>

            )}


            <button
              className="
                flex-1
                bg-orange-500
                hover:bg-orange-600
                text-white
                font-medium
                py-3 px-6
                rounded-lg
                transition-colors
                shadow-sm
              "
            >
              Buy Now
            </button>

          </div>

        </section>

      </div>

    </div>
  );
}