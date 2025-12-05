import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import ReportingManagerDashboard from './components/dashboard/ReportingManagerDashboard';
import ApplicationOwnerDashboard from './components/dashboard/ApplicationOwnerDashboard';
import BusinessOwnerDashboard from './components/dashboard/BusinessOwnerDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import ManageUserAccessPage from './components/dashboard/ManageUserAccessPage';
import QuarterlyReviewPage from './components/dashboard/QuarterlyReviewPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<ReportingManagerDashboard />} />
        <Route path="/app-owner" element={<ApplicationOwnerDashboard />} />
        <Route path="/business-owner" element={<BusinessOwnerDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/manage-access" element={<ManageUserAccessPage />} />
        <Route path="/quarterly-review" element={<QuarterlyReviewPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
