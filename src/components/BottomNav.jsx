import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HiHome, HiOutlineHome } from 'react-icons/hi';
import { MdOutlineKitchen, MdKitchen } from 'react-icons/md';
import { FaCamera } from 'react-icons/fa';
import { IoBookOutline, IoBook } from 'react-icons/io5';
import { HiOutlineUser, HiUser } from 'react-icons/hi';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 스크롤 다운 시 숨김, 스크롤 업 시 보임
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    {
      path: '/',
      icon: HiHome,
      activeIcon: HiHome,
      label: '홈',
    },
    {
      path: '/fridge',
      icon: MdOutlineKitchen,
      activeIcon: MdKitchen,
      label: '냉장고',
    },
    {
      path: '/receipt',
      icon: FaCamera,
      label: '',
      isCamera: true,
    },
    {
      path: '/search',
      icon: IoBookOutline,
      activeIcon: IoBook,
      label: '레시피',
    },
    {
      path: '/mypage',
      icon: HiOutlineUser,
      activeIcon: HiUser,
      label: '내 정보',
    },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className={`fixed bottom-0 left-1/2 w-full max-w-md z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200/50 transition-transform duration-300 ease-in-out ${
        isVisible ? '-translate-x-1/2 translate-y-0' : '-translate-x-1/2 translate-y-full'
      }`}
    >
      <div className="w-full">
        <div className="flex items-end justify-around px-2 py-3">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = active && item.activeIcon ? item.activeIcon : item.icon;

            if (item.isCamera) {
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="flex flex-col items-center justify-center relative -mt-8"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
                    <div className="absolute inset-0 rounded-full bg-white/20 blur-sm"></div>
                    <Icon className="text-white text-2xl relative z-10" />
                  </div>
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-white rounded-full opacity-30"></div>
                </button>
              );
            }

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 ${
                  active
                    ? 'text-slate-700 scale-105'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className={`text-2xl transition-transform ${active ? 'scale-110' : ''}`} />
                <span className={`text-xs font-medium transition-colors ${active ? 'text-slate-700' : ''}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;

