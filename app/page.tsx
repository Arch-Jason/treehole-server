import Overview from "./components/overview";
import SideNav from "./components/sideNav";

export default function Home() {
  return (
    <div className="w-screen flex flex-row">
    <SideNav />
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col gap-6 w-full">
      <Overview />
    </div>
    </div>
  );
}
