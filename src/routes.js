import React from 'react'

const Home = React.lazy(() => import('./views/home/Home'))
const Analytics = React.lazy(() => import('./views/analytics/Analytics'))
const AboutUs = React.lazy(() => import('./views/aboutus/AboutUs'))
const Admin = React.lazy(() => import('./views/admin/Admin'))
const Customer = React.lazy(() => import('./views/customer/Customer'))
const ServiceProvider = React.lazy(() => import('./views/serviceprovider/ServiceProvider'))
const SpareParts = React.lazy(() => import('./views/spareparts/SpareParts'))
<<<<<<< HEAD

=======
const Engines = React.lazy(() => import('./views/engines/Engines'))
const ServiceSchedule = React.lazy(() => import('./views/serviceschedule/ServiceShedule'))
>>>>>>> 1f94e1036e5bd7007b84c7821d3078bff47be5bd
const Faq = React.lazy(() => import('./views/faq/Faq'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/home', name: 'Home', element: Home },
  { path: '/analytics', name: 'Analyics', element: Analytics },
  { path: '/admin', name: 'Admin', element: Admin },
  { path: '/customer', name: 'Customer', element: Customer },
  {
    path: '/serviceprovider',
    name: 'ServiceProvider',
    element: ServiceProvider,
  },
  { path: '/serviceschedule', name: 'ServiceLists', element: ServiceSchedule },
  { path: '/spareparts', name: 'SpareParts', element: SpareParts },
  { path: '/aboutus', name: 'AboutUs', element: AboutUs },
  { path: '/faq', name: 'Faq', element: Faq },
]

export default routes
