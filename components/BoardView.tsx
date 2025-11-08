import React, { useState } from 'react';
import { Task, Category } from '../types';
import TaskItem from './TaskItem';

interface BoardViewProps {
  tasks: Task[];
  onUpdateTaskCategory: (taskId: string, newCategory: Category) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleTask: (taskId: string) => void;
}

const CATEGORY_COLORS: { [key in Category]: string } = {
    [Category.Study]: 'border-t-blue-500',
    [Category.Health]: 'border-t-emerald-500',
    [Category.Personal]: 'border-t-violet-500',
    [Category.General]: 'border-t-gray-500',
};

const BoardView: React.FC<BoardViewProps> = ({ tasks, onUpdateTaskCategory, onEditTask, onDeleteTask, onToggleTask }) => {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, category: Category) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onUpdateTaskCategory(taskId, category);
    }
    setDraggedTaskId(null);
  };

  const getTasksForCategory = (category: Category) => {
    return tasks.filter(task => task.category === category)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {Object.values(Category).map(category => {
        const tasksInCategory = getTasksForCategory(category);
        return (
          <div
            key={category}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, category)}
            className="flex-shrink-0 w-80 bg-gray-100 dark:bg-gray-900/50 rounded-xl"
          >
            <div className={`p-4 border-t-4 ${CATEGORY_COLORS[category]} rounded-t-xl`}>
              <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
                {category}
                <span className="text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full px-2 py-0.5">
                  {tasksInCategory.length}
                </span>
              </h3>
            </div>
            <div className="p-2 space-y-3 h-full max-h-[calc(100vh-350px)] overflow-y-auto">
              {tasksInCategory.length > 0 ? (
                tasksInCategory.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={onToggleTask}
                    onDelete={onDeleteTask}
                    onEdit={onEditTask}
                    onDragStart={handleDragStart}
                    customClassName={draggedTaskId === task.id ? 'opacity-50 scale-105' : ''}
                  />
                ))
              ) : (
                <div className="flex items-center justify-center h-20 text-sm text-gray-500 dark:text-gray-400">
                  Drop tasks here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BoardView;
