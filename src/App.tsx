import { createBrowserRouter, RouterProvider } from 'react-router'

const router = createBrowserRouter([
  { path: '/', lazy: async () => ({ Component: (await import('@/routes/Home')).default }) },
])

export default function App() {
  return <RouterProvider router={router} />
}
