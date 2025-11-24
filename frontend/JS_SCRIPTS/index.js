window.onload = () => {
  if (typeof AOS !== "undefined") {
    AOS.init({
      offset: 100,
      delay: 0,
      easing: 'ease-in-out',
      once: false,
      anchorPlacement: 'top-bottom'
    });
  }
  
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
  
  document.getElementById('overlay').style.transition = 'opacity 0.3s ease';
  
  const viewMore = document.querySelector('.view-more');
  const viewMoreIcon = viewMore.querySelector('svg');
  viewMore.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  viewMoreIcon.style.transition = 'transform 0.3s ease';
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const distanceToBottom = docHeight - (scrollTop + windowHeight);
    
    if (distanceToBottom < 200) {
      const opacity = distanceToBottom / 200;
      viewMore.style.opacity = opacity;
      
      if (distanceToBottom <= 50) {
        viewMoreIcon.style.transform = `rotate(${180 * (1 - distanceToBottom / 50)}deg)`;
      } else {
        viewMoreIcon.style.transform = 'rotate(0deg)';
      }
      
      if (distanceToBottom <= 0) {
        viewMore.style.opacity = 0;
        setTimeout(() => {
          viewMoreIcon.style.transform = 'rotate(180deg)';
          viewMore.style.opacity = 1;
        }, 300);
      }
    } else {
      viewMore.style.opacity = 1;
      viewMoreIcon.style.transform = 'rotate(0deg)';
    }
  });
  
  viewMore.addEventListener('click', () => {
    viewMore.style.transform = 'translateY(20px)';
    setTimeout(() => {
      viewMore.style.transform = 'translateY(0)';
    }, 300);
    
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const distanceToBottom = docHeight - (scrollTop + windowHeight);
    
    if (distanceToBottom > 0) {
      window.scrollBy({
        top: 500,
        left: 0,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  });
};