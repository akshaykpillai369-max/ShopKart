import { Outlet } from "react-router-dom";
import Navbar from "../components/NavBar";

export default function StoreLayout() {
  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4">
        <Outlet />
      </main>
    </>
  );
}