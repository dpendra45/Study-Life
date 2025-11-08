export enum Priority {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}

export enum Category {
  Study = 'Study',
  Health = 'Health',
  Personal = 'Personal',
  General = 'General',
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: Category;
  priority: Priority;
  completed: boolean;
  dueDate: string; // ISO string format
}

export interface User {
  name: string;
  email: string;
  avatar?: string;
}
