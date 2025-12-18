import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <main>
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
};

export default Layout;

