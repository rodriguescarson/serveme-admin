import React from 'react'

const Home = React.lazy(() => import('./views/home/Home'))
const Analytics = React.lazy(() => import('./views/analytics/Analytics'))
const AboutUs = React.lazy(() => import('./views/aboutus/AboutUs'))
const Admin = React.lazy(() => import('./views/admin/Admin'))
const Customer = React.lazy(() => import('./views/customer/Customer'))
const ServiceProvider = React.lazy(() => import('./views/serviceprovider/ServiceProvider'))
const SpareParts = React.lazy(() => import('./views/spareparts/SpareParts'))
const Gensets = React.lazy(() => import('./views/gensets/Gensets'))
const ServiceSchedule = React.lazy(() => import('./views/serviceschedule/ServiceShedule'))
const Services = React.lazy(() => import('./views/services/Services'))

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
  { path: '/services', name: 'Services', element: Services },
  { path: '/spareparts', name: 'SpareParts', element: SpareParts },
  { path: '/aboutus', name: 'AboutUs', element: AboutUs },
  { path: '/gensets', name: 'Gensets', element: Gensets },
  { path: '/faq', name: 'Faq', element: Faq },
]

export default routes
