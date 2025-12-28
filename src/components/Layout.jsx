import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';

const Layout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login' || location.pathname === '/login/kakao/callback';

  return (
    <div className={`min-h-screen bg-gray-50 ${isLoginPage ? '' : 'pb-20'}`}>
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <main>
          <Outlet />
        </main>
        {!isLoginPage && <BottomNav />}
      </div>
    </div>
  );
};

export default Layout;

