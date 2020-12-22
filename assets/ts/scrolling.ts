function disable(id: string, disabled: boolean) {
  const el = document.getElementById(id);
  if (disabled) {
    el.setAttribute('disabled', 'true')
  } else {
    el.removeAttribute('disabled')
  }
}

function updateButtonState() {
  const currentScroll = window.scrollX;
  disable('scroll-back-button', currentScroll == 0)
  disable('scroll-forward-button', currentScroll == document.body.scrollWidth - window.innerWidth)
}

window.addEventListener('scroll', (event: Event) => {
  updateButtonState();
})

function scrollFunction(offset: number) {
  return () => {
    window.scrollBy({left: offset, behavior: 'smooth'});
  };
}

document.getElementById('scroll-forward-button').onclick = scrollFunction(window.innerWidth * 5)
document.getElementById('scroll-back-button').onclick = scrollFunction(-window.innerWidth * 5)
updateButtonState()
