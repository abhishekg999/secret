const Layout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <main>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col gap-5 items-center justify-center p-4">
            {children}
            </div>
        </main>
    );
}

export default Layout;