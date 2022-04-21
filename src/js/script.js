// ******************* //
// Hover GIF animation //
// ******************* //

document.querySelectorAll('.list a').forEach(project => {
  project.addEventListener('mouseover', () => loadAnimation(project));
  project.addEventListener('focus', () => loadAnimation(project));
})

function loadAnimation(project) {
  const gif = project.querySelector('[data-src]');

  if (gif) {
    gif.setAttribute('src', gif.getAttribute('data-src'));
    gif.removeAttribute('data-src');
  }
}

// ********* //
// Slideshow //
// ********* //

const slideshow = document.querySelector('.slideshow');

if (slideshow) {
  slideshow.classList.add('js');
  const transitionProperty = 'transform 0.5s';

  window.addEventListener('resize', resizeSlideshow);
  resizeSlideshow();

  const slides = slideshow.querySelector('.slideshow__slides');
  slides.prepend(slides.querySelector('picture:last-child').cloneNode(true));

  slides.addEventListener('click', () => setCurrent(current + 1));
  const length = slides.children.length;

  const navButtons = slideshow.querySelectorAll('.slideshow__nav button');
  navButtons.forEach((button, index) => button.addEventListener('click', () => {
    setCurrent(index)
  }));

  let current;
  setCurrent(0);

  window.requestAnimationFrame(
    () => slides.style.transition = transitionProperty
  );

  function resizeSlideshow() {
    window.requestAnimationFrame(() => {
      slides.style.width = `${slideshow.clientWidth * length}px`;
      setPosition();
    });
  }

  function setCurrent(index) {
    navButtons[current]?.classList.remove('active');
    current = index;
    setPosition();

    if (current < length - 1) {
      navButtons[current]?.classList.add('active');
    } else {
      goBackToStart();
    }
  }

  function setPosition() {
    slides.style.transform = `translateX(${slideshow.clientWidth * (current + 1) * -1}px)`
  }

  function goBackToStart() {
    slides.style.transition = "none";
    window.requestAnimationFrame(() => {
      setCurrent(-1);
      window.requestAnimationFrame(() => {
        slides.style.transition = transitionProperty;
        window.requestAnimationFrame(() => setCurrent(0));
      })
    });
  }
}
