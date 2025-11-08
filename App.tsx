
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Task, Priority, Category, User } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import CalendarView from './components/CalendarView';
import BoardView from './components/BoardView';
import TaskList from './components/TaskList';
import AddTaskModal from './components/AddTaskModal';
import Login from './components/Login';
import { suggestTasks } from './services/geminiService';
import { BrainCircuitIcon, BellIcon, CalendarDaysIcon, ViewColumnsIcon } from './components/icons';

type ViewMode = 'calendar' | 'board';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });
  const [view, setView] = useState<ViewMode>('calendar');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const notificationTimeouts = useRef<number[]>([]);

  // Auth Effects
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      setNotificationPermission(Notification.permission);
    }
  }, [user]);

  // Task Effects
  useEffect(() => {
    if (user) {
      const savedTasks = localStorage.getItem(`tasks_${user.email}`);
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      } else {
        setTasks([]); // Clear tasks for new user
      }
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`tasks_${user.email}`, JSON.stringify(tasks));
    }
  }, [tasks, user]);

  // Theme Effects
  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
  };
  
  // Notification Effect
  useEffect(() => {
    notificationTimeouts.current.forEach(clearTimeout);
    notificationTimeouts.current = [];

    if (notificationPermission !== 'granted' || !user) return;

    tasks.forEach(task => {
      if (!task.completed) {
        const dueTime = new Date(task.dueDate).getTime();
        const currentTime = new Date().getTime();
        
        const reminderTimeOffset = 5 * 60 * 1000;
        const timeUntilReminder = dueTime - currentTime - reminderTimeOffset;

        if (timeUntilReminder > 0) {
          const timeoutId = setTimeout(() => {
            new Notification('Upcoming Task Reminder', {
              body: `Your task "${task.title}" is due in 5 minutes.`,
              icon: '/vite.svg',
            });
          }, timeUntilReminder);
          notificationTimeouts.current.push(timeoutId);
        }
      }
    });

    return () => {
      notificationTimeouts.current.forEach(clearTimeout);
    };
  }, [tasks, notificationPermission, user]);

  // Mock Auth Handlers
  const handleLogin = (email: string) => {
    const mockUser: User = {
      name: email.split('@')[0],
      email: email,
      avatar: `https://i.pravatar.cc/150?u=${email}`
    };
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem(`tasks_${user?.email}`);
    setUser(null);
    setTasks([]);
  };
  
  // Task Handlers
  const handleAddTask = (task: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      completed: false,
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };
  
  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prevTasks => prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    setTaskToEdit(null);
  };
  
  const handleUpdateTaskCategory = (taskId: string, newCategory: Category) => {
    setTasks(prevTasks => prevTasks.map(task => 
        task.id === taskId ? { ...task, category: newCategory } : task
    ));
  };

  const openEditModal = (task: Task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };
  
  const handleGenerateTasks = useCallback(async () => {
    setIsGenerating(true);
    try {
      const suggested = await suggestTasks();
      const newTasks: Task[] = suggested.map(t => ({
        ...t,
        id: crypto.randomUUID(),
        completed: false,
        dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      }));
      setTasks(prev => [...prev, ...newTasks]);
    } catch (error) {
      console.error("Failed to generate tasks:", error);
      alert("Could not generate tasks. Please check your API key and try again.");
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const openAddModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  }

  const ViewSwitcher = () => (
    <div className="flex justify-center my-6">
        <div className="flex space-x-1 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
            <button onClick={() => setView('calendar')} className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors ${view === 'calendar' ? 'bg-white dark:bg-gray-900 shadow' : 'hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
                <CalendarDaysIcon className="w-5 h-5" /> Calendar
            </button>
            <button onClick={() => setView('board')} className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors ${view === 'board' ? 'bg-white dark:bg-gray-900 shadow' : 'hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
                <ViewColumnsIcon className="w-5 h-5" /> Board
            </button>
        </div>
    </div>
  );
  
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200 transition-colors duration-300 font-sans">
      <Header theme={theme} setTheme={setTheme} user={user} onLogout={handleLogout} />
      {notificationPermission === 'default' && (
        <div className="bg-primary-100 dark:bg-primary-900/50">
            <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between flex-wrap">
                    <div className="w-0 flex-1 flex items-center">
                        <span className="flex p-2 rounded-lg bg-primary">
                            <BellIcon className="h-6 w-6 text-white" aria-hidden="true" />
                        </span>
                        <p className="ml-3 font-medium text-primary-800 dark:text-primary-100">
                            <span>Enable notifications to get task reminders.</span>
                        </p>
                    </div>
                    <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
                        <button onClick={requestNotificationPermission} className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-600">
                            Enable
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <Dashboard tasks={tasks} />
        <ViewSwitcher />
        
        {view === 'calendar' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <CalendarView tasks={tasks} selectedDate={selectedDate} onDateSelect={setSelectedDate} />
                </div>
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Task List</h2>
                            <button
                            onClick={handleGenerateTasks}
                            disabled={isGenerating}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-400 transition-colors"
                            >
                            <BrainCircuitIcon className="w-5 h-5" />
                            {isGenerating ? 'Generating...' : 'Suggest Tasks'}
                            </button>
                        </div>
                        <TaskList
                        tasks={tasks}
                        onToggle={handleToggleTask}
                        onDelete={handleDeleteTask}
                        onEdit={openEditModal}
                        onAddTask={openAddModal}
                        selectedDate={selectedDate}
                        onClearDateFilter={() => setSelectedDate(null)}
                        />
                    </div>
                </div>
            </div>
        ) : (
            <BoardView tasks={tasks} onUpdateTaskCategory={handleUpdateTaskCategory} onEditTask={openEditModal} onDeleteTask={handleDeleteTask} onToggleTask={handleToggleTask} />
        )}

      </main>
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => {
            setIsModalOpen(false);
            setTaskToEdit(null);
        }}
        onAddTask={handleAddTask}
        onUpdateTask={handleUpdateTask}
        taskToEdit={taskToEdit}
      />
    </div>
  );
};

export default App;
