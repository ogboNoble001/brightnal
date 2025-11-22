window.addEventListener("DOMContentLoaded", () => {
  const arrayOfTrendingAndSearched = ['Suits', 'Traditionals', 'Kids', 'Skirts', 'Ankaras', 'Watches'];
  const trendingAndSearchedDiv = document.querySelector('.trendingAndSearched-parent');
  if (trendingAndSearchedDiv) {
    arrayOfTrendingAndSearched.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('trendingAndSearched');
      itemDiv.textContent = item;
      trendingAndSearchedDiv.appendChild(itemDiv);
    });
  }
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  const mediaItems = [
    { type: "image", src: "/frontend/res/04563643a2aa4c8997006ccb1b82e3b0.jpg" },
    { type: "image", src: "/frontend/res/05a7f184a8924a7eb00393d653b8c08f.jpg" },
    { type: "image", src: "/frontend/res/2e11750afa3341cf9a59fb05d3de7b2c.jpg" },
    { type: "image", src: "/frontend/res/692ac7b5ee67478d8e9a52045195cc46.jpg" },
    { type: "image", src: "/frontend/res/a307c6b8e07b4888842ad1571069f95c.jpg" },
    { type: "image", src: "/frontend/res/ac29955b829e4066941e64876de64dbb.jpg" },
    { type: "image", src: "/frontend/res/f3eb32d50e71427aaef1194c00e656eb.jpg" },
    { type: "image", src: "/frontend/res/ccaba25ea2b349f09f82a40b7bce17c5.jpg" },
    { type: "image", src: "/frontend/res/db440dbe8d884002a6b494fe6a5d4603.jpg" },
    { type: "image", src: "/frontend/res/ffdf19ab8c4c4e2a95c75643c0984530.jpg" },
    { type: "image", src: "/frontend/res/8ddea52712e7483784cb6071f01afcca.jpg" },
    { type: "image", src: "/frontend/res/7ae120a7d27f4f5aa4d7d214d6a1c664.jpg" },
    { type: "image", src: "/frontend/res/57ec281b5850418c838edf053f8226ce.jpg" },
    { type: "video", src: "/frontend/res/tmp9j010knw.mp4" },
    { type: "image", src: "/frontend/res/fc9d81fada2b43fc86188cbfadf1f58e.jpg" },
    { type: "image", src: "/frontend/res/daebc7a49e1a435eaf87e1d4fa71e21a.jpg" },
    { type: "image", src: "/frontend/res/4ea7a7b89f6041a6a0a7858f6ce7c642.jpg" },
    { type: "image", src: "/frontend/res/cbacc77b0a1343c3b0aa3a7a6eaa6163.jpg" }
  ];
  
  const masonryContainer = document.querySelector(".masonry");
  if (masonryContainer) {
    mediaItems.forEach((item, index) => {
      let element;
      if (item.type === "image") {
        element = document.createElement("img");
        element.src = item.src;
        element.alt = "";
      } else if (item.type === "video") {
        element = document.createElement("video");
        element.src = item.src;
        element.preload = "none";
        element.autoplay = true;
        element.muted = true;
        element.loop = true;
        element.playsInline = true;
      }
      
      // Add AOS attributes
      element.setAttribute("data-aos", "fade-up"); // Example animation
      element.setAttribute("data-aos-delay", `${index * 50}`); // Stagger effect
      element.setAttribute("data-aos-duration", "800");
      
      masonryContainer.appendChild(element);
    });
    
    // Initialize AOS
    if (typeof AOS !== "undefined") {
      AOS.init({
        once: true // animate only once
      });
    }
  }
  
  // Drop-down function remains the same
  function dropDownOptionDiv(displayCurrentOptionBox, arrOfPossibleOptions) {
    const cnstDisplayCurrentOptionBox = document.querySelector(displayCurrentOptionBox);
    if (!cnstDisplayCurrentOptionBox) return;
    
    const displayOptionBox = document.createElement('div');
    displayOptionBox.classList.add('displayOptionBox');
    displayOptionBox.style.display = 'none';
    
    arrOfPossibleOptions.forEach(option => {
      const optionDiv = document.createElement('div');
      optionDiv.textContent = option;
      optionDiv.classList.add('option-item');
      displayOptionBox.appendChild(optionDiv);
    });
    
    cnstDisplayCurrentOptionBox.appendChild(displayOptionBox);
    cnstDisplayCurrentOptionBox.style.position = 'relative';
    
    cnstDisplayCurrentOptionBox.addEventListener('click', () => {
      displayOptionBox.style.display = displayOptionBox.style.display === 'flex' ? 'none' : 'flex';
    });
  }
  
  async function checkServerStatus() {
    try {
      const res = await fetch("https://brightnal.onrender.com/status");
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
});