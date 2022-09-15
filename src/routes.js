import React from 'react'
const Home = React.lazy(() => import('./views/home/Home'))
const Analytics = React.lazy(() => import('./views/analytics/Analytics'))
const AboutUs = React.lazy(() => import('./views/aboutus/AboutUs'))
const Admin = React.lazy(() => import('./views/admin/Admin'))
const Customer = React.lazy(() => import('./views/customer/Customer'))
const ServiceProvider = React.lazy(() => import('./views/serviceprovider/ServiceProvider'))

const ServiceLists = React.lazy(() => import('./views/servicelists/ServiceLists'))
const Gensets = React.lazy(() => import('./views/gensets/Gensets'))
const SpareParts = React.lazy(() => import('./views/spareparts/SpareParts'))

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
  { path: '/servicelists', name: 'ServiceLists', element: ServiceLists },
  { path: '/gensets', name: 'Gensets', element: Gensets },
  { path: '/spareparts', name: 'SpareParts', element: SpareParts },
  { path: '/aboutus', name: 'AboutUs', element: AboutUs },
  { path: '/faq', name: 'Faq', element: Faq },
]

export default routes
