import { Routes, Route } from 'react-router-dom';
import { PawPrint, Calendar, BarChart3, Settings as SettingsIcon, User } from 'lucide-react';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Schedule from './pages/Schedule.jsx';
import History from './pages/History.jsx';
import Settings from './pages/Settings.jsx';
import PersonalInformation from './pages/PersonalInformation.jsx';
import NotFound from './pages/NotFound.jsx';
import MainLayout from './layouts/MainLayout.jsx';

export default function App() {
  return (
    <Routes>
      <Route 
        path="/login"
        element={<Login />} 
      />

      <Route 
        path="/"
        element={
          <MainLayout 
            title="Máy Chăm Sóc Thú Cưng" 
            intro="Chăm sóc thú cưng của bạn"
            Icon={PawPrint}
          >
            <Dashboard />
          </MainLayout>
        }
      />

      <Route
        path="/schedule"
        element={
          <MainLayout 
            title="Lịch Trình" 
            intro="Quản lý lịch cho ăn tự động"
            Icon={Calendar}
          >
            <Schedule />
          </MainLayout>
        }
      />
      
      <Route
        path="/history"
        element={
          <MainLayout 
            title="Lịch Sử" 
            intro="Theo dõi hoạt động của máy"
            Icon={BarChart3}
          >
            <History />
          </MainLayout>
        }
      />

      <Route
        path="/settings"
        element={
          <MainLayout 
            title="Thiết Lập" 
            intro="Cấu hình máy chăm sóc thú cưng"
            Icon={SettingsIcon}
          >
            <Settings />
          </MainLayout>
        }
      />

      <Route
        path="/personal-information"
        element={
          <MainLayout 
            title="Thông Tin Cá Nhân" 
            intro="Quản lý tài khoản của bạn"
            Icon={User}
          >
            <PersonalInformation />
          </MainLayout>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
