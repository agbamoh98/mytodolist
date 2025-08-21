import { useState, useEffect } from 'react'
import axios from 'axios'

// Your backend API URL
const API_BASE_URL = 'http://localhost:8081/api/todos'
const USER_ID = 'user123' // We'll make this dynamic later with authentication

function App() {
  // Our first state: a list of todos (now from backend)
  const [todos, setTodos] = useState([])
  
  // Second state: what the user is currently typing
  const [newTodo, setNewTodo] = useState("")
  
  // Loading state
  const [loading, setLoading] = useState(true)

  // Function to fetch todos from backend
  const fetchTodos = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}?userId=${USER_ID}`)
      console.log('Fetched todos:', response.data) // Debug log
      setTodos(response.data)
    } catch (error) {
      console.error('Error fetching todos:', error)
      console.error('Error details:', error.response?.data) // More detailed error
      // Keep empty array if error
      setTodos([])
    } finally {
      setLoading(false)
    }
  }

  // Load todos when component first renders
  useEffect(() => {
    fetchTodos()
  }, [])

  // Function to add a new todo
  const addTodo = () => {
    if (newTodo.trim()) { // Only add if not empty
      setTodos([...todos, { text: newTodo, completed: false }]) // Add to the list
      setNewTodo("") // Clear the input
    }
  }

  // Function to delete a todo
  const deleteTodo = (indexToDelete) => {
    setTodos(todos.filter((_, index) => index !== indexToDelete))
  }

  // Function to toggle todo completion
  const toggleTodo = (indexToToggle) => {
    setTodos(todos.map((todo, index) => 
      index === indexToToggle 
        ? { ...todo, completed: !todo.completed }
        : todo
    ))
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          📝 my todo management webapp!
        </h1>
        
        {/* Input field to add new todos */}
        <div className="mb-6 flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addTodo}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add
          </button>
        </div>
        
        {/* Display our todos */}
        <div className="space-y-2">
          {todos.map((todo, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded border">
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(index)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              
              {/* Todo text */}
              <span 
                className={`flex-1 ${
                  todo.completed 
                    ? 'line-through text-gray-500' 
                    : 'text-gray-800'
                }`}
              >
                {todo.title}
              </span>
              
              {/* Delete button */}
              <button
                onClick={() => deleteTodo(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
