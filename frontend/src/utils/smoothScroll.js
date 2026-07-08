export const smoothScrollTo = (e, href) => {
  e.preventDefault()
  const targetId = href.replace('#', '')
  const targetElement = document.getElementById(targetId)
  if (targetElement) {
    const headerOffset = 80 // Header height offset
    const elementPosition = targetElement.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}
