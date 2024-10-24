import * as React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { NotFound } from '@app/NotFound/NotFound';
import { BaseChatbot, loader as chatbotLoader } from './BaseChatbot/BaseChatbot';
import { AppLayout } from './AppLayout/AppLayout';

export interface IAppRoute {
  label?: string; // Excluding the label will exclude the route from the nav sidebar in AppLayout
  path: string;
  title: string;
  routes?: undefined;
}

export interface IAppRouteGroup {
  label: string;
  routes: IAppRoute[];
}

export type AppRouteConfig = IAppRoute | IAppRouteGroup;

// used for navigation panel
const routes: AppRouteConfig[] = [
  { path: '/', label: 'Home', title: 'Red Hat Composer AI Studio | Home' },
  { path: '/chats', label: 'Chats', title: 'Red Hat Composer AI Studio | Chats' },
];

// used for actual routing
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <BaseChatbot />,
        loader: chatbotLoader,
        errorElement: <NotFound />,
      },
    ],
  },
]);

const AppRoutes = (): React.ReactElement => <RouterProvider router={router} />;

export { AppRoutes, routes, router };
