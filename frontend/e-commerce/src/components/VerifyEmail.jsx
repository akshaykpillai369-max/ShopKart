import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import axios from "axios"

export default function VerifyEmail() {
    const { uid, token } = useParams()

    const [status, setStatus] = useState("verifying")
    const [message, setMessage] = useState("")

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/auth/verify-email/${uid}/${token}/`
                )

                setMessage(response.data.message)
                setStatus("success")
            } catch (error) {
                console.log("Email verification failed:", error)

                setMessage(
                    error.response?.data?.error ||
                    "Invalid or expired verification link."
                )

                setStatus("error")
            }
        }

        verifyEmail()
    }, [uid, token])

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-10 relative overflow-hidden">

            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 blur-3xl rounded-full pointer-events-none" />

            <div className="relative w-full max-w-md">

                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-8">

                    <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-600/20">
                        S
                    </div>

                    <span className="text-2xl font-bold tracking-tight text-white">
                        ShopKart
                    </span>

                </div>

                {/* Card */}
                <div className="rounded-3xl border border-gray-800 bg-gray-900/95 backdrop-blur-sm p-7 sm:p-10 shadow-2xl">

                    {/* VERIFYING */}
                    {status === "verifying" && (
                        <div className="text-center">

                            <div className="relative w-20 h-20 mx-auto mb-7">

                                <div className="absolute inset-0 rounded-full border border-blue-500/20" />

                                <div className="absolute inset-2 rounded-full border-4 border-gray-800 border-t-blue-500 animate-spin" />

                                <div className="absolute inset-0 flex items-center justify-center">

                                    <svg
                                        className="w-7 h-7 text-blue-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1.7"
                                            d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>

                                </div>

                            </div>

                            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">
                                One moment
                            </p>

                            <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-white">
                                Verifying your email
                            </h1>

                            <p className="mt-3 text-sm leading-relaxed text-gray-400 max-w-sm mx-auto">
                                We're confirming your email address.
                                This should only take a moment.
                            </p>

                        </div>
                    )}

                    {/* SUCCESS */}
                    {status === "success" && (
                        <div className="text-center">

                            {/* Success icon */}
                            <div className="relative w-20 h-20 mx-auto mb-7">

                                <div className="absolute inset-0 rounded-full bg-green-500/10 animate-pulse" />

                                <div className="relative w-20 h-20 rounded-full border border-green-500/30 bg-green-500/10 flex items-center justify-center">

                                    <svg
                                        className="w-9 h-9 text-green-400"
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

                            </div>

                            <p className="text-xs font-semibold uppercase tracking-widest text-green-400">
                                All set
                            </p>

                            <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-white">
                                Email verified
                            </h1>

                            <p className="mt-3 text-sm leading-relaxed text-gray-400 max-w-sm mx-auto">
                                {message}
                            </p>

                            <div className="mt-7 p-4 rounded-xl border border-green-900/50 bg-green-900/10 text-left">

                                <div className="flex gap-3">

                                    <svg
                                        className="w-5 h-5 mt-0.5 shrink-0 text-green-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1.7"
                                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 12c0 5.591 3.824 10.291 9 11.622C17.176 22.291 21 17.591 21 12c0-1.22-.18-2.398-.514-3.516"
                                        />
                                    </svg>

                                    <div>

                                        <p className="text-sm font-medium text-green-300">
                                            Your account is ready
                                        </p>

                                        <p className="mt-1 text-xs leading-relaxed text-green-400/70">
                                            You can now sign in and start shopping.
                                        </p>

                                    </div>

                                </div>

                            </div>

                            <Link
                                to="/login"
                                className="flex items-center justify-center gap-2 w-full mt-7 rounded-xl bg-blue-600 py-3.5 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-blue-600/30 active:translate-y-0"
                            >
                                Continue to login

                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.8"
                                        d="M5 12h14m-6-6l6 6-6 6"
                                    />
                                </svg>

                            </Link>

                        </div>
                    )}

                    {/* ERROR */}
                    {status === "error" && (
                        <div className="text-center">

                            {/* Error icon */}
                            <div className="w-20 h-20 mx-auto mb-7 rounded-full border border-red-500/30 bg-red-500/10 flex items-center justify-center">

                                <svg
                                    className="w-9 h-9 text-red-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.8"
                                        d="M12 8v4m0 4h.01M10.29 3.86l-8.82 15a2 2 0 001.72 3h17.62a2 2 0 001.72-3l-8.82-15a2 2 0 00-3.44 0z"
                                    />
                                </svg>

                            </div>

                            <p className="text-xs font-semibold uppercase tracking-widest text-red-400">
                                Something went wrong
                            </p>

                            <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-white">
                                Verification failed
                            </h1>

                            <div className="mt-4 rounded-xl border border-red-900/50 bg-red-900/10 px-4 py-4">

                                <p className="text-sm leading-relaxed text-red-400">
                                    {message}
                                </p>

                            </div>

                            <p className="mt-4 text-xs leading-relaxed text-gray-500">
                                The verification link may have expired or
                                already been used.
                            </p>

                            <Link
                                to="/login"
                                className="flex items-center justify-center gap-2 w-full mt-7 rounded-xl bg-gray-800 border border-gray-700 py-3.5 px-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-gray-700 hover:border-gray-600"
                            >
                                Back to login

                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.8"
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>

                            </Link>

                        </div>
                    )}

                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-gray-600">
                    Shop smarter. Shop better.
                </p>

            </div>
        </div>
    )
}