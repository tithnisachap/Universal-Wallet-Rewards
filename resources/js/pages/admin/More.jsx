import { Users, BarChart3, History, Settings, UserCog, HelpCircle, Info, LogOut, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import { adminUser } from '../../data/mock';
import { useSession } from '../../context/SessionContext';

const management = [
    { label: 'Customers', icon: Users },
    { label: 'Reports', icon: BarChart3 },
    { label: 'Activity Logs', icon: History },
];

const system = [
    { label: 'Settings', icon: Settings },
    { label: 'Admin Profile', icon: UserCog },
    { label: 'Help & Support', icon: HelpCircle },
    { label: 'About', icon: Info },
];

export default function More() {
    const navigate = useNavigate();
    const { logout } = useSession();

    function handleLogout() {
        logout('admin');
        navigate('/admin/login');
    }

    return (
        <div className="px-4 py-4">
            <h1 className="text-center text-xl font-bold text-brand-600">More</h1>

            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-700 to-purple-700 p-4 text-white">
                <Avatar size={48} />
                <div className="flex-1">
                    <p className="font-bold">{adminUser.name}</p>
                    <p className="text-sm text-white/70">{adminUser.role}</p>
                </div>
                <ChevronRight size={18} className="text-white/70" />
            </div>

            <MenuSection title="Management" items={management} />
            <MenuSection title="System" items={system} />

            <button
                onClick={handleLogout}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-danger-100 bg-danger-50 py-3 text-sm font-semibold text-danger-500"
            >
                <LogOut size={16} /> Logout
            </button>
        </div>
    );
}

function MenuSection({ title, items }) {
    return (
        <div className="mt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">{title}</p>
            <Card className="divide-y divide-gray-100 p-0">
                {items.map((item) => (
                    <div key={item.label} className="flex cursor-not-allowed items-center gap-3 px-4 py-3 opacity-50">
                        <item.icon size={18} className="text-gray-500" />
                        <span className="flex-1 text-sm font-medium text-gray-700">{item.label}</span>
                        <ChevronRight size={16} className="text-gray-300" />
                    </div>
                ))}
            </Card>
        </div>
    );
}
