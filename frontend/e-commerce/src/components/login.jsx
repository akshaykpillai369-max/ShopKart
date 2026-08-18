 import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLogin } from "../context/AuthContext";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const location = useLocation();
  const { login, logout } = useLogin();
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    login(email, password)
        .then(() => {
            navigate('/')
        })
        .catch((error) => {
            console.log("Login failed", error)
        })
}

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-5xl grid md:grid-cols-2 overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl">

        {/* Left Side */}

        <div className="hidden md:flex flex-col justify-between bg-linear-to-br from-blue-600 to-indigo-700 p-10 text-white">

          <div>

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center font-bold text-xl">
                S
              </div>

              <span className="text-2xl font-bold tracking-tight">
                ShopKart
              </span>

            </div>

            <div className="mt-20">

              <h2 className="text-4xl font-bold leading-tight">
                Welcome back,
                <br />
                we've missed you.
              </h2>

              <p className="mt-5 text-blue-100 leading-relaxed max-w-sm">
                Sign in to your ShopKart account and continue discovering
                products you'll love.
              </p>

            </div>

          </div>

          <p className="text-sm text-blue-200">
            Shop smarter. Shop better.
          </p>

        </div>

        {/* Right Side */}

        <div className="p-6 sm:p-10 lg:p-12">

          <div className="max-w-md mx-auto">

            {/* Mobile Logo */}

            <div className="flex md:hidden items-center justify-center gap-3 mb-8">

              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                S
              </div>

              <span className="text-2xl font-bold text-white">
                ShopKart
              </span>

            </div>

            {/* Heading */}

            <div className="mb-8">

              <h1 className="text-3xl font-bold text-white">
                Welcome back
              </h1>

              <p className="mt-2 text-sm text-gray-400">
                Sign in to your account to continue.
              </p>

            </div>

            {/* Google Login */}

            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 rounded-lg border border-gray-700 bg-gray-800 py-3 px-4 text-sm font-medium text-white hover:bg-gray-750 transition"
            >
              {/* Google SVG */}
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M21.35 12.23c0-.79-.07-1.55-.22-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42Z"
                  fill="#4285F4"
                />
                <path
                  d="M12 21.5c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.75 9.75 0 0 0 12 21.5Z"
                  fill="#34A853"
                />
                <path
                  d="M6.54 13.59A5.85 5.85 0 0 1 6.23 12c0-.55.11-1.09.31-1.59V7.88H3.3A9.5 9.5 0 0 0 2.5 12c0 1.53.37 2.98.8 4.12l3.24-2.53Z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 6.38c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.47 14.63 2.5 12 2.5a9.75 9.75 0 0 0-8.7 5.38l3.24 2.53C7.31 8.1 9.46 6.38 12 6.38Z"
                  fill="#EA4335"
                />
              </svg>

              Continue with Google
            </button>

            {/* Divider */}

            <div className="flex items-center gap-4 my-7">

              <div className="h-px flex-1 bg-gray-800"></div>

              <span className="text-xs text-gray-500 uppercase">
                or continue with email
              </span>

              <div className="h-px flex-1 bg-gray-800"></div>

            </div>

            {/* Login Form */}

            {location.state?.message}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}

              <div>

                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-200"
                >
                  Email address
                </label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  required
                />

              </div>

              {/* Password */}

              <div>

                <div className="flex items-center justify-between mb-2">

                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-200"
                  >
                    Password
                  </label>

                  <a
                    href="#"
                    className="text-xs text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    Forgot password?
                  </a>

                </div>

                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  required
                />

              </div>

              {/* Remember Me */}

              <div className="flex items-center gap-3">

                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-blue-500"
                />

                <label
                  htmlFor="remember"
                  className="text-sm text-gray-400"
                >
                  Remember me
                </label>

              </div>

              {/* Login Button */}

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 py-3 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Sign in
              </button>

            </form>

            {/* Signup */}

            <p className="mt-7 text-center text-sm text-gray-400">

              Don't have an account?{" "}

              <a
                href="#"
                className="font-medium text-blue-400 hover:text-blue-300 hover:underline"
              >
                Create an account
              </a>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

