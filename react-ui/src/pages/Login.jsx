import { useState } from "react";
import LoginForm from "../components/LoginForm.jsx";
import RegisterForm from "../components/RegisterForm.jsx";
import ForgotPasswordForm from "../components/ForgotPasswordForm.jsx";

export default function Login() {
    const [view, setView] = useState("login");

    return (
        <div>
            {view === "login" && <LoginForm setView={setView} />}
            {view === "register" && <RegisterForm setView={setView} />}
            {view === "forgotPassword" && <ForgotPasswordForm setView={setView} />}
        </div>
    );
}