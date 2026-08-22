import { Outlet } from 'react-router';
import Navbar from '../components/Navbar';

export default function RootLayout() {
  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-4 bg-sladte-200 min-h-screen px-1">
      <Navbar />
      <main className="">
        <Outlet />
      </main>
      <footer className="w-full mx-auto">FOOOTER</footer>
    </div>
  );
}
