// MATRIX RAIN EFFECT
const matrixCanvas = document.getElementById('matrixCanvas')
const matrixCtx = matrixCanvas.getContext('2d')
const letters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*()*&^%'
let matrixFont = 16
let matrixColumns = []

function resizeMatrix(){
  matrixCanvas.width = window.innerWidth
  matrixCanvas.height = window.innerHeight
  matrixFont = window.innerWidth < 768 ? 12 : 16
  matrixColumns = Array(Math.floor(matrixCanvas.width / matrixFont)).fill(1)
}

function drawMatrix(){
  if(!matrixCtx) return
  matrixCtx.fillStyle = 'rgba(10,10,15,0.15)'
  matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height)
  matrixCtx.fillStyle = 'rgba(124,111,247,0.9)'
  matrixCtx.font = `${matrixFont}px monospace`
  matrixColumns.forEach((y, index) => {
    const text = letters.charAt(Math.floor(Math.random()*letters.length))
    const x = index * matrixFont
    matrixCtx.fillText(text, x, y * matrixFont)
    if(y * matrixFont > matrixCanvas.height && Math.random() > 0.975) matrixColumns[index] = 0
    matrixColumns[index]++
  })
  requestAnimationFrame(drawMatrix)
}

window.addEventListener('resize', resizeMatrix)
resizeMatrix()
requestAnimationFrame(drawMatrix)

// LOADING SCREEN
const loadingScreen = document.getElementById('loadingScreen')
window.addEventListener('load', () => {
  setTimeout(() => {
    loadingScreen.classList.add('hidden')
  }, 650)
})

// DARK/LIGHT MODE
const themeToggle = document.getElementById('themeToggle')
const rootBody = document.body
const savedTheme = localStorage.getItem('nikashTheme') || 'dark'
function applyTheme(theme){
  rootBody.classList.toggle('light', theme === 'light')
  rootBody.classList.toggle('dark', theme !== 'light')
  themeToggle.textContent = theme === 'light' ? '☀️' : '🌙'
  localStorage.setItem('nikashTheme', theme)
}
applyTheme(savedTheme)

themeToggle.addEventListener('click', () => {
  applyTheme(rootBody.classList.contains('light') ? 'dark' : 'light')
})

// SCROLL ANIMATIONS
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting) e.target.classList.add('visible')
  })
}, { threshold: .12 })
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el))

// CERTIFICATE SLIDESHOW
let certIdx = 0
const totalCerts = 4
const track = document.getElementById('certTrack')
const dots = document.querySelectorAll('.cert-dot')

function goToCert(i){
  certIdx = (i + totalCerts) % totalCerts
  track.style.transform = `translateX(-${certIdx*100}%)`
  dots.forEach((d,j) => d.classList.toggle('active', j === certIdx))
}

document.getElementById('certNext').addEventListener('click', () => goToCert(certIdx + 1))
document.getElementById('certPrev').addEventListener('click', () => goToCert(certIdx - 1))
dots.forEach(d => d.addEventListener('click', () => goToCert(+d.dataset.i)))
setInterval(() => goToCert(certIdx + 1), 5000)

// CHATBOT — rule-based, no external API
const chatBtn = document.getElementById('chatbot-btn')
const chatWindow = document.getElementById('chat-window')
const chatClose = document.getElementById('chatClose')
const chatInput = document.getElementById('chat-input')
const chatSend = document.getElementById('chat-send')
const chatMessages = document.getElementById('chatMessages')

