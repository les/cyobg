/* Update SVG images based on color scheme */
/*******************************************/

// Function to update SVG images based on color scheme
const updateSvgImages = () => {
  const svgTemplates = {
    hr: '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="6"><path d="M0 3 Q 15 2 30 3 T 60 3 T 90 3 T 120 3 T 150 3 T 180 3 T 210 3 T 240 3 T 270 3 T 300 3 T 330 3 T 360 3 T 390 3 T 400 3" stroke="{color}" fill="transparent" stroke-width="2"/></svg>',
    'underline-a': '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="6"><path d="M0 3 Q 15 2 30 3 T 60 3 T 90 3 T 120 3 T 150 3 T 180 3 T 210 3 T 240 3 T 270 3 T 300 3 T 330 3 T 360 3 T 390 3 T 400 3" stroke="{color}" fill="transparent" stroke-width="2"/></svg>'
  }

  const strokeColor = getColorScheme()

  for (const [key, template] of Object.entries(svgTemplates)) {
    const svgImage = generateSvgImageUrl(template, strokeColor)
    document.documentElement.style.setProperty(`--${key}`, svgImage)
  }
}

// Function to get the current color scheme
const getColorScheme = () => {
  const lightColor = 'black'
  const darkColor = 'white'
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDarkScheme ? darkColor : lightColor
}

// Function to generate SVG image URL
const generateSvgImageUrl = (template, color) => {
  return `url('data:image/svg+xml;utf8,${template.replace('{color}', color)}')`
}

/* Update URL hash based on scroll position */
/********************************************/

// Function to update the fragment identifier in the URL as the page is scrolled
const updateUrlHash = () => {
  const legends = document.querySelectorAll('legend')
  const options = {
    root: null, // Defaults to browser viewport
    rootMargin: '0% -60% -80% 0%', // Reduce the intersection area to trigger the observer
    threshold: 1.0
  }

  // Add an IntersectionObserver to each legend element
  const observer = new window.IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Update the URL hash when the legend is in view
        window.history.replaceState(null, null, `#${entry.target.id}`)
      }
    })
  }, options)

  legends.forEach((legend) => {
    observer.observe(legend)
  })
}

/* Update selected options based on checkbox selection */
/*******************************************************/

// Function initialize checkboxes
const initCheckboxes = () => {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]')
  checkboxes.forEach((checkbox) => {
    // Add change event listener to each checkbox
    checkbox.addEventListener('change', () => selectOption(checkbox))
  })

  // Load selected options from local storage
  const storedOptions = JSON.parse(window.localStorage.getItem('selectedOptions'))
  if (storedOptions) {
    checkboxes.forEach((checkbox) => {
      if (storedOptions.includes(checkbox.value)) {
        checkbox.checked = true
      }
    })
  }

  // Update the list of selected options
  updateSelectedOptions()
}

// Function to handle checkbox selection
// Prevents selecting multiple options in the same category, which isn't supported yet
const selectOption = (checkbox) => {
  // Get all checkboxes with the same name
  const checkboxes = document.getElementsByName(checkbox.name)
  checkboxes.forEach((item) => {
    // Uncheck all other checkboxes with the same name
    if (item !== checkbox) {
      item.checked = false
    }
  })
  // Update the list of selected options
  updateSelectedOptions()
}

// Function to update the list of selected options
const updateSelectedOptions = () => {
  // Get all checked checkboxes
  const selectedOptions = document.querySelectorAll(
    'input[type="checkbox"]:checked'
  )
  const selectedOptionsContainer = document.getElementById(
    'selected-options-here'
  )
  selectedOptionsContainer.innerHTML = ''

  // If no options are selected, display a message and clear local storage
  if (selectedOptions.length === 0) {
    selectedOptionsContainer.innerHTML =
      '<p class="none-selected"><em>None selected.</em></p>'
    window.localStorage.removeItem('selectedOptions')
    return
  }

  // Create a new unordered list element
  const list = document.createElement('ul')
  const selectedValues = []
  selectedOptions.forEach((option) => {
    // Create a list item for each selected option
    const listItem = createListItem(option)
    list.appendChild(listItem)
    selectedValues.push(option.value)
  })
  selectedOptionsContainer.appendChild(list)

  // Save selected options to local storage
  window.localStorage.setItem('selectedOptions', JSON.stringify(selectedValues))
  // Add reset button to the container
  selectedOptionsContainer.appendChild(createResetButton())
}

// Function to create a list item for selected options
const createListItem = (option) => {
  // Create a new list item element
  const listItem = document.createElement('li')
  listItem.innerHTML = `<span class="selected-option"><a href="#${option.name}" class="category">${option.getAttribute('data-category')}:</a> <span class="selection">${option.value}</span></span>`
  return listItem
}

// Function to create a reset button for selected options
const createResetButton = () => {
  // Create a new anchor element
  const resetButton = document.createElement('a')
  resetButton.className = 'reset-button'
  resetButton.href = '#'
  resetButton.role = 'button'
  resetButton.textContent = 'Reset'
  // Add click event listener to reset button
  resetButton.addEventListener('click', (event) => {
    event.preventDefault()
    // Uncheck all checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]')
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false
    })
    // Update the list of selected options
    updateSelectedOptions()
  })
  return resetButton
}

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  updateSvgImages()
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateSvgImages)
  updateUrlHash()
  initCheckboxes()
})
