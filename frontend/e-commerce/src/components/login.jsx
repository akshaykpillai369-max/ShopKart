import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useLogin } from "../context/AuthContext"
import { GoogleLogin } from "@react-oauth/google"

export default function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const location = useLocation()
    const navigate = useNavigate()

    const { login, googleLogin } = useLogin()

    const [error, setError] = useState("")
    const [needsVerification, setNeedsVerification] = useState(false)
    const [resendMail, setResendMail] = useState(0)
    const [resendLoading, setResendLoading] = useState(false)

    useEffect(() => {
        if (resendMail <= 0) {
            return
        }

        const timer = setInterval(() => {
            setResendMail((previous) => previous - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [resendMail])

    const handleSubmit = (e) => {

        setLoading(true)

        e.preventDefault()

        setError("")
        setNeedsVerification(false)

        login(email, password)
            .then(() => {
                navigate("/")
            })
            .catch((error) => {
                console.log("Login failed", error)
            .finally(() => {
                setLoading(false)
            })

                if (
                    error.response?.status === 403 &&
                    error.response?.data?.error ===
                        "Please verify your email before logging in."
                ) {
                    setError(error.response.data.error)
                    setNeedsVerification(true)
                    return
                }

                if (error.response?.data?.detail) {
                    setError(error.response.data.detail)
                    return
                }

                if (error.response?.data?.error) {
                    setError(error.response.data.error)
                    return
                }

                setError("Invalid email or password.")
            })
    }

    const handleResendVerification = async () => {
        if (resendMail > 0 || resendLoading) {
            return
        }

        setResendLoading(true)
        setError("")

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/resend-verification/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email,
                    }),
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw {
                    response: {
                        status: response.status,
                        data: data,
                    },
                }
            }

            setError(data.message)
            setResendMail(60)

        } catch (error) {
            console.log("Resend verification failed", error)

            if (error.response?.status === 429) {
                setError(
                    "Please wait before requesting another verification email."
                )
            } else {
                setError(
                    error.response?.data?.error ||
                    "Unable to resend verification email."
                )
            }

        } finally {
            setResendLoading(false)
        }
    }

    const handleGoogleSuccess = (credentialResponse) => {
        setError("")

        googleLogin(credentialResponse.credential)
            .then(() => {
                navigate("/")
            })
            .catch((error) => {
                console.log("Google login failed", error)

                setError(
                    error.response?.data?.error ||
                    "Google login failed. Please try again."
                )
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
                                Welcome back,
                                <br />
                                we've missed you.
                            </h2>

                            <p className="mt-5 text-blue-100 leading-relaxed max-w-sm">
                                Sign in to your ShopKart account and continue
                                discovering products you'll love.
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
                        <div className="mb-3">

                            <h1 className="text-3xl font-bold text-white">
                                Welcome back
                            </h1>

                            <p className="mt-2 text-sm text-gray-400">
                                Sign in to your account to continue.
                            </p>

                            {error && (
                                <div className="mt-2 rounded-lg border border-red-800 bg-red-900/20 px-4 py-3 text-sm text-red-400">
                                    {error}

                                    {needsVerification && (
                                        <div className="mt-3">

                                            {resendMail > 0 ? (
                                                <p className="text-xs text-gray-400">
                                                    You can request another verification email in{" "}
                                                    <span className="font-semibold text-white">
                                                        {resendMail}s
                                                    </span>
                                                </p>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={handleResendVerification}
                                                    disabled={resendLoading}
                                                    className="text-sm font-medium text-blue-400 hover:text-blue-300 hover:underline disabled:opacity-50"
                                                >
                                                    {resendLoading
                                                        ? "Sending..."
                                                        : "Resend verification email"}
                                                </button>
                                            )}

                                        </div>
                                    )}
                                </div>
                            )}

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



                        {/* MESSAGE */}
                        {location.state?.message && (
                            <div className="mb-5 rounded-lg border border-green-800 bg-green-900/20 px-4 py-3 text-sm text-green-400">
                                {location.state.message}
                            </div>
                        )}



                        {/* LOGIN FORM */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

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
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                        setError("")
                                    }}
                                    placeholder="you@example.com"
                                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    required
                                />

                            </div>



                            {/* PASSWORD */}
                            <div>

                                <div className="flex items-center justify-between mb-2">

                                    <label
                                        htmlFor="password"
                                        className="text-sm font-medium text-gray-200"
                                    >
                                        Password
                                    </label>

                                    <Link
                                        to="/forgot-password"
                                        className="text-xs text-blue-400 hover:text-blue-300 hover:underline"
                                    >
                                        Forgot password?
                                    </Link>

                                </div>

                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                        setError('')
                                    }}
                                    placeholder="Enter your password"
                                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    required
                                />

                            </div>



                            {/* LOGIN BUTTON */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-lg bg-blue-600 py-3 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-blue-600/30 active:translate-y-0 active:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                            >
                                {loading ? "Signing you in..." : "Sign in"}
                            </button>

                        </form>



                        {/* SIGNUP */}
                        <p className="mt-7 text-center text-sm text-gray-400">

                            Don't have an account?{" "}

                            <Link
                                to="/signup"
                                className="font-medium text-blue-400 hover:text-blue-300 hover:underline"
                            >
                                Create an account
                            </Link>

                        </p>

                    </div>

                </div>

            </div>

        </div>
    )
}