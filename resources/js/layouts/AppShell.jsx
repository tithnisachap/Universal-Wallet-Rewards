export default function AppShell({ children }) {
    return (
        <div className="min-h-screen bg-gray-100 sm:py-6">
            <div className="app-shell relative mx-auto min-h-screen bg-gray-50 sm:min-h-[calc(100vh-3rem)] sm:overflow-hidden sm:rounded-3xl sm:shadow-xl">
                {children}
            </div>
        </div>
    );
}
