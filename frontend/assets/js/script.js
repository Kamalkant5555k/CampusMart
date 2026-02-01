const searchInput = document.getElementById("search");

if (searchInput) {
  searchInput.addEventListener("keyup", () => {
    console.log("Searching for:", searchInput.value);
  });
}
