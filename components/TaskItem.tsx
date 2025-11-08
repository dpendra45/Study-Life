import React from 'react';
import { Task, Priority, Category } from '../types';
import { PencilIcon, TrashIcon, FlagIcon, CalendarIcon } from './icons';
import { marked } from 'marked';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  customClassName?: string;
}

const priorityClasses = {
  [Priority.High]: 'text-red-600 dark:text-red-400',
  [Priority.Medium]: 'text-orange-600 dark:text-orange-400',
  [Priority.Low]: 'text-green-600 dark:text-green-400',
};

const categoryClasses = {
  [Category.Study]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  [Category.Health]: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
  [Category.Personal]: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300',
  [Category.General]: 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300',
}

// Basic sanitizer for marked
marked.use({
  walkTokens(token) {
    if (token.type === 'link') {
      const url = token.href;
      if (url && !url.startsWith('http') && !url.startsWith('/')) {
        token.href = `http://${url}`;
      }
    }
  }
});

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onEdit, onDragStart, customClassName }) => {
  
  const createMarkup = (markdownText: string) => {
    const rawMarkup = marked.parse(markdownText || '');
    return { __html: rawMarkup };
  };
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (onDragStart) {
      onDragStart(e, task.id);
    }
  }

  return (
    <div
      draggable={!!onDragStart}
      onDragStart={handleDragStart}
      className={`p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 shadow-sm transition-all duration-300 ${task.completed ? 'opacity-60' : ''} ${customClassName || ''} ${onDragStart ? 'cursor-grab' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 w-full min-w-0">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            className="mt-1 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary flex-shrink-0"
          />
          <div className="w-full">
            <p className={`font-semibold ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-100'}`}>
              {task.title}
            </p>
             <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                <span className={`${categoryClasses[task.category]} px-2 py-0.5 rounded-full text-xs font-medium`}>
                    {task.category}
                </span>
                <span className={`flex items-center gap-1 ${priorityClasses[task.priority]}`}>
                    <FlagIcon className="w-3 h-3"/> {task.priority}
                </span>
                <span className="flex items-center gap-1">
                    <CalendarIcon className="w-3 h-3"/> {new Date(task.dueDate).toLocaleDateString()} {new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
            {task.description && (
                <div 
                    className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 mt-2"
                    dangerouslySetInnerHTML={createMarkup(task.description)}
                />
            )}
          </div>
        </div>
        <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
          <button onClick={() => onEdit(task)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
            <PencilIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
          <button onClick={() => onDelete(task.id)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
            <TrashIcon className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
