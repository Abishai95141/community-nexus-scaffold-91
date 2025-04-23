
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { Sidebar } from "./Sidebar";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 pt-6 px-4 md:px-6 space-y-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
