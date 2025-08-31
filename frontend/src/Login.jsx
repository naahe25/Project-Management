if (data.status === "success") {
    localStorage.setItem("user", JSON.stringify(data.user));
    window.location.href = "/"; // redirect to home/dashboard
}
