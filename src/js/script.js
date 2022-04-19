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
