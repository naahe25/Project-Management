import React from "react";

export default function Logout() {
    const handleLogout = async () => {
        await fetch("http://localhost/project_management/backend/logout.php");
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

    return (
        <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded">
            Logout
        </button>
    );
}
