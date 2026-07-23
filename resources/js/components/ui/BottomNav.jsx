import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/cn';

export default function BottomNav({ items }) {
    return (
        <nav className="app-shell fixed inset-x-0 bottom-0 mx-auto flex border-t border-gray-100 bg-white">
            {items.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                        cn(
                            'flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium',
                            isActive ? 'text-brand-600' : 'text-gray-500',
                        )
                    }
                >
                    <Icon size={22} />
                    {label}
                </NavLink>
            ))}
        </nav>
    );
}
