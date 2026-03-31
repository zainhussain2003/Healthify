import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import RecipeEntryScreen from './screens/RecipeEntryScreen';
import RecipeResultScreen from './screens/RecipeResultScreen';
import HealthifyResultScreen from './screens/HealthifyResultScreen';
import SavedRecipesScreen from './screens/SavedRecipesScreen';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('jwt_token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        button:disabled { opacity: 0.6; cursor: not-allowed; }
        input:focus, textarea:focus {
          border-color: #2d7a4f !important;
          box-shadow: 0 0 0 3px rgba(45,122,79,0.12);
        }
      `}</style>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/home" element={<RequireAuth><HomeScreen /></RequireAuth>} />
          <Route path="/recipe-entry" element={<RequireAuth><RecipeEntryScreen /></RequireAuth>} />
          <Route path="/recipe-result" element={<RequireAuth><RecipeResultScreen /></RequireAuth>} />
          <Route path="/healthify-result" element={<RequireAuth><HealthifyResultScreen /></RequireAuth>} />
          <Route path="/saved-recipes" element={<RequireAuth><SavedRecipesScreen /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
