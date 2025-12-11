import { Routes, Route } from 'react-router-dom';
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
        element={<MainLayout><Dashboard /></MainLayout>}
      />

        <Route
          path="/schedule"
          element={<MainLayout><Schedule /></MainLayout>}
        />
        
        <Route
          path="/history"
          element={<MainLayout><History /></MainLayout>}
        />

        <Route
          path="/settings"
          element={<MainLayout><Settings /></MainLayout>}
        />

        <Route
          path="/personal-information"
          element={<MainLayout><PersonalInformation /></MainLayout>}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
  );
}
