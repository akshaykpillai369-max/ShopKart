import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import axios from "axios"

export default function ResetPassword() {
    const { uid, token: rawToken } = useParams()
    const token = decodeURIComponent(rawToken)

    const navigate = useNavigate()

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [loading, setLoading] = useState(false)

    const passwordsMatch =
        confirmPassword.length > 0 && password === confirmPassword

    const handleSubmit = async (e) => {
        e.preventDefault()

        setError("")
        setSuccess("")

        if (password !== confirmPassword) {
            setError("Passwords do not match.")
            return
        }

        setLoading(true)

        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/reset-password/`,
                {
                    uid,
                    token,
                    password,
                }
            )

            setSuccess("Your password has been reset successfully.")

            setTimeout(() => {
                navigate("/login")
            }, 2000)
        } catch (error) {
            console.log("Password reset failed:", error)

            if (error.response?.data?.error) {
                setError(error.response.data.error)
            } else {
                setError("Something went wrong. Please try again.")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-10">

            <div className="w-full max-w-5xl grid md:grid-cols-2 overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl">

                {/* LEFT SIDE */}
                <div className="hidden md:flex flex-col justify-between bg-linear-to-br from-blue-600 to-indigo-700 p-10 text-white">

                    <div>

                        {/* LOGO */}
                        <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center font-bold text-xl">
                                S
                            </div>

                            <span className="text-2xl font-bold tracking-tight">
                                ShopKart
                            </span>

                        </div>

                        {/* MESSAGE */}
                        <div className="mt-20">

                            <h2 className="text-4xl font-bold leading-tight">
                                Secure your
                                <br />
                                account.
                            </h2>

                            <p className="mt-5 text-blue-100 leading-relaxed max-w-sm">
                                Create a new password and get back to
                                shopping securely with ShopKart.
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
                                Reset your password
                            </h1>

                            <p className="mt-2 text-sm text-gray-400">
                                Choose a strong new password for your account.
                            </p>

                        </div>

                        {/* ERROR */}
                        {error && (
                            <div className="mb-5 rounded-lg border border-red-800 bg-red-900/20 px-4 py-3 text-sm text-red-400">
                                {error}
                            </div>
                        )}

                        {/* SUCCESS */}
                        {success && (
                            <div className="mb-5 rounded-lg border border-green-800 bg-green-900/20 px-4 py-3 text-sm text-green-400">

                                <div className="flex items-start gap-3">

                                    <div className="mt-0.5 w-5 h-5 rounded-full bg-green-500/15 flex items-center justify-center shrink-0">

                                        <svg
                                            className="w-3.5 h-3.5 text-green-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >

                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M5 13l4 4L19 7"
                                            />

                                        </svg>

                                    </div>

                                    <div>

                                        <p className="font-medium">
                                            {success}
                                        </p>

                                        <p className="mt-1 text-xs text-green-500">
                                            Redirecting you to login...
                                        </p>

                                    </div>

                                </div>

                            </div>
                        )}

                        {/* FORM */}
                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* NEW PASSWORD */}
                            <div>

                                <label
                                    htmlFor="password"
                                    className="block mb-2 text-sm font-medium text-gray-200"
                                >
                                    New password
                                </label>

                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                        setError("")
                                        setSuccess("")
                                    }}
                                    placeholder="Enter your new password"
                                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    required
                                />

                                <p className="mt-2 text-xs text-gray-500">
                                    Use a strong password that you don't use
                                    elsewhere.
                                </p>

                            </div>

                            {/* CONFIRM PASSWORD */}
                            <div>

                                <label
                                    htmlFor="confirmPassword"
                                    className="block mb-2 text-sm font-medium text-gray-200"
                                >
                                    Confirm password
                                </label>

                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value)
                                        setError("")
                                        setSuccess("")
                                    }}
                                    placeholder="Enter your password again"
                                    className={`w-full rounded-lg border bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:ring-2 ${
                                        confirmPassword.length > 0
                                            ? passwordsMatch
                                                ? "border-green-700 focus:border-green-500 focus:ring-green-500/20"
                                                : "border-red-700 focus:border-red-500 focus:ring-red-500/20"
                                            : "border-gray-700 focus:border-blue-500 focus:ring-blue-500/20"
                                    }`}
                                    required
                                />

                                {confirmPassword.length > 0 && (
                                    <p
                                        className={`mt-2 text-xs ${
                                            passwordsMatch
                                                ? "text-green-400"
                                                : "text-red-400"
                                        }`}
                                    >
                                        {passwordsMatch
                                            ? "Passwords match."
                                            : "Passwords do not match."}
                                    </p>
                                )}

                            </div>

                            {/* RESET BUTTON */}
                            <button
                                type="submit"
                                disabled={loading || !passwordsMatch}
                                className="w-full rounded-lg bg-blue-600 py-3 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-blue-600/30 active:translate-y-0 active:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                            >
                                {loading ? "Resetting..." : "Reset password"}
                            </button>

                        </form>

                        {/* BACK TO LOGIN */}
                        <div className="mt-7 text-center">

                            <Link
                                to="/login"
                                className="text-sm text-blue-400 hover:text-blue-300 hover:underline"
                            >
                                ← Back to login
                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}