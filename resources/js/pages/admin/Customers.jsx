import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import SearchInput from '../../components/ui/SearchInput';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import QueryState from '../../components/ui/QueryState';
import EmptyState from '../../components/ui/EmptyState';
import Pagination from '../../components/ui/Pagination';
import { useAdminCustomers } from '../../queries/admin';

export default function Customers() {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(timeout);
    }, [search]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    const { data, isLoading, isError, error, refetch } = useAdminCustomers({ search: debouncedSearch, page });
    const customers = data?.data;
    const meta = data?.meta;

    return (
        <div className="px-4 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
            <p className="text-sm text-gray-500">Browse every customer account on the platform</p>

            <SearchInput
                placeholder="Search by name, email, or customer code..."
                className="mt-4"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="mt-4 space-y-3">
                <QueryState
                    isLoading={isLoading}
                    isError={isError}
                    error={error}
                    onRetry={refetch}
                    isEmpty={customers?.length === 0}
                    emptyState={
                        <EmptyState
                            icon={Users}
                            title="No customers found"
                            description={search ? 'Try a different search term.' : 'No customers have signed up yet.'}
                        />
                    }
                >
                    {customers?.map((customer) => (
                        <Link key={customer.id} to={`/admin/customers/${customer.id}`} className="block">
                            <Card className="flex items-center gap-3">
                                <Avatar src={customer.avatar} size={44} />
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-gray-900">{customer.name}</p>
                                    <p className="truncate text-sm text-gray-500">{customer.email}</p>
                                    <p className="text-xs text-gray-400">{customer.customer_code}</p>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </QueryState>
            </div>

            <Pagination meta={meta} onPageChange={setPage} />
        </div>
    );
}
