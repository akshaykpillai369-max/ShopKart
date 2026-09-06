import axios from "axios"
import { useEffect, useState } from "react"
import { useLogin } from "../context/AuthContext"

export default function Account() {
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [mobileNumber, setMobileNumber] = useState("")
    const [address, setAddress] = useState("")
    const [isSaved, setIsSaved] = useState()

    const { access } = useLogin()

    const fetchProfile = () => {
        axios
            .get("http://127.0.0.1:8000/api/profile/", {
                headers: {
                    Authorization: "Bearer " + access,
                },
            })
            .then((response) => {
                setEmail(response.data.email)
                setName(response.data.name)
                setMobileNumber(response.data.mobile_number)
                setAddress(response.data.address)
            })
            .catch((error) => {
                console.log("Profile fetch failed:", error)
            })
    }

    useEffect(() => {
        if (!access) {
            return
        }

        fetchProfile()
    }, [access])

    const handleSubmit = () => {
        const data = {
            name: name,
            mobile_number: mobileNumber,
            address: address,
        }

        setIsSaved()

        axios
            .put("http://127.0.0.1:8000/api/profile/", data, {
                headers: {
                    Authorization: "Bearer " + access,
                },
            })
            .then(() => {
                setIsSaved(true)
            })
            .catch(() => {
                setIsSaved(false)
            })
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-7 sm:py-8 md:py-12">
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <div className="mb-7 sm:mb-8">
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
                        Account
                    </p>

                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                        My Account
                    </h1>

                    <p className="mt-2 text-sm leading-5 text-gray-500 dark:text-gray-400">
                        Manage your personal information and delivery details.
                    </p>
                </div>

                {/* Profile Card */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-5 sm:p-6 md:p-7">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Profile Information
                        </h2>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Keep your details up to date for a smoother checkout.
                        </p>
                    </div>

                    <div className="space-y-5">

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Name
                            </label>

                            <input
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                type="text"
                                placeholder="Enter your name"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email
                            </label>

                            <input
                                value={email}
                                type="email"
                                readOnly
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                            />

                            <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                                Email address cannot be changed here.
                            </p>
                        </div>

                        {/* Mobile Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Mobile Number
                            </label>

                            <div className="flex">
                                <input
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, "").slice(0, 10)
                                        setMobileNumber(value)
                                    }}
                                    value={mobileNumber}
                                    type="tel"
                                    inputMode="numeric"
                                    maxLength="10"
                                    placeholder="Enter 10 digit number"
                                    className="w-full px-4 py-3 rounded-r-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Delivery Address
                            </label>

                            <textarea
                                onChange={(e) => setAddress(e.target.value)}
                                value={address}
                                rows="4"
                                placeholder="Enter your complete delivery address"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition"
                            />
                        </div>

                        {/* Status */}
                        {isSaved === true && (
                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm font-medium">
                                <span className="w-5 h-5 shrink-0 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-xs">
                                    ✓
                                </span>

                                Profile updated successfully.
                            </div>
                        )}

                        {isSaved === false && (
                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm font-medium">
                                <span className="w-5 h-5 shrink-0 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-xs">
                                    !
                                </span>

                                You may have missed some fields. Please fill them in and try again.
                            </div>
                        )}

                        {/* Save Button */}
                        <div className="pt-1">
                            <button
                                onClick={handleSubmit}
                                type="button"
                                className="w-full sm:w-auto min-w-32 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm transition-colors shadow-sm"
                            >
                                Save Changes
                            </button>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}