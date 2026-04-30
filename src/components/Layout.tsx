const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main>
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-surface p-4 sm:p-6">
        {children}
      </div>
    </main>
  );
};

export default Layout;
