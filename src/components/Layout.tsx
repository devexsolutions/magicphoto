import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Sparkles, User, LogOut, Settings, Home, Upload } from 'lucide-react';
import { useAuthContext } from './AuthProvider';
import { motion } from 'framer-motion';
import { useLanguage } from './LanguageProvider';

const Layout: React.FC = () => {
  const { user, profile, signOut, isAuthenticated, isAdmin } = useAuthContext();
  const location = useLocation();
  const { lang, setLang, t } = useLanguage();

  const navigation = [
    { name: t('nav', 'home'), href: '/', icon: Home },
    { name: t('nav', 'generate'), href: '/generate', icon: Upload },
    { name: t('nav', 'gallery'), href: '/gallery', icon: User },
  ];

  const adminNavigation = [
    { name: t('nav', 'admin'), href: '/admin', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="bg-black/20 backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-purple-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                ViralGenAI
              </span>
            </Link>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
                className="px-3 py-2 text-gray-300 hover:text-white"
              >
                {lang === 'es' ? 'EN' : 'ES'}
              </button>
              {isAuthenticated && (
                <>
                  <div className="hidden md:flex items-center space-x-4">
                    {navigation.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                            isActive(item.href)
                              ? 'bg-purple-600 text-white'
                              : 'text-gray-300 hover:bg-purple-600/50 hover:text-white'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                    {isAdmin && adminNavigation.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                            isActive(item.href)
                              ? 'bg-purple-600 text-white'
                              : 'text-gray-300 hover:bg-purple-600/50 hover:text-white'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-300">
                      <span className="font-medium">{profile?.credits || 0}</span> {t('nav', 'credits')}
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all duration-200"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{t('nav', 'logout')}</span>
                    </button>
                  </div>
                </>
              )}

              {!isAuthenticated && (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    {t('nav', 'login')}
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-200"
                  >
                    {t('nav', 'register')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-black/20 backdrop-blur-md border-t border-purple-500/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 ViralGenAI. {t('footer', 'text')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;