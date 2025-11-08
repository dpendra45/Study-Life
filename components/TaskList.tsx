
import React, { useState } from 'react';
import { Task } from '../types';
import TaskItem from './TaskItem';
import { PlusIcon, XCircleIcon } from './icons';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onAddTask: () => void;
  selectedDate: Date | null;
  onClearDateFilter: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggle, onDelete, onEdit, onAddTask, selectedDate, onClearDateFilter }) => {
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  const filteredTasks = tasks.filter(task => {
    let dateMatch = true;
    if (selectedDate) {
        const taskDate = new Date(task.dueDate);
        dateMatch = taskDate.getFullYear() === selectedDate.getFullYear() &&
                    taskDate.getMonth() === selectedDate.getMonth() &&
                    taskDate.getDate() === selectedDate.getDate();
    }
    
    if (!dateMatch) return false;

    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });
  
  const sortedTasks = [...filteredTasks].sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          <button onClick={() => setFilter('all')} className={`px-3 py-1 text-sm rounded-md ${filter === 'all' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}>All</button>
          <button onClick={() => setFilter('pending')} className={`px-3 py-1 text-sm rounded-md ${filter === 'pending' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}>Pending</button>
          <button onClick={() => setFilter('completed')} className={`px-3 py-1 text-sm rounded-md ${filter === 'completed' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}>Done</button>
        </div>
      </div>
      {selectedDate && (
          <div className="flex justify-between items-center bg-primary-50 dark:bg-primary-900/50 p-2 rounded-lg mb-4">
              <p className="text-sm font-semibold text-primary-800 dark:text-primary-100">
                  Showing tasks for: {selectedDate.toLocaleDateString()}
              </p>
              <button onClick={onClearDateFilter} className="p-1 text-primary-600 dark:text-primary-200 hover:text-primary-800 dark:hover:text-white">
                  <XCircleIcon className="w-5 h-5"/>
              </button>
          </div>
      )}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
        {sortedTasks.length > 0 ? (
          sortedTasks.map(task => (
            <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            {selectedDate ? "No tasks for this day." : "No tasks in this list."}
          </p>
        )}
      </div>
       <button
          onClick={onAddTask}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Add New Task
        </button>
    </div>
  );
};

export default TaskList;
