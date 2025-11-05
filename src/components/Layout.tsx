const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main>
      <div className="h-screen bg-gray-900 flex flex-col gap-5 items-center justify-center p-4 overflow-hidden">
        {children}
      </div>
    </main>
  );
};

export default Layout;