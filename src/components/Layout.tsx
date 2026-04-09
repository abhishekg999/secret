const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main>
      <div className="flex h-screen flex-col items-center justify-center gap-5 overflow-hidden bg-surface p-4">
        {children}
      </div>
    </main>
  );
};

export default Layout;
