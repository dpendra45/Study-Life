
import React from 'react';
import { Task, Category } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CheckCircleIcon, ListBulletIcon, ClockIcon } from './icons';

interface DashboardProps {
  tasks: Task[];
}

const CATEGORY_COLORS: { [key in Category]: string } = {
  [Category.Study]: '#3b82f6', // blue-500
  [Category.Health]: '#10b981', // emerald-500
  [Category.Personal]: '#8b5cf6', // violet-500
  [Category.General]: '#f97316', // orange-500
};

const Dashboard: React.FC<DashboardProps> = ({ tasks }) => {
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  const completionPercentage = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const categoryData = Object.values(Category).map(category => ({
    name: category,
    value: tasks.filter(task => task.category === category).length,
  })).filter(item => item.value > 0);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-primary-50 dark:bg-primary-900/50 p-4 rounded-xl flex items-center">
          <div className="p-3 bg-primary rounded-lg mr-4">
             <ListBulletIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Total Tasks</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{tasks.length}</p>
          </div>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-900/50 p-4 rounded-xl flex items-center">
            <div className="p-3 bg-emerald-500 rounded-lg mr-4">
                <CheckCircleIcon className="h-6 w-6 text-white" />
            </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Completed</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedTasks}</p>
          </div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/50 p-4 rounded-xl flex items-center">
            <div className="p-3 bg-amber-500 rounded-lg mr-4">
                <ClockIcon className="h-6 w-6 text-white" />
            </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Pending</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingTasks}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Progress</h3>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <div
                className="bg-primary h-4 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
            ></div>
            </div>
            <p className="text-right mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">{completionPercentage}% Complete</p>
        </div>
        <div className="h-48">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Category Distribution</h3>
            {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                    >
                        {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name as Category]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{
                        backgroundColor: 'rgba(31, 41, 55, 0.8)',
                        borderColor: '#4b5563',
                        borderRadius: '0.5rem'
                    }}/>
                    <Legend iconSize={10} />
                    </PieChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    No tasks to display.
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
