const scrollMultiplier = 25;

window.addEventListener('wheel', (event: WheelEvent) => {
  const maxOffset = (document.body.scrollWidth - document.body.clientWidth)
  const delta = event.deltaY/Math.abs(event.deltaY)*scrollMultiplier;
  const newOffset = Math.max(0, Math.min(maxOffset, pageXOffset + delta))
  window.scrollTo({left: newOffset});
  event.preventDefault()
})
