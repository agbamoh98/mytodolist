import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from './context/AuthContext'
import { useLanguage } from './context/LanguageContext'
import { useTranslation } from 'react-i18next'
import Sidebar from './components/Sidebar'

// Your backend API URL
const API_BASE_URL = 'https://mytodolist-production.up.railway.app/api/todos'

// Define Todo type
interface Todo {
  id: number
  title: string
  description?: string
  completed: boolean
  userId: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate?: string
  createdAt: string
  updatedAt: string
}

function App() {
  const { user, logout } = useAuth()
  const { isRTL } = useLanguage()
  const { t } = useTranslation()
  
  // Our first state: a list of todos (now from backend)
  const [todos, setTodos] = useState<Todo[]>([])
  
  // Second state: what the user is currently typing
  const [newTodo, setNewTodo] = useState("")
  
  // Loading state
  const [loading, setLoading] = useState(true)
  
  // Filter and search states
  const [filter, setFilter] = useState('all') // 'all', 'active', 'completed'
  const [searchTerm, setSearchTerm] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('all') // 'all', 'LOW', 'MEDIUM', 'HIGH', 'URGENT'
  
  // New todo form states
  const [showAdvancedForm, setShowAdvancedForm] = useState(false)
  const [newTodoPriority, setNewTodoPriority] = useState('MEDIUM')
  const [newTodoDueDate, setNewTodoDueDate] = useState('')

  // Function to fetch todos from backend
  const fetchTodos = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}?userId=${user?.username}`)
      setTodos(response.data)
    } catch (error: any) {
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
  const addTodo = async () => {
    if (newTodo.trim()) { // Only add if not empty
      const newTodoItem = {
        title: newTodo,
        description: "", // Add empty description
        completed: false,
        userId: user?.username,
        priority: newTodoPriority,
        dueDate: newTodoDueDate ? new Date(newTodoDueDate).toISOString() : null
      }
      
      try {
        await axios.post(API_BASE_URL, newTodoItem)
        
        // Refresh the todo list from backend
        fetchTodos()
        setNewTodo("") // Clear the input
        setNewTodoPriority('MEDIUM') // Reset priority
        setNewTodoDueDate('') // Reset due date
        setShowAdvancedForm(false) // Hide advanced form
      } catch (error: any) {
        console.error('Error creating todo:', error)
        console.error('Error details:', error.response?.data)
      }
    }
  }

  // Function to delete a todo
  const deleteTodo = async (indexToDelete: number) => {
    const todoToDelete = todos[indexToDelete]
    
    if (!todoToDelete?.id) {
      console.error('Todo ID is missing:', todoToDelete)
      return
    }
    
    try {
      await axios.delete(`${API_BASE_URL}/${todoToDelete.id}?userId=${user?.username}`)
      
      // Refresh the todo list from backend
      fetchTodos()
    } catch (error: any) {
      console.error('Error deleting todo:', error)
      console.error('Error details:', error.response?.data)
    }
  }

  // Function to toggle todo completion
  const toggleTodo = async (indexToToggle: number) => {
    const todoToToggle = todos[indexToToggle]
    
    if (!todoToToggle?.id) {
      console.error('Todo ID is missing:', todoToToggle)
      return
    }
    
    try {
      await axios.patch(`${API_BASE_URL}/${todoToToggle.id}/toggle?userId=${user?.username}`)
      
      // Refresh the todo list from backend
      fetchTodos()
    } catch (error: any) {
      console.error('Error toggling todo:', error)
      console.error('Error details:', error.response?.data)
    }
  }

  // Function to filter and search todos
  const filteredTodos = todos.filter(todo => {
    // Filter by completion status
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'active' && !todo.completed) || 
      (filter === 'completed' && todo.completed)
    
    // Filter by priority
    const matchesPriority = priorityFilter === 'all' || todo.priority === priorityFilter
    
    // Filter by search term
    const matchesSearch = searchTerm === '' || 
      todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (todo.description && todo.description.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesFilter && matchesPriority && matchesSearch
  })

  // Helper functions
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'URGENT': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'LOW': return '🟢'
      case 'MEDIUM': return '🟡'
      case 'HIGH': return '🟠'
      case 'URGENT': return '🔴'
      default: return '⚪'
    }
  }

  const formatDueDate = (dueDate: string | null | undefined) => {
    if (!dueDate) return null
    const date = new Date(dueDate)
    const now = new Date()
    const isOverdue = date < now
    const isToday = date.toDateString() === now.toDateString()
    
    return {
      formatted: date.toLocaleDateString(),
      isOverdue,
      isToday,
      className: isOverdue ? 'text-red-600 font-semibold' : isToday ? 'text-orange-600 font-semibold' : 'text-gray-600'
    }
  }

  // Stats for display
  const stats = {
    total: todos.length,
    active: todos.filter(todo => !todo.completed).length,
    completed: todos.filter(todo => todo.completed).length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className={`
        p-4 sm:p-6 lg:p-8 transition-all duration-300 overflow-x-hidden
        ${isRTL ? 'mr-0 sm:mr-32 lg:mr-64' : 'ml-0 sm:ml-32 lg:ml-64'}
        pt-16 sm:pt-8
      `}>
        <div className="w-full max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            📝 {t('todos.title')}
          </h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="text-left sm:text-right">
              <p className="text-sm font-medium text-gray-700">
                {t('common.welcome')}, {user?.firstName || user?.username}! 👋
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium w-full sm:w-auto"
            >
              {t('auth.logout')}
            </button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-xs text-blue-700 font-medium">{t('common.all')}</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
            <div className="text-xl sm:text-2xl font-bold text-orange-600">{stats.active}</div>
            <div className="text-xs text-orange-700 font-medium">{t('common.active')}</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
            <div className="text-xl sm:text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-xs text-green-700 font-medium">{t('common.completed')}</div>
          </div>
        </div>
        
        {/* Search bar */}
        <div className="mb-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">🔍</span>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('common.search') + '...'}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 backdrop-blur-sm transition-all duration-200 hover:bg-white"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          )}
        </div>
        
        {/* Filter buttons */}
        <div className="mb-4 flex gap-2 justify-center flex-wrap">
          {['all', 'active', 'completed'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                filter === filterType
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md'
              }`}
            >
              {t(`common.${filterType}`)}
              {filterType !== 'all' && (
                <span className="ml-1 text-xs opacity-75">
                  ({filterType === 'active' ? stats.active : stats.completed})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Priority filter buttons */}
        <div className="mb-6 flex gap-2 justify-center flex-wrap">
          {['all', 'LOW', 'MEDIUM', 'HIGH', 'URGENT'].map((priority) => (
            <button
              key={priority}
              onClick={() => setPriorityFilter(priority)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 transform hover:scale-105 border ${
                priorityFilter === priority
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent shadow-lg'
                  : priority === 'all'
                    ? 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200 shadow-sm hover:shadow-md'
                    : `${getPriorityColor(priority)} hover:shadow-md`
              }`}
            >
              {priority === 'all' ? t('todos.priority') : `${getPriorityIcon(priority)} ${t(`todos.priorities.${priority.toLowerCase()}`)}`}
            </button>
          ))}
        </div>
        
        {/* Input field to add new todos */}
        <div className="mb-6 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !showAdvancedForm && addTodo()}
              placeholder={t('todos.addTodo')}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 backdrop-blur-sm transition-all duration-200 hover:bg-white"
            />
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => setShowAdvancedForm(!showAdvancedForm)}
                className={`px-4 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 flex-1 sm:flex-none ${
                  showAdvancedForm 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 shadow-sm hover:shadow-md'
                }`}
              >
                ⚙️
              </button>
              <button
                onClick={addTodo}
                disabled={!newTodo.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex-1 sm:flex-none"
              >
                {t('common.add')}
              </button>
            </div>
          </div>
          
          {/* Advanced form */}
          {showAdvancedForm && (
            <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 space-y-4 animate-in slide-in-from-top duration-300">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('todos.priority')}</label>
                  <select
                    value={newTodoPriority}
                    onChange={(e) => setNewTodoPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200"
                  >
                    <option value="LOW">🟢 {t('todos.priorities.low')}</option>
                    <option value="MEDIUM">🟡 {t('todos.priorities.medium')}</option>
                    <option value="HIGH">🟠 {t('todos.priorities.high')}</option>
                    <option value="URGENT">🔴 {t('todos.priorities.urgent')}</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('todos.dueDate')}</label>
                  <input
                    type="date"
                    value={newTodoDueDate}
                    onChange={(e) => setNewTodoDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Display our todos */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center text-gray-500 py-8">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-500 rounded-full" role="status">
                <span className="sr-only">{t('common.loading')}</span>
              </div>
              <p className="mt-2">{t('common.loading')}...</p>
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-2">📝</div>
              <p className="text-lg font-medium">
                {searchTerm ? t('todos.noTodos') : t('todos.noTodos')}
              </p>
              <p className="text-sm">
                {searchTerm ? t('common.search') : t('todos.addTodo')}
              </p>
            </div>
          ) : (
            filteredTodos.map((todo) => {
              const originalIndex = todos.findIndex(t => t.id === todo.id)
              const dueDateInfo = formatDueDate(todo.dueDate)
              return (
                <div 
                  key={todo.id} 
                  className={`group p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 ${
                    todo.completed ? 'opacity-75' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(originalIndex)}
                      className="w-5 h-5 text-blue-600 rounded-md focus:ring-blue-500 focus:ring-2 mt-1 transition-all duration-200"
                    />
                    
                    {/* Todo content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {/* Priority badge */}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border shadow-sm ${getPriorityColor(todo.priority)}`}>
                          {getPriorityIcon(todo.priority)} {t(`todos.priorities.${todo.priority.toLowerCase()}`)}
                        </span>
                        
                        {/* Due date */}
                        {dueDateInfo && (
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${dueDateInfo.className} bg-white/50`}>
                            📅 {dueDateInfo.formatted}
                            {dueDateInfo.isOverdue && ' (Overdue!)'}
                            {dueDateInfo.isToday && ' (Today)'}
                          </span>
                        )}
                      </div>
                      
                      {/* Todo title */}
                      <p 
                        className={`text-base leading-relaxed transition-all duration-200 ${
                          todo.completed 
                            ? 'line-through text-gray-500' 
                            : 'text-gray-800'
                        }`}
                      >
                        {todo.title}
                      </p>
                    </div>
                    
                    {/* Delete button */}
                    <button
                      onClick={() => deleteTodo(originalIndex)}
                      className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all duration-200 transform hover:scale-110"
                      title={t('common.delete')}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
        
        {/* Footer */}
        {todos.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              {stats.completed > 0 && `🎉 ${stats.completed} ${t('common.completed')}! `}
              {stats.active > 0 && `${stats.active} ${t('todos.pending')}.`}
            </p>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}

export default App
