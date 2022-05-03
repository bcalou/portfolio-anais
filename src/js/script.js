// *********** //
// Burger menu //
// *********** //

const header = document.querySelector('header');

header.querySelector('.header__burger').addEventListener('click', () => {
  header.classList.toggle('header--open');
});

// ******************* //
// Hover GIF animation //
// ******************* //

document.querySelectorAll('.list a').forEach(project => {
  project.addEventListener('mouseover', () => startAnimation(project));
  project.addEventListener('mouseleave', () => stopAnimation(project));
  project.addEventListener('focus', () => startAnimation(project));
})

function startAnimation(project) {
  if (window.matchMedia("(min-width: 39rem)").matches) {
    const gif = project.querySelector('.animation');

    if (gif) {
      gif.setAttribute('src', gif.getAttribute('data-src'));
    }
  }
}

function stopAnimation(project) {
  const gif = project.querySelector('.animation');

  if (gif) {
    gif.removeAttribute('src');
  }
}

// ********* //
// Slideshow //
// ********* //

const slideshow = document.querySelector('.slideshow');

if (slideshow) {
  slideshow.classList.add('js');
  let current;
  const transitionProperty = 'transform 0.5s';

  const slides = slideshow.querySelector('.slideshow__slides');
  slides.prepend(slides.querySelector('picture:last-child').cloneNode(true));

  const navButtons = slideshow.querySelectorAll('.slideshow__nav button');
  const setCurrent = (index) => {
    navButtons[current]?.classList.remove('active');
    current = index;
    setPosition();

    if (current < length - 1) {
      navButtons[current]?.classList.add('active');
    } else {
      goBackToStart();
    }
  }

  const resizeSlideshow = () => {
    window.requestAnimationFrame(() => {
      slides.style.width = `${slideshow.clientWidth * length}px`;
      setPosition();
    });
  }

  const setPosition = () => {
    slides.style.transform = `translateX(${slideshow.clientWidth * (current + 1) * -1}px)`;
  }

  const goBackToStart = () => {
    slides.style.transition = "none";
    window.requestAnimationFrame(() => {
      setCurrent(-1);
      window.requestAnimationFrame(() => {
        slides.style.transition = transitionProperty;
        window.requestAnimationFrame(() => setCurrent(0));
      })
    });
  }

  navButtons.forEach((button, index) => button.addEventListener('click', () => {
    setCurrent(index)
  }));

  slides.addEventListener('click', () => setCurrent(current + 1));
  const length = slides.children.length;

  setCurrent(0);

  window.addEventListener('resize', resizeSlideshow);
  resizeSlideshow();

  window.requestAnimationFrame(
    () => slides.style.transition = transitionProperty
  );
}
