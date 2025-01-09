document.addEventListener("DOMContentLoaded", function () {
  const themeToggleBtn = document.getElementById("theme");
  const themeLink = document.getElementById("theme-link");

  themeToggleBtn.addEventListener("click", function () {
    if (themeLink.href.includes("theme-bright.css")) {
      themeLink.href = "css/theme-dark.css";
    } else {
      themeLink.href = "css/theme-bright.css";
    }
  });
});
