import { Sidebar } from '../kos/component/Sidebar';

export default function KosLayout({ children }: { children: React.ReactNode }) {
  return (

    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 p-4 lg:ml-96">{children}</main>

    <div className="flex bg-gray-100">
      <Sidebar />
      {children}

    </div>
  );
}
