document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const header = document.querySelector('.header');

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');

      const spans = menuToggle.querySelectorAll('span');
      if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(10px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        const isExternalLink = this.href.includes('index.html#');

        if (!isExternalLink) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            const offsetTop = target.offsetTop - header.offsetHeight - 20;
            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });

            if (navMenu && navMenu.classList.contains('active')) {
              navMenu.classList.remove('active');
              const spans = menuToggle.querySelectorAll('span');
              spans[0].style.transform = 'none';
              spans[1].style.opacity = '1';
              spans[2].style.transform = 'none';
            }
          }
        }
      }
    });
  });

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
      header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    }

    lastScroll = currentScroll;
  });

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.vegetable-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(item);
  });

  document.querySelectorAll('.sidebar-widget').forEach((widget) => {
    widget.style.opacity = '0';
    widget.style.transform = 'translateX(30px)';
    widget.style.transition = 'opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s';
    observer.observe(widget);
  });

  const tableOfContents = document.querySelector('.table-of-contents');
  if (tableOfContents) {
    tableOfContents.style.opacity = '0';
    tableOfContents.style.transform = 'translateY(20px)';
    tableOfContents.style.transition = 'opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s';
    observer.observe(tableOfContents);
  }
});
