# Todo Frontend - React Learning Project

This is a React frontend for the todo application, built with modern tools and designed for learning.

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type safety and better development experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls

## 🎓 Learning Path

### Phase 1: React Basics
- [ ] Components and JSX
- [ ] Props and State
- [ ] Event handling
- [ ] Conditional rendering

### Phase 2: Hooks and State Management
- [ ] useState hook
- [ ] useEffect hook
- [ ] Custom hooks
- [ ] Context API

### Phase 3: Styling and UX
- [ ] Tailwind CSS basics
- [ ] Responsive design
- [ ] Component styling
- [ ] Modern UI patterns

### Phase 4: API Integration
- [ ] Fetch data from backend
- [ ] Create, update, delete todos
- [ ] Error handling
- [ ] Loading states

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── TodoList.tsx
│   │   ├── TodoItem.tsx
│   │   ├── AddTodo.tsx
│   │   └── FilterBar.tsx
│   ├── hooks/              # Custom React hooks
│   │   └── useTodos.ts
│   ├── services/           # API service functions
│   │   └── todoApi.ts
│   ├── types/              # TypeScript type definitions
│   │   └── todo.ts
│   ├── styles/             # CSS files
│   │   └── index.css
│   ├── App.tsx             # Main App component
│   └── main.tsx            # Entry point
├── public/                 # Static files
├── package.json            # Dependencies and scripts
└── vite.config.ts         # Vite configuration
```

## 🚀 Getting Started

Once Node.js is installed:

```bash
# Create React project with Vite
npm create vite@latest . -- --template react-ts

# Install dependencies
npm install

# Install additional packages
npm install axios @types/axios tailwindcss

# Start development server
npm run dev
```

## 🎯 Features We'll Build

1. **Todo List Display** - Show all todos
2. **Add New Todo** - Form to create todos
3. **Edit Todo** - Inline editing
4. **Delete Todo** - Remove todos
5. **Mark Complete** - Toggle completion status
6. **Filter Todos** - Show all, completed, pending
7. **Search Todos** - Find specific todos
8. **Priority Levels** - Visual priority indicators
9. **Due Dates** - Date picker and reminders
10. **Responsive Design** - Works on all devices

## 📚 Learning Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
