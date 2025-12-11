import { useLocation } from "react-router-dom";
import { useNavContext } from "../context/navContext.js";
import Button from "./Button.jsx";

export default function Footer() {
    const location = useLocation();
    const { navigateTo } = useNavContext();

    const activeStyle = (path) => {
        if (location.pathname === path) {
            return "footer-button active";
        } else {
            return "footer-button";
        }
    }

    return (
        <footer className="footer">
            <Button
                onClick={() => navigateTo("home")}
                className={ activeStyle("/") }
                content="Home"
            />

            <Button
                onClick={() => navigateTo("schedule")}
                className={ activeStyle("/schedule") }
                content="Schedule"
            />

            <Button
                onClick={() => navigateTo("history")}
                className={ activeStyle("/history") }
                content="History"
            />

            <Button
                onClick={() => navigateTo("settings")}
                className={ activeStyle("/settings") }
                content="Settings"
            />

            <Button
                onClick={() => navigateTo("personal-information")}
                className={ activeStyle("/personal-information") }
                content="Profile"
            />
        </footer>
    );
}