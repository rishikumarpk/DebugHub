import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useState, useEffect } from 'react';

const Layout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

    useEffect(() => {
        const handleResize = (e: unknown) => {
            const customEvent = e as CustomEvent;
            setSidebarCollapsed(customEvent.detail);
        };
        window.addEventListener('sidebarToggle', handleResize);
        return () => window.removeEventListener('sidebarToggle', handleResize);
    }, []);

    return (
        <div className="flex min-h-screen font-body relative" style={{ backgroundColor: 'var(--lapis)', color: 'var(--text-primary)' }}>
            <Sidebar />
            <div
                className={`flex-1 flex flex-col transition-all duration-300 relative z-10 w-full min-h-screen ${sidebarCollapsed ? 'ml-[64px]' : 'ml-[220px]'}`}
            >
                <Topbar />

                <main className="flex-1 relative overflow-auto block w-full">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
