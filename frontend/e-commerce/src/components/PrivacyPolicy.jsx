import { Link } from "react-router-dom"

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-10 md:py-14">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="mb-10">
                    <Link
                        to="/signup"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
                    >
                        ← Back to SignUp
                    </Link>

                    <div className="mt-8">
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            ShopKart
                        </p>

                        <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Privacy Policy
                        </h1>

                        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                            Last updated: August 2026
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8 md:p-10 shadow-sm">

                    <div className="space-y-9 text-sm leading-7 text-gray-600 dark:text-gray-400">

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                1. Introduction
                            </h2>

                            <p className="mt-3">
                                ShopKart is a demonstration e-commerce application
                                created as a portfolio project. This Privacy Policy
                                explains what information may be collected when you
                                use the application and how that information is used.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                2. Information We Collect
                            </h2>

                            <p className="mt-3">
                                Depending on how you use ShopKart, the application may
                                collect information such as your name, email address,
                                mobile number, delivery address, account information,
                                and order information.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                3. How We Use Your Information
                            </h2>

                            <p className="mt-3">
                                Information may be used to create and manage your
                                account, process orders, provide delivery information,
                                maintain application functionality, and improve the
                                ShopKart demonstration.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                4. Account Information
                            </h2>

                            <p className="mt-3">
                                If you create an account, information associated with
                                that account may be stored by the application's
                                backend. You are responsible for keeping your login
                                credentials secure.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                5. Cookies and Authentication
                            </h2>

                            <p className="mt-3">
                                ShopKart may use browser storage, authentication tokens,
                                or similar technologies to maintain your login session
                                and provide authenticated features.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                6. Third-Party Services
                            </h2>

                            <p className="mt-3">
                                Certain features may use third-party services such as
                                Google authentication or payment providers. Information
                                shared with those services is subject to their own
                                privacy policies and terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                7. Data Security
                            </h2>

                            <p className="mt-3">
                                Reasonable measures may be used to protect information
                                handled by the application. However, no online system
                                can guarantee complete security.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                8. Data Retention
                            </h2>

                            <p className="mt-3">
                                Information may be retained for as long as necessary
                                for the application's functionality, testing,
                                demonstration, or development purposes.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                9. Portfolio Project Notice
                            </h2>

                            <p className="mt-3">
                                ShopKart is primarily intended to demonstrate full-stack
                                development skills. It should not be considered a
                                production e-commerce service unless explicitly stated.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                10. Contact
                            </h2>

                            <p className="mt-3">
                                If you have questions regarding this Privacy Policy,
                                please use the contact information provided by the
                                ShopKart project owner.
                            </p>
                        </section>

                    </div>
                </div>

                {/* Bottom navigation */}
                <div className="mt-6 flex flex-wrap gap-4 text-sm">
                    <Link
                        to="/terms-and-conditions"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        Terms & Conditions →
                    </Link>

                    <Link
                        to="/signup"
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                        Back to SignUp
                    </Link>
                </div>

            </div>
        </div>
    )
}