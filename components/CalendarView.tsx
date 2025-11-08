import React, { useState, useMemo } from 'react';
import { Task } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface CalendarViewProps {
  tasks: Task[];
  selectedDate: Date | null;
  onDateSelect: (date: Date | null) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, selectedDate, onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const startingDay = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    tasks.forEach(task => {
        const dateKey = new Date(task.dueDate).toDateString();
        if (!map.has(dateKey)) {
            map.set(dateKey, []);
        }
        map.get(dateKey)!.push(task);
    });
    return map;
  }, [tasks]);

  const changeMonth = (offset: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const days = [];
  for (let i = 0; i < startingDay; i++) {
    days.push(<div key={`empty-start-${i}`} className="border-r border-b border-gray-200 dark:border-gray-700"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateKey = date.toDateString();
    const isToday = date.toDateString() === new Date().toDateString();
    const isSelected = selectedDate?.toDateString() === dateKey;
    const tasksForDay = tasksByDate.get(dateKey) || [];

    days.push(
      <div
        key={day}
        className={`p-2 border-r border-b border-gray-200 dark:border-gray-700 cursor-pointer transition-colors duration-200
            ${isSelected ? 'bg-primary-100 dark:bg-primary-900/50' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
        onClick={() => onDateSelect(date)}
      >
        <div className="flex justify-between items-center">
            <span className={`text-sm ${isToday ? 'bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center' : ''}`}>
                {day}
            </span>
        </div>
        {tasksForDay.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
                <span className="h-2 w-full bg-primary/80 rounded-full" title={`${tasksForDay.length} task(s)`}></span>
            </div>
        )}
      </div>
    );
  }

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex space-x-2">
          <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7">
        {daysOfWeek.map(day => (
          <div key={day} className="text-center font-semibold text-sm text-gray-600 dark:text-gray-400 py-2 border-b-2 border-gray-200 dark:border-gray-700">
            {day}
          </div>
        ))}
        {days}
      </div>
    </div>
  );
};

export default CalendarView;
