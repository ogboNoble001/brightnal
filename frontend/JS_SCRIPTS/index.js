window.addEventListener("DOMContentLoaded", () => {
        lucide.createIcons();
        var arrayOfTrendingAndSearched = ['Suits', 'Traditionals', 'Kids', 'Skirts', 'Ankaras', 'Watches'];
    const trendingAndSearchedDiv = document.querySelector('.trendingAndSearched-parent');
    arrayOfTrendingAndSearched.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('trendingAndSearched');
        itemDiv.textContent = item;
        trendingAndSearchedDiv.appendChild(itemDiv);
    });

});

// export { runActive };
const products = [
  { src: "/frontend/res/1000068239-removebg-preview.png" },
  { src: "/frontend/res/1000067567-removebg-preview.png" },
  { src: "/frontend/res/file_0000000013fc720a85c48aaf301c7469.png" },
  { src: "/frontend/res/1000068179.png" }
];

const bgColors = [
  ["#5481D9", "#7B9FE8"],
  ["#FF6B6B", "#FF9E9E"],
  ["#6BCB77", "#98E0A6"],
  ["#FFD93D", "#FFE680"],
  ["#845EC2", "#B39CD0"]
];

const table = document.getElementById("imageTable");

products.forEach(item => {
  const wrap = document.createElement("div");
  wrap.className = "imgPrnt";

  const img = document.createElement("img");
  img.className = "imgPrnt-img";
  img.src = item.src;

  const bg = document.createElement("div");
  bg.className = "imgPrnt-bg";

  const color = bgColors[Math.floor(Math.random() * bgColors.length)];
  bg.style.background = `linear-gradient(135deg, ${color[0]} 0%, ${color[1]} 100%)`;

  wrap.appendChild(img);
  wrap.appendChild(bg);
  table.appendChild(wrap);
});
async function checkServerStatus() {
  try {
    const res = await fetch("https://brightnal.onrender.com");
    const data = await res.json();
    console.log("Server status:", data);

    if (data.cloudinary && data.database) {
      console.log("Both Cloudinary and Neon DB are connected ✅");
    } else {
      console.log("Something is not connected ❌", data);
    }
  } catch (err) {
    console.error("Could not reach backend:", err);
  }
}

checkServerStatus();