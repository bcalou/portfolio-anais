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
  if (window.matchMedia("(min-width: 41em)").matches) {
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
  const length = slides.children.length;

  const navButtons = slideshow.querySelectorAll('.slideshow__nav button');
  const setCurrent = (index) => {
    navButtons[current]?.classList.remove('active');
    current = index;
    setPosition();

    if (current === length - 1) {
      goToStart();
    } else if (current === -2) {
      goToEnd();
    } else {
      navButtons[current]?.classList.add('active');
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

  const goToStart = () => {
    slides.style.transition = "none";
    window.requestAnimationFrame(() => {
      setCurrent(-1);
      window.requestAnimationFrame(() => {
        slides.style.transition = transitionProperty;
        window.requestAnimationFrame(() => setCurrent(0));
      })
    });
  }

  const goToEnd = () => {
    slides.style.transition = "none";
    window.requestAnimationFrame(() => {
      setCurrent(length - 1);
      // window.requestAnimationFrame(() => {
      //   slides.style.transition = transitionProperty;
      //   window.requestAnimationFrame(() => setCurrent(length));
      // })
    });
  }

  navButtons.forEach((button, index) => button.addEventListener('click', () => {
    setCurrent(index)
  }));

  setCurrent(0);

  window.addEventListener('resize', resizeSlideshow);
  resizeSlideshow();

  window.requestAnimationFrame(
    () => slides.style.transition = transitionProperty
  );

  // Swipe handling

  let touchstartX = 0;
  let touchstartY = 0;
  let touchendX = 0;
  let touchendY = 0;

  const handleGesture = (touchstartX, touchstartY, touchendX, touchendY) => {
    const delx = touchendX - touchstartX;
    const dely = touchendY - touchstartY;

    if (Math.abs(delx) > Math.abs(dely)){
        if (delx > 0) {
          setCurrent(current - 1);
        }
        else {
          setCurrent(current + 1);
        }
    }
  }

    slideshow.addEventListener('touchstart', function(event) {
      touchstartX = event.changedTouches[0].screenX;
      touchstartY = event.changedTouches[0].screenY;
    }, false);

    slideshow.addEventListener('touchend', function(event) {
      touchendX = event.changedTouches[0].screenX;
      touchendY = event.changedTouches[0].screenY;
      handleGesture(touchstartX, touchstartY, touchendX, touchendY);
    }, false);
}
