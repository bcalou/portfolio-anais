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
  const slides = document.querySelectorAll('.slideshow__slides picture');
  window.addEventListener('resize', resizeSlideshow);
  resizeSlideshow();

  function resizeSlideshow() {
    window.requestAnimationFrame(() => {
      console.log(slides[0])
    });
  }
}
