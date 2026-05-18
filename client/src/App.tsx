import { useEffect } from 'react';
import { AppRoutes } from './routes/AppRoutes';
import { useThemeStore } from './store/themeStore';

function App() {
  const { resolvedTheme } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
  }, [resolvedTheme]);

  return <AppRoutes />;
}

export default App;