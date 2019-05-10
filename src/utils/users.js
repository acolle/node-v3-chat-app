const users = []

// Add user
const addUser = ({ id, username, room }) => {
  // Clean the data
  username = username.trim().toLowerCase()
  room = room.trim().toLowerCase()

  // Validate the data
  if (!username || !room) {
    return {
      error: 'Username and room are required'
    }
  }

  // Check for existing user
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username
  })

  // Validate username
  if (existingUser) {
    return {
      error: 'Username is already used'
    }
  }

  // Store user
  const user = { id, username, room }
  users.push(user)
  return { user }
}

// Remove user
const removeUser = (id) => {
  const index = users.findIndex((user) => {
    return user.id === id
  })

  if (index !== -1) {
    return users.splice(index, 1)[0]
  }
}

// Get user data
const getUser = (id) => {
  return index = users.find((user) => {
    return user.id === id
  })
}

// Get users in Room
const getUsersInRoom = (room) => {

  // Clean the data
  room = room.trim().toLowerCase()

  const usersInRoom = users.filter((user) => {
    return user.room === room
  })

  if (!usersInRoom) {
    return {
      error: 'Room does not exist'
    }
  }
  return usersInRoom
}

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
}
