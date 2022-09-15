import React from 'react'
import CIcon from '@coreui/icons-react'

import {
  cilDrop,
  cilHome,
  cilSpeedometer,
  cilChartPie,
  cilPeople,
  cilTask,
  cilSmilePlus,
} from '@coreui/icons'
import { CNavItem, CNavTitle, CNavGroup } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Home',
    to: '/home',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Analytics',
    to: '/analytics',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavGroup,
    name: 'Users',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Customers',
        to: '/customer',
      },
      {
        component: CNavItem,
        name: 'Service Providers',
        to: '/serviceprovider',
      },
      {
        component: CNavItem,
        name: 'Admin',
        to: '/admin',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'FAQ',
    to: '/faq',
    icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'About Us',
    to: '/aboutus',
    icon: <CIcon icon={cilSmilePlus} customClassName="nav-icon" />,
  },
]

export default _nav
