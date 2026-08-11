import Sidebar from "./Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">

  <Sidebar />

  <main className="
    flex-1
    overflow-y-auto
    ml-72
  ">

    {children}

  </main>

</div>
  );
}