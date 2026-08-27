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
                    `http://localhost:8000/api/auth/verify-email/${uid}/${token}/`
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
                <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 sm:p-10 shadow-2xl text-center">

                    {status === "verifying" && (

                        <>
                            <div className="w-12 h-12 mx-auto mb-5 rounded-full border-4 border-gray-700 border-t-blue-500 animate-spin" />

                            <h1 className="text-2xl font-bold text-white">
                                Verifying your email
                            </h1>

                            <p className="mt-3 text-sm text-gray-400">
                                Please wait while we verify your email address.
                            </p>
                        </>

                    )}

                    {status === "success" && (

                        <>
                            <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-green-900/30 flex items-center justify-center text-2xl">
                                ✓
                            </div>

                            <h1 className="text-2xl font-bold text-white">
                                Email verified!
                            </h1>

                            <p className="mt-3 text-sm text-gray-400">
                                {message}
                            </p>

                            <Link
                                to="/login"
                                className="
                                    block
                                    w-full
                                    mt-7
                                    rounded-lg
                                    bg-blue-600
                                    py-3
                                    px-4
                                    text-sm
                                    font-semibold
                                    text-white
                                    hover:bg-blue-700
                                    transition
                                "
                            >
                                Continue to login
                            </Link>
                        </>

                    )}

                    {status === "error" && (

                        <>
                            <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-red-900/30 flex items-center justify-center text-2xl">
                                !
                            </div>

                            <h1 className="text-2xl font-bold text-white">
                                Verification failed
                            </h1>

                            <p className="mt-3 text-sm text-red-400">
                                {message}
                            </p>

                            <Link
                                to="/login"
                                className="
                                    block
                                    w-full
                                    mt-7
                                    rounded-lg
                                    bg-blue-600
                                    py-3
                                    px-4
                                    text-sm
                                    font-semibold
                                    text-white
                                    hover:bg-blue-700
                                    transition
                                "
                            >
                                Back to login
                            </Link>
                        </>

                    )}

                </div>

            </div>

        </div>
    )
}