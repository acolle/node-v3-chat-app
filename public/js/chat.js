const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const $sidebar = document.querySelector('#sidebar')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

// Manage scrolling
const autoscroll = () => {
  // New message element
  const $newMessage = $messages.lastElementChild

  // Get the height of the new message
  const newMessageStyle = getComputedStyle($newMessage)
  const newMessageMargin = parseInt(newMessageStyle.marginBottom)
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

  // Visible height
  const visibleHeight = $messages.offsetHeight // Height of the visible container

  // Height of messages container
  const containerHeight = $messages.scrollHeight // Total height including when scrolling

  // How far client has scrolled
  const scrollOffset = $messages.scrollTop + visibleHeight // Distance scrolled from the top

  // Scroll down automatically if the client hasn't scrolled up
  if (containerHeight - newMessageHeight) {
    $messages.scrollTop = $messages.scrollHeight
  }
}

// Event Listeners
socket.on('message', (message) => {
  console.log(message)
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm a')
  })
  $messages.insertAdjacentHTML('beforeend', html)
  autoscroll()
})

socket.on('locationMessage', (locationMessage) => {
  console.log(locationMessage)
  const html = Mustache.render(locationMessageTemplate, {
    username: locationMessage.username,
    url: locationMessage.url,
    createdAt: moment(locationMessage.createdAt).format('h:mm a')
  })
  $messages.insertAdjacentHTML('beforeend', html)
  autocroll()
})

socket.on('roomData', ({ room, users }) => {
  console.log(room, users)
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  })
  $sidebar.innerHTML = html
})


// Event Handlers
$messageForm.addEventListener('submit', (e) => {
  e.preventDefault()

  $messageFormButton.setAttribute('disabled', 'disabled') // Disenable the button

  const message = e.target.elements.message.value

  socket.emit('sendMessage', message, (error) => {
    $messageFormButton.removeAttribute('disabled') // Re-enable the button
    $messageFormInput.value = ''
    $messageFormInput.focus()

    if (error) {
      return console.log(error)
    }
    console.log('Message delivered')
  })
})

$sendLocationButton.addEventListener('click', () => {

  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser')
  }

  $sendLocationButton.setAttribute('disabled', 'disabled')

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit('sendLocation', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }, (error) => {
      if (error) {
        return console.log(error)
      }
      $sendLocationButton.removeAttribute('disabled')
      console.log('Location shared')
    })
  })
})

// Event Emits
socket.emit('join', { username, room }, (error) => {
  if (error) {
    alert(error)
    location.href = '/'
  }
})
