import { Outlet } from 'react-router';
import Navbar from '../components/Navbar';

export default function RootLayout() {
  return (
    <div className="w-full min-h-screen max-w-7xl mx-auto flex flex-col gap-4">
      <Navbar />
      <main className="flex-1 mt-12 px-4">
        <Outlet />
      </main>
      <footer className="w-full mx-auto">FOOOTER</footer>
    </div>
  );
}
