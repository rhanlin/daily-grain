import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/features/auth/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { HomePage } from '@/pages/HomePage';
import { MatrixPage } from '@/pages/MatrixPage';
import { DailyPlanView } from '@/features/daily-plan/DailyPlanView';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/matrix" element={<MatrixPage />} />
            <Route path="/daily-plan" element={<DailyPlanView />} />
          </Routes>
        </AppLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;