const QA = [
  { keys:['name','who','nikash'], reply:'I\'m Nikash K R — a B.Tech student specialising in Artificial Intelligence & Data Science, passionate about tech, AI, and beautiful design.' },
  { keys:['education','study','college','cgpa','degree','university'], reply:'Nikash is pursuing B.Tech in Artificial Intelligence & Data Science with a CGPA of 8.35.' },
  { keys:['language','code','program','java','python','html','css','javascript'], reply:'Nikash codes in Java, Python, HTML, CSS, and JavaScript.' },
  { keys:['tool','figma','visual studio','vs code','software'], reply:'His go-to tools are Figma for design and Visual Studio Code for development.' },
  { keys:['project','built','work','booking','ticket','dice','student','marks'], reply:'Nikash has built a Movie Ticket Booking System (Java/OOP), a Student Marks Manager (Java/HashMap), and a Python Dice Game with multiplayer support. Check the Projects section for details!' },
  { keys:['certificate','cert','microsoft','anthropic','freecodecamp','leap','arduino'], reply:'Nikash holds 4 certificates: Anthropic AI Fluency Framework, Microsoft Power Apps Applied Skills, freeCodeCamp Responsive Web Design, and LEAP Automation with Arduino (IIT Madras).' },
  { keys:['interest','hobby','passion','game','gaming','uiux','ui','ux','design'], reply:'Outside of coding, Nikash loves exploring gaming mechanics and UI/UX design — he believes great tech should also be beautiful!' },
  { keys:['github'], reply:'You can find Nikash\'s code at github.com/nikash108 🚀' },
  { keys:['linkedin','connect','contact'], reply:'Connect with Nikash on LinkedIn: linkedin.com/in/nikash-k-r-234635391 — he\'d love to hear from you!' },
  { keys:['hello','hi','hey','sup','hiya'], reply:'Hey there! 👋 Ask me anything about Nikash\'s skills, projects, or background!' },
  { keys:['bye','goodbye','thanks','thank'], reply:'Thanks for stopping by Nikash\'s portfolio! Feel free to reach out on LinkedIn or GitHub. 😊' },
]

const fallbacks = [
  'Hmm, I\'m not sure about that! Try asking about Nikash\'s projects, skills, certificates, or education.',
  'I can answer questions about Nikash\'s background, projects, and skills — give it a try!',
  'That\'s a bit outside my knowledge! Ask me about Nikash\'s tech stack, projects, or certifications.'
]
let fallbackIdx = 0

function getBotReply(text){
  const lower = text.toLowerCase()
  for(const qa of QA){
    if(qa.keys.some(k => lower.includes(k))) return qa.reply
  }
  return fallbacks[fallbackIdx++ % fallbacks.length]
}

chatBtn.addEventListener('click', () => chatWindow.classList.toggle('open'))
chatClose.addEventListener('click', () => chatWindow.classList.remove('open'))

function addMsg(text, role){
  const div = document.createElement('div')
  div.className = `msg ${role}`
  div.textContent = text
  chatMessages.appendChild(div)
  chatMessages.scrollTop = chatMessages.scrollHeight
}

function addTyping(){
  const div = document.createElement('div')
  div.className = 'msg bot typing'
  div.innerHTML = '<span></span><span></span><span></span>'
  chatMessages.appendChild(div)
  chatMessages.scrollTop = chatMessages.scrollHeight
  return div
}

function sendMessage(){
  const text = chatInput.value.trim()
  if(!text) return
  chatInput.value = ''
  addMsg(text, 'user')
  const typing = addTyping()
  setTimeout(() => {
    typing.remove()
    addMsg(getBotReply(text), 'bot')
  }, 700)
}

chatSend.addEventListener('click', sendMessage)
chatInput.addEventListener('keydown', e => { if(e.key === 'Enter') sendMessage() })

// FOOTER CONTACT FORM VALIDATION
const footerForm = document.getElementById('footerContactForm')
const footerName = document.getElementById('footerName')
const footerEmail = document.getElementById('footerEmail')
const footerMessage = document.getElementById('footerMessage')
const errorName = document.getElementById('errorName')
const errorEmail = document.getElementById('errorEmail')
const errorMessage = document.getElementById('errorMessage')
const footerSuccess = document.getElementById('footerFormSuccess')

function clearFooterErrors(){
  errorName.textContent = ''
  errorEmail.textContent = ''
  errorMessage.textContent = ''
  footerSuccess.style.display = 'none'
}

function validateFooterForm(){
  let valid = true
  clearFooterErrors()

  if(!footerName.value.trim()){
    errorName.textContent = 'Please enter your name.'
    valid = false
  }

  const emailValue = footerEmail.value.trim()
  if(!emailValue){
    errorEmail.textContent = 'Please enter your email.'
    valid = false
  } else if(!emailValue.includes('@') || !emailValue.includes('.')){
    errorEmail.textContent = 'Please enter a valid email address.'
    valid = false
  }

  if(!footerMessage.value.trim()){
    errorMessage.textContent = 'Please enter a message.'
    valid = false
  }

  return valid
}

footerForm.addEventListener('submit', e => {
  e.preventDefault()
  if(validateFooterForm()){
    footerSuccess.style.display = 'block'
    footerForm.reset()
  }
})