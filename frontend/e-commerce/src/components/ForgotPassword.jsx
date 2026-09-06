import { useEffect, useState } from "react"

import { Link } from "react-router-dom"

import axios from "axios"

export default function ForgotPassword() {

    const [email, setEmail] = useState("")

    const [message, setMessage] = useState("")

    const [error, setError] = useState("")

    const [loading, setLoading] = useState(false)

    const [sent, setSent] = useState(false)

    const [countdown, setCountdown] = useState(0)

    useEffect(() => {

        if (countdown <= 0) {

            return
        }

        const timer = setInterval(() => {

            setCountdown((previous) => previous - 1)

        }, 1000)

        return () => clearInterval(timer)

    }, [countdown])

    const sendResetLink = async () => {

        setMessage("")

        setError("")

        setLoading(true)

        try {

            const response = await axios.post(

                `${import.meta.env.VITE_API_URL}/api/auth/forgot-password/`,

                {

                    email

                }

            )

            setMessage(response.data.message)

            setSent(true)

            setCountdown(60)

        } catch (error) {

            console.log("Forgot password failed:", error)

            if (error.response?.data?.error) {

                setError(error.response.data.error)

            } else {

                setError("Something went wrong. Please try again.")

            }

        } finally {

            setLoading(false)

        }

    }

    const handleSubmit = async (e) => {

        e.preventDefault()

        if (loading || countdown > 0) {

            return
        }

        await sendResetLink()

    }

    return (

        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-10">

            <div className="w-full max-w-md">

                {/* Logo */}

                <div className="flex items-center justify-center gap-3 mb-8">

                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl">

                        S

                    </div>

                    <span className="text-2xl font-bold text-white">

                        ShopKart

                    </span>

                </div>



                {/* Card */}

                <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 sm:p-10 shadow-2xl">

                    <div className="mb-8">

                        <h1 className="text-3xl font-bold text-white">

                            Forgot password?

                        </h1>

                        <p className="mt-2 text-sm text-gray-400">

                            Enter your email and we'll send you a password

                            reset link.

                        </p>

                    </div>



                    {/* Success message */}

                    {message && (

                        <div className="mb-5 rounded-lg border border-green-800 bg-green-900/20 px-4 py-3 text-sm text-green-400">

                            {message}

                            <p className="mt-2 text-green-500">

                                Check your email for the reset link.

                            </p>

                        </div>

                    )}



                    {/* Error message */}

                    {error && (

                        <div className="mb-5 rounded-lg border border-red-800 bg-red-900/20 px-4 py-3 text-sm text-red-400">

                            {error}

                        </div>

                    )}



                    <form

                        onSubmit={handleSubmit}

                        className="space-y-5"

                    >

                        {/* Email */}

                        <div>

                            <label

                                htmlFor="email"

                                className="block mb-2 text-sm font-medium text-gray-200"

                            >

                                Email address

                            </label>

                            <input

                                id="email"

                                type="email"

                                value={email}

                                onChange={(e) => {

                                    setEmail(e.target.value)

                                    setError("")

                                    setMessage("")

                                }}

                                placeholder="you@example.com"

                                disabled={countdown > 0}

                                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"

                                required

                            />

                        </div>



                        {/* Send / Resend button */}

                        <button

                            type="submit"

                            disabled={loading || countdown > 0}

                            className="w-full rounded-lg bg-blue-600 py-3 px-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"

                        >

                            {loading

                                ? "Sending..."

                                : countdown > 0

                                    ? `Resend in ${countdown}s`

                                    : sent

                                        ? "Resend reset link"

                                        : "Send reset link"

                            }

                        </button>

                    </form>



                    {/* Resend information */}

                    {sent && (

                        <div className="mt-5 text-center">

                            {countdown > 0 ? (

                                <p className="text-xs text-gray-500">

                                    You can request another reset link when

                                    the timer reaches zero.

                                </p>

                            ) : (

                                <p className="text-xs text-gray-400">

                                    Didn't receive the email? You can request

                                    another link now.

                                </p>

                            )}

                        </div>

                    )}



                    {/* Back to login */}

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

    )

}