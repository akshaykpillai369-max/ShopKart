import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
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

    const handleSubmit = async (e) => {
        e.preventDefault()

        setError("")
        setSuccess("")

        if (password !== confirmPassword) {
            setError("Passwords do not match.")
            return
        }

        setLoading(true)

        console.log("SENDING:", {
    uid,
    token,
    password
})

        try {
            await axios.post(
                "http://localhost:8000/api/auth/reset-password/",
                {
                    uid,
                    token,
                    password
                }
            )

            setSuccess("Password reset successfully.")

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
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">

            <div className="w-full max-w-md">

                <div className="mb-8 text-center">

                    <div className="mx-auto w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                        S
                    </div>

                    <h1 className="mt-5 text-3xl font-bold text-white">
                        Reset your password
                    </h1>

                    <p className="mt-2 text-sm text-gray-400">
                        Enter your new password below.
                    </p>

                </div>

                <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 sm:p-8">

                    {error && (
                        <div className="mb-5 rounded-lg border border-red-800 bg-red-900/20 px-4 py-3 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-5 rounded-lg border border-green-800 bg-green-900/20 px-4 py-3 text-sm text-green-400">
                            {success}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

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
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your new password"
                                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                required
                            />

                        </div>

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
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Enter your password again"
                                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                required
                            />

                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-blue-600 py-3 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Resetting..." : "Reset password"}
                        </button>

                    </form>

                </div>

            </div>

        </div>
    )
}