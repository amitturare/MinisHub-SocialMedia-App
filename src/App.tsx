import { Routes, Route } from "react-router-dom";

import './globals.css'
// Public Routes
import AuthLayout from "./_auth/AuthLayout";
import SignInForm from "./_auth/forms/SignInForm";
import SignUpForm from "./_auth/forms/SignUpForm";

// Private Routes
import RootLayout from "./_root/RootLayout";
import { Home } from "./_root/pages";


const App = () => {
    return (
        <main className="flex h-screen">
            <Routes>
                {/* Pulic Routes */}
                <Route element={<AuthLayout />}>
                    <Route path="/sign-in" element={<SignInForm />} />
                    <Route path="/sign-up" element={<SignUpForm />} />
                </Route>

                {/* Private Routes */}
                <Route element={<RootLayout />}>
                    <Route index element={<Home />} />
                </Route>
            </Routes>
        </main>
    )
}

export default App