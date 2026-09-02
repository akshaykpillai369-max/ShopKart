import { Link } from "react-router-dom"

export default function TermsAndConditions() {
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
                            Terms & Conditions
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
                                1. Acceptance of Terms
                            </h2>

                            <p className="mt-3">
                                By accessing or using ShopKart, you agree to these
                                Terms & Conditions. If you do not agree with these
                                terms, please do not use the application.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                2. About ShopKart
                            </h2>

                            <p className="mt-3">
                                ShopKart is a demonstration e-commerce application
                                developed as a portfolio project. Products, orders,
                                payments, and other functionality may be simulated
                                or provided for demonstration purposes.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                3. User Accounts
                            </h2>

                            <p className="mt-3">
                                Users may be required to create an account to access
                                certain features. You are responsible for providing
                                accurate information and maintaining the security of
                                your account credentials.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                4. Orders
                            </h2>

                            <p className="mt-3">
                                Orders placed through ShopKart are subject to the
                                functionality and limitations of the demonstration
                                application. Order status, availability, pricing,
                                and delivery information may be provided for
                                demonstration purposes.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                5. Product Information
                            </h2>

                            <p className="mt-3">
                                Product names, descriptions, images, prices, ratings,
                                and availability displayed by ShopKart may be
                                illustrative. No guarantee is made that displayed
                                information represents a real commercial product.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                6. Payments
                            </h2>

                            <p className="mt-3">
                                Payment functionality, when available, may be
                                integrated using third-party payment services.
                                Payment processing is subject to the terms and
                                policies of the respective payment provider.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                7. Prohibited Use
                            </h2>

                            <p className="mt-3">
                                Users must not attempt to misuse the application,
                                gain unauthorized access, interfere with its
                                operation, or use the application for unlawful
                                purposes.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                8. Intellectual Property
                            </h2>

                            <p className="mt-3">
                                The ShopKart application, its original interface,
                                code, branding, and design elements are part of the
                                portfolio project unless otherwise stated. Third-party
                                assets remain the property of their respective owners.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                9. Disclaimer
                            </h2>

                            <p className="mt-3">
                                ShopKart is provided as a portfolio demonstration.
                                The application is provided without guarantees
                                regarding availability, accuracy, security, or
                                uninterrupted operation.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                10. Changes to These Terms
                            </h2>

                            <p className="mt-3">
                                These Terms & Conditions may be updated as the
                                ShopKart project develops. Updated terms will be
                                reflected on this page.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                11. Contact
                            </h2>

                            <p className="mt-3">
                                For questions about these terms or the ShopKart
                                project, please use the contact information provided
                                by the project owner.
                            </p>
                        </section>

                    </div>
                </div>

                {/* Bottom navigation */}
                <div className="mt-6 flex flex-wrap gap-4 text-sm">
                    <Link
                        to="/privacy-policy"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        ← Privacy Policy
                    </Link>

                    <Link
                        to="/signup"
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                        Back to Signup
                    </Link>
                </div>

            </div>
        </div>
    )
}