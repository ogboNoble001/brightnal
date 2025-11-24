window.addEventListener("DOMContentLoaded", () => {
  if (typeof AOS !== "undefined") {
    AOS.init({ once: true });
  }
  
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
  
  document.getElementById('overlay').style.transition = 'opacity 0.3s ease';
  
  const images = [
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
    { type: "image", src: "/frontend/res/cbacc77b0a1343c3b0aa3a7a6eaa6163.jpg" },
    { type: "image", src: "/frontend/res/2a01626af3fa4e788eddfba0fb65f378.jpg" }
  ];

  // Fixed: Added delay calculation for word animations
  const words = document.querySelectorAll('.animated-text .word');
  words.forEach((word, index) => {
    const delay = index * 150; // Stagger each word by 150ms
    word.setAttribute('data-aos', 'fade-up');
    word.setAttribute('data-aos-duration', '600');
    word.setAttribute('data-aos-delay', delay);
  });
  
  const container = document.querySelector('.masonry-container');
  
  images.forEach((img, index) => {
    const delay = 100 + index * 100;
    const div = document.createElement('div');
    div.className = 'masonry-item';
    div.setAttribute('data-aos', 'fade-up');
    div.setAttribute('data-aos-duration', '600');
    div.setAttribute('data-aos-delay', delay);
    
    const imageEl = document.createElement('img');
    imageEl.src = img.src;
    imageEl.alt = img.alt || 'Gallery image';
    
    div.appendChild(imageEl);
    container.appendChild(div);
  });
});