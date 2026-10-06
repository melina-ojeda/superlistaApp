export type RootStackParamList = {
  Login: undefined;
  Registry: undefined;
  Home: undefined;
  CreateItem: undefined;
};

export interface GroceryItem {
  id: string;
  name: string;
  completed: boolean;
  createdAt: number;
}

export type PermissionStatus = 'idle' | 'granted' | 'denied' | 'loading';

export interface Reminder {
  id: string;
  title: string;
  description: string;
  scheduledDate: number;
  notificationId: string | null;
  completed: boolean;
  createdAt: number;
}

export interface NewReminder {
  title: string;
  description: string;
  scheduledDate: Date;
}