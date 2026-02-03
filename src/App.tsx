import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/features/auth/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { HomePage } from '@/pages/HomePage';
import { MatrixPage } from '@/pages/MatrixPage';
import { DailyPlanPage } from '@/pages/DailyPlanPage';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/matrix" element={<MatrixPage />} />
            <Route path="/daily-plan" element={<DailyPlanPage />} />
          </Routes>
          <Toaster />
        </AppLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;