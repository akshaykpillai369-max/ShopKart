import { useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import { GoogleLogin } from "@react-oauth/google"
import { useLogin } from "../context/AuthContext"

export default function SignUpForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const navigate = useNavigate()
    const { googleLogin } = useLogin()

    const passwordMismatch =
        password2.length > 0 && password !== password2

    const handleSubmit = async (e) => {
        e.preventDefault()

        setLoading(true)
        setError("")

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/signup/`,
                {
                    email,
                    password,
                    password2,
                }
            )

            navigate("/login", {
                state: {
                    message: response.data.message,
                },
            })

        } catch (error) {
            console.log("Signup failed:", error)

            const backendError = error.response?.data

            if (backendError) {
                if (typeof backendError === "string") {
                    setError(backendError)
                } else {
                    const messages = Object.values(backendError)
                        .flat()
                        .join(" ")

                    setError(
                        messages ||
                        "You may have missed some fields. Please fill them and try again."
                    )
                }
            } else {
                setError(
                    "You may have missed some fields. Please fill them and try again."
                )
            }
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSuccess = (credentialResponse) => {
        googleLogin(credentialResponse.credential)
            .then(() => {
                navigate("/")
            })
            .catch((error) => {
                console.log("Google signup failed", error)
            })
    }

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-10">

            <div className="w-full max-w-5xl grid md:grid-cols-2 overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl">

                {/* LEFT SIDE */}
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
                                Everything you need,
                                <br />
                                all in one place.
                            </h2>

                            <p className="mt-5 text-blue-100 leading-relaxed max-w-sm">
                                Create your ShopKart account and discover
                                products you'll love, manage your cart, and
                                enjoy a smoother shopping experience.
                            </p>

                        </div>

                    </div>

                    <p className="text-sm text-blue-200">
                        Shop smarter. Shop better.
                    </p>

                </div>

                {/* RIGHT SIDE */}
                <div className="p-6 sm:p-10 lg:p-12">

                    <div className="max-w-md mx-auto">

                        {/* MOBILE LOGO */}
                        <div className="flex md:hidden items-center justify-center gap-3 mb-8">

                            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                                S
                            </div>

                            <span className="text-2xl font-bold text-white">
                                ShopKart
                            </span>

                        </div>

                        {/* HEADING */}
                        <div className="mb-8">

                            <h1 className="text-3xl font-bold text-white">
                                Create your account
                            </h1>

                            <p className="mt-2 text-sm text-gray-400">
                                Join ShopKart and start shopping today.
                            </p>

                        </div>

                       {/* GOOGLE BUTTON */}
                        <div className="w-full flex justify-center">
                            <GoogleLogin
                                width="100%"
                                onSuccess={handleGoogleSuccess}
                                onError={() => {
                                    setError("Google login failed. Please try again.")
                                }}
                            />
                        </div>

                        {/* DIVIDER */}
                        <div className="flex items-center gap-4 my-7">

                            <div className="h-px flex-1 bg-gray-800"></div>

                            <span className="text-xs text-gray-500 uppercase">
                                or continue with email
                            </span>

                            <div className="h-px flex-1 bg-gray-800"></div>

                        </div>

                        {error && (
                            <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        {/* SIGNUP FORM */}
                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* EMAIL */}
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
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    placeholder="you@example.com"
                                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    required
                                />

                            </div>

                            {/* PASSWORD */}
                            <div>

                                <label
                                    htmlFor="password"
                                    className="block mb-2 text-sm font-medium text-gray-200"
                                >
                                    Password
                                </label>

                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    required
                                />

                            </div>

                            {/* CONFIRM PASSWORD */}
                            <div>

                                <label
                                    htmlFor="password2"
                                    className="block mb-2 text-sm font-medium text-gray-200"
                                >
                                    Confirm password
                                </label>

                                <input
                                    type="password"
                                    id="password2"
                                    name="password2"
                                    placeholder="Confirm your password"
                                    value={password2}
                                    onChange={(e) =>
                                        setPassword2(e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    required
                                />

                                {passwordMismatch && (
                                    <p className="mt-2 text-sm text-red-500">
                                        Passwords do not match.
                                    </p>
                                )}

                            </div>

                            {/* TERMS */}
                            <div className="flex items-start gap-3">

                                <input
                                    type="checkbox"
                                    id="terms"
                                    name="terms"
                                    className="mt-1 w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-blue-500"
                                    required
                                />

                                <label
                                    htmlFor="terms"
                                    className="text-sm text-gray-400 leading-relaxed"
                                >
                                    I agree to{" "}

                                    <a
                                        href="/terms-and-conditions"
                                        className="text-blue-400 hover:text-blue-300 hover:underline"
                                    >
                                        Terms and Conditions
                                    </a>{" "}

                                    and{" "}

                                    <a
                                        href="/privacy-policy"
                                        className="text-blue-400 hover:text-blue-300 hover:underline"
                                    >
                                        Privacy Policy
                                    </a>.
                                </label>

                            </div>

                            {/* CREATE ACCOUNT */}
                            <button
                                type="submit"
                                disabled={passwordMismatch || loading}
                                className="w-full rounded-lg bg-blue-600 py-3 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-blue-600/30 active:translate-y-0 disabled:bg-gray-600 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed disabled:translate-y-0"
                            >
                                {loading
                                    ? "Creating account..."
                                    : "Create account"}
                            </button>

                        </form>

                        {/* LOGIN */}
                        <p className="mt-7 text-center text-sm text-gray-400">

                            Already have an account?{" "}

                            <Link
                                to="/login"
                                className="font-medium text-blue-400 hover:text-blue-300 hover:underline"
                            >
                                Login
                            </Link>

                        </p>

                    </div>

                </div>

            </div>

        </div>
    )
}