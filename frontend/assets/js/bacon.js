import '../css/bacon.css'
;(function () {
  const addBaconButton = document.getElementsByTagName('button')[0]
  const imageSection = document.querySelectorAll('section img')[0]?.parentElement
  const mainContainer = imageSection?.parentElement

  if (addBaconButton && imageSection && mainContainer) {
    addBaconButton.addEventListener('click', () => {
      const clone = imageSection.cloneNode(true)
      mainContainer.appendChild(clone)
    })
  }
})()
