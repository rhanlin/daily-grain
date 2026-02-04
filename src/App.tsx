import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/features/auth/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { HomePage } from '@/pages/HomePage';
import { MatrixPage } from '@/pages/MatrixPage';
import { DailyPlanPage } from '@/pages/DailyPlanPage';
import { CategoryDetailPage } from '@/pages/CategoryDetailPage';
import { Toaster } from '@/components/ui/sonner';
import { useMedia } from 'react-use';

function App() {
  const isDesktop = useMedia('(min-width: 768px)', true);

  return (
    <AuthProvider>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/matrix" element={<MatrixPage />} />
            <Route path="/daily-plan" element={<DailyPlanPage />} />
            <Route path="/category/:categoryId" element={<CategoryDetailPage />} />
          </Routes>
          <Toaster 
            theme="light"
            position={isDesktop ? 'bottom-right': 'top-center'} 
            duration={1500}
          />
        </AppLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;