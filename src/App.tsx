import {
  BookOutlined,
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons'
import { Menu, Typography } from 'antd'
import { type ReactNode, useMemo, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

import { CoursesPage } from './pages/CoursesPage.tsx'
import { DashboardPage } from './pages/DashboardPage.tsx'
import { EnrollmentsPage } from './pages/EnrollmentsPage.tsx'
import { StudentsPage } from './pages/StudentsPage.tsx'

type AppRoute = 'dashboard' | 'students' | 'courses' | 'enrollments'

const APP_NAME = 'Trung tâm đào tạo'
const ISLAND_RADIUS = 24

const routePath: Record<AppRoute, `/${string}`> = {
  dashboard: '/dashboard',
  students: '/students',
  courses: '/courses',
  enrollments: '/enrollments',
}

const routeLabel: Record<AppRoute, string> = {
  dashboard: 'Tổng quan',
  students: 'Học viên',
  courses: 'Khoá học',
  enrollments: 'Đăng ký / Huỷ',
}

const routeIcon: Record<AppRoute, ReactNode> = {
  dashboard: <DashboardOutlined />,
  students: <TeamOutlined />,
  courses: <BookOutlined />,
  enrollments: <UserSwitchOutlined />,
}

const pathnameToRoute = (pathname: string): AppRoute => {
  const normalized = pathname.replace(/\/+$/, '')
  const match = (Object.keys(routePath) as AppRoute[]).find(
    (r) => routePath[r] === normalized,
  )
  return match ?? 'dashboard'
}

export const App = () => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const route = pathnameToRoute(location.pathname)

  const menuItems = useMemo(
    () =>
      (Object.keys(routeLabel) as AppRoute[]).map((key) => ({
        key: routePath[key],
        label: routeLabel[key],
        icon: routeIcon[key],
      })),
    [],
  )

  return (
    <div className="flex h-dvh gap-3 overflow-hidden bg-slate-100 p-3">
      {/* ── Sidebar island ── */}
      <div
        className="flex shrink-0 flex-col overflow-hidden bg-white shadow-md transition-all duration-300"
        style={{ borderRadius: ISLAND_RADIUS, width: collapsed ? 72 : 240 }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 bg-linear-to-br from-slate-800 to-slate-600 px-4 py-5 text-white"
          style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
        >
          <DashboardOutlined style={{ fontSize: 20, flexShrink: 0 }} />
          {!collapsed && (
            <span className="truncate text-sm font-semibold leading-tight">
              {APP_NAME}
            </span>
          )}
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-2">
          <Menu
            mode="inline"
            inlineCollapsed={collapsed}
            selectedKeys={[routePath[route]]}
            items={menuItems}
            style={{ border: 'none' }}
            onClick={(e) => navigate(e.key)}
          />
        </div>

        {/* Collapse trigger (bottom, antd-style) */}
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? 'Mở rộng' : 'Thu gọn'}
          className="flex h-12 shrink-0 items-center justify-center border-t border-slate-100 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
      </div>

      {/* ── Content island ── */}
      <div
        className="flex flex-1 flex-col overflow-hidden bg-white shadow-md"
        style={{ borderRadius: ISLAND_RADIUS }}
      >
        {/* Mini header */}
        <div className="flex shrink-0 items-center border-b border-slate-100 px-6 py-4">
          <Typography.Title level={4} className="m-0!">
            {routeLabel[route]}
          </Typography.Title>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<Navigate to={routePath.dashboard} replace />} />
            <Route path={routePath.dashboard} element={<DashboardPage />} />
            <Route path={routePath.students} element={<StudentsPage />} />
            <Route path={routePath.courses} element={<CoursesPage />} />
            <Route path={routePath.enrollments} element={<EnrollmentsPage />} />
            <Route path="*" element={<Navigate to={routePath.dashboard} replace />} />
          </Routes>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-100 py-3 text-center text-xs text-slate-400">
          {APP_NAME} • React + TypeScript • Ant Design • TailwindCSS
        </div>
      </div>
    </div>
  )
}
