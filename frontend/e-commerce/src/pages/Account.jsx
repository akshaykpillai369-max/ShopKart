import axios from "axios";
import { useEffect, useState } from "react";
import { useLogin } from "../context/AuthContext";

export default function Account() {

    const [email, setEmail] = useState("")
      const { access } = useLogin();

    const setmail = () => {

        console.log(access)

        axios.get('http://127.0.0.1:8000/api/profile/', {

            headers: {

                Authorization: "Bearer " + access 
            }
        })
        .then((response) => {

            setEmail(response.data.email)
        })
             




        
    }

    useEffect(() => {

        setmail()
    }, [access])

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">

            <div className="max-w-2xl mx-auto">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        My Account
                    </h1>

                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Manage your personal information and delivery details.
                    </p>
                </div>


                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                        Profile Information
                    </h2>


                    <div className="space-y-5">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Name
                            </label>

                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>


                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email
                            </label>

                            <input
                                value={email}
                                type="email"
                                readOnly
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                            />
                        </div>


                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Mobile Number
                            </label>

                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>


                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Address
                            </label>

                            <textarea
                                rows="4"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                        </div>


                        <div className="pt-2">
                            <button
                                type="button"
                                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                            >
                                Save Changes
                            </button>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}