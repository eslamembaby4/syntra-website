const navToggle = document.getElementById("navToggle");
const navMobile = document.getElementById("navMobile");

if (navToggle && navMobile) {
  navToggle.addEventListener("click", () => {
    const expanded = navMobile.style.display === "flex";
    navMobile.style.display = expanded ? "none" : "flex";
  });

  navMobile.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => {
      navMobile.style.display = "none";
    });
  });
}
