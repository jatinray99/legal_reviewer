import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from '.\services\AuthContext';
import { 
  CookieCareLogo, SunIcon, MoonIcon, CheckCircleIcon, ScaleIcon, ShieldCheckIcon 
} from './components/Icons';
import LoraChatbot from "./components/LoraChatbot";
import './chatbot.css'; 

// --- LAZY LOADING: These files are now only downloaded when clicked ---
const CookieScannerView = lazy(() => import('./components/CookieScannerView'));
// Note: LegalReviewerView will now contain the complex Tabs (Repository, Negotiation, etc.)
const LegalReviewerView = lazy(() => import('./components/LegalReviewerView'));
const VulnerabilityScannerView = lazy(() => import('./components/VulnerabilityScannerView'));

const ThemeToggle: React.FC<{ theme: string, toggleTheme: () => void }> = ({ theme, toggleTheme }) => (
    <button
        onClick={toggleTheme}
        className="p-2 rounded-full text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
        aria-label="Toggle theme"
    >
        {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
    </button>
);

// --- LOGIN COMPONENT ---
const LoginScreen = () => {
  const { loginWithGoogle } = useAuth();
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
      <div className="bg-[var(--bg-tertiary)] p-8 rounded-lg shadow-xl text-center max-w-md w-full border border-[var(--border-primary)]">
        <CookieCareLogo className="h-16 w-auto text-brand-blue mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-[var(--text-headings)] mb-2">Welcome Back</h2>
        <p className="text-[var(--text-primary)] mb-8">Sign in to access your secure Legal Workspace</p>
        <button 
          onClick={loginWithGoogle}
          className="w-full bg-brand-blue hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-md transition duration-200 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-6.98 7.2-6.98 3.5 0 4.92 2.23 5.96 4.07l2.55-2.73C18.9 3.78 16.07 2 12.2 2 6.3 2 2 6.5 2 12.25c0 5.75 4.3 10.25 10.2 10.25 5.85 0 9.72-4.18 9.72-10.25c0-.54-.07-1.08-.19-1.15z"/></svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

type View = 'scanner' | 'legal' | 'vulnerability';

// --- AUTH PROTECTED APP CONTENT ---
const ProtectedApp: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [theme, setTheme] = useState('dark');
  const [activeView, setActiveView] = useState<View>('legal');

  // Redirect if not logged in
  if (!currentUser) return <LoginScreen />;

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const NavTab: React.FC<{view: View, label: string, icon: React.ReactNode}> = ({ view, label, icon }) => {
    const isActive = activeView === view;
    return (
       <button 
          onClick={() => setActiveView(view)}
          className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-semibold rounded-md transition-colors duration-200 ${
            isActive 
              ? 'bg-brand-blue text-white shadow-sm' 
              : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
          }`}
       >
        {icon}
        <span>{label}</span>
      </button>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] font-sans text-[var(--text-primary)] flex flex-col">
      <header className="bg-[var(--bg-primary)]/80 backdrop-blur-sm sticky top-0 z-50 border-b border-[var(--border-primary)]">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CookieCareLogo className="h-8 w-auto text-brand-blue" />
            <h1 className="text-xl font-bold text-[var(--text-headings)] tracking-tight">
              Cookie Care <span className="text-xs font-normal opacity-60 ml-2">| {currentUser.email}</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={logout} className="text-sm hover:text-red-400">Sign Out</button>
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-grow">
        <div className="max-w-5xl mx-auto mt-4 mb-8">
          <div className="flex justify-center items-center p-1.5 bg-[var(--bg-tertiary)] rounded-lg space-x-2 flex-wrap">
            <NavTab view="legal" label="Legal Review" icon={<ScaleIcon className="h-5 w-5" />} />
            <NavTab view="scanner" label="Cookie Scanner" icon={<CheckCircleIcon className="h-5 w-5"/>} />
            <NavTab view="vulnerability" label="Vulnerability Scanner" icon={<ShieldCheckIcon className="h-5 w-5" />} />
          </div>
        </div>
        
        {/* Suspense handles the "Loading..." state while waiting for the heavy chunks */}
        <Suspense fallback={<div className="flex justify-center p-12"><div className="animate-spin h-8 w-8 border-4 border-brand-blue rounded-full border-t-transparent"></div></div>}>
            {activeView === 'scanner' && <CookieScannerView />}
            {activeView === 'legal' && <LegalReviewerView />}
            {activeView === 'vulnerability' && <VulnerabilityScannerView />}
        </Suspense>
      </main>

      <footer className="text-center py-6 text-sm text-[var(--text-primary)]/80">
        <p>&copy; {new Date().getFullYear()} Cookie Care. All rights reserved.</p>
      </footer>

      <LoraChatbot />
    </div>
  );
};

// Wrap everything in AuthProvider
const App = () => (
  <AuthProvider>
    <ProtectedApp />
  </AuthProvider>
);

export default App;