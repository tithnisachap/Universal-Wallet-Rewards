export const currentCustomer = {
    id: 'CUS-000125',
    name: 'Vitou Raksmey',
    email: 'Tou@gmail.com',
    avatar: null,
    memberSince: 'June 23, 2026',
};

export const googleAccounts = [
    { name: 'John Doe', email: 'johndoe@gmail.com', avatar: null },
    { name: 'Vitou Raksmey', email: 'Vitou@gmail.com', avatar: null },
];

export const vendors = [
    {
        id: 'coffee-bean',
        name: 'The Coffee Bean',
        category: 'Coffee Shop',
        summary: 'Earn points and stamps redeem amazing rewards',
        color: 'bg-amber-900',
        stamps: 6,
        points: 125,
        stampsRequired: 10,
    },
    {
        id: 'starbucks',
        name: 'Starbucks',
        category: 'Coffee Shop',
        summary: 'Collect stamps and get reward',
        color: 'bg-emerald-700',
        stamps: 8,
        points: 100,
        stampsRequired: 10,
    },
    {
        id: 'breadtalk',
        name: 'BreadTalk',
        category: 'Bakery',
        summary: 'Collect stamps and get reward',
        color: 'bg-gray-900',
        stamps: 2,
        points: 23,
        stampsRequired: 10,
    },
    {
        id: 'dunkin',
        name: "Dunkin' Donuts",
        category: 'Bakery',
        summary: 'Earn points to redeem rewards',
        color: 'bg-orange-600',
        stamps: 7,
        points: 0,
        stampsRequired: 10,
    },
];

export const branches = {
    'coffee-bean': [
        {
            id: 'tk-avenue',
            name: 'TK Avenue Branch',
            fullName: 'TK Avenue (Main Shop)',
            address: 'TK Avenue, Toul Kork, Phnom Penh',
            hours: '8:00 AM – 10:00 PM',
            phone: '012 345 678',
            current: true,
            joined: 'Jan 15, 2025',
        },
        {
            id: 'bkk1',
            name: 'BKK1 Branch',
            address: 'BKK1, Phnom Penh',
            hours: '9:00 AM – 10:00 PM',
            phone: '098 345 678',
            current: false,
        },
        {
            id: 'aeon-mall',
            name: 'AEON Mall Branch',
            address: 'AEON Mall Sen Sok, Phnom Penh',
            hours: '10:00 AM – 10:00 PM',
            phone: '011 345 678',
            current: false,
        },
        {
            id: 'chip-mong',
            name: 'Chip Mong 271 Branch',
            address: 'Chip Mong 271, Phnom Penh',
            hours: '8:00 AM – 11:00 PM',
            phone: '021 345 678',
            current: false,
        },
    ],
};

export const activityHistory = [
    { id: 1, type: 'points_earned', label: 'Points Earned', date: 'May 24, 2026', time: '10:30 AM', value: '+25' },
    { id: 2, type: 'stamp_earned', label: 'Stamp Earned', date: 'May 24, 2026', time: '10:30 AM', value: '+1' },
    { id: 3, type: 'stamp_earned', label: 'Stamp Earned', date: 'May 18, 2026', time: '02:15 PM', value: '+1' },
    { id: 4, type: 'points_earned', label: 'Points Earned', date: 'May 18, 2026', time: '02:15 PM', value: '+20' },
    { id: 5, type: 'reward_redeemed', label: 'Reward Redeemed', date: 'May 15, 2026', time: '03:40 PM', value: '-150', tag: '1 Free Drink' },
    { id: 6, type: 'points_earned', label: 'Points Earned', date: 'Apr 28, 2026', time: '01:05 PM', value: '+20' },
];

export const nearbyStores = [
    { id: 'starbucks-1', name: 'Starbucks', distance: '0.3 km away', category: 'Coffee' },
    { id: 'coffee-bean-1', name: 'The Coffee Bean', distance: '0.5 km away', category: 'Coffee' },
];

// Vendor-side placeholder data
export const vendorProfile = {
    status: 'approved', // 'not_completed' | 'pending' | 'approved'
    businessName: 'The Coffee Bean',
    category: 'Coffee Shop',
    phone: '+855 12 345 678',
    email: 'vendor@coffeebean.com',
    address: '#123, Street 123, Phnom Penh, Cambodia',
    website: 'www.coffeebean.com',
};

export const vendorBranches = [
    {
        id: 'tk-avenue',
        name: 'TK Avenue Branch',
        fullName: 'TK Avenue (Main Shop)',
        address: 'TK Avenue, Toul Kork, Phnom Penh',
        hours: '8:00 AM – 10:00 PM',
        phone: '012 345 678',
        current: true,
        joined: 'Jan 15, 2025',
    },
    {
        id: 'bkk1',
        name: 'BKK1 Branch',
        address: 'BKK1, Phnom Penh',
        hours: '9:00 AM – 10:00 PM',
        phone: '098 345 678',
        current: false,
    },
    {
        id: 'aeon-mall',
        name: 'AEON Mall Branch',
        address: 'AEON Mall Sen Sok, Phnom Penh',
        hours: '10:00 AM – 10:00 PM',
        phone: '011 345 678',
        current: false,
    },
    {
        id: 'chip-mong',
        name: 'Chip Mong 271 Branch',
        address: 'Chip Mong 271, Phnom Penh',
        hours: '8:00 AM – 11:00 PM',
        phone: '021 345 678',
        current: false,
    },
];

export const vendorTodayOverview = {
    stampsAdded: 0,
    pointsAdded: 0,
    stampsRedeemed: 0,
    pointsDeducted: 0,
};

export const promotions = [
    {
        id: 1,
        type: 'stamps',
        category: 'Drinks',
        title: 'Free Coffee (Big Size)',
        description: 'Get 1 free coffee (Big size)',
        requirement: '10 Stamps',
        status: 'active',
        date: 'May 30, 2026',
    },
    {
        id: 2,
        type: 'points',
        category: 'Discount',
        title: 'Discount 20%',
        description: 'Get 20% off on any purchase',
        requirement: '150 Points',
        status: 'scheduled',
        date: 'Jun 1, 2026',
    },
    {
        id: 3,
        type: 'points',
        category: 'Food',
        title: 'Free Dessert',
        description: 'Get 1 free dessert',
        requirement: '120 Points',
        status: 'active',
        date: 'May 28, 2026',
    },
    {
        id: 4,
        type: 'stamps',
        category: 'Drinks',
        title: 'Buy 1 Get 1',
        description: 'Buy any drink, get 1 free',
        requirement: '12 Stamps',
        status: 'expired',
        date: 'May 10, 2026',
    },
    {
        id: 5,
        type: 'points',
        category: 'Discount',
        title: '$5 Off',
        description: 'Get $5 off on min. spend $20',
        requirement: '200 Points',
        status: 'expired',
        date: 'Apr 20, 2026',
    },
];

export const vendorActivity = [
    { id: 1, label: '+25 Points', name: 'John Doe', time: '10:30 AM', type: 'points_add' },
    { id: 2, label: '+1 Stamp', name: 'Mary Jane', time: '10:25 AM', type: 'stamp_add' },
    { id: 3, label: '-150 Points', name: 'John Doe', time: '10:20 AM', type: 'points_deduct' },
    { id: 4, label: '+20 Points', name: 'Anna Smith', time: '10:05 AM', type: 'points_add' },
    { id: 5, label: '+30 Points', name: 'Annatt mith', time: '10:03 AM', type: 'points_add' },
    { id: 6, label: 'Redeemed 10 Stamps', name: 'Peter Parker', time: '10:15 AM', type: 'redeem' },
    { id: 7, label: '-50 Points', name: 'Nisa tith', time: '10:23 AM', type: 'points_deduct' },
];

export const vendorAnalytics = {
    totalCustomers: 1248,
    customerGrowthPct: '+12.8%',
    pointsAdded: 12450,
    pointsDeducted: 8320,
    stampsAdded: 1250,
    stampsRedeemed: 1250,
    customerGrowth: [
        { label: 'May 18', value: 300 },
        { label: 'May 19', value: 650 },
        { label: 'May 20', value: 900 },
        { label: 'May 21', value: 500 },
        { label: 'May 22', value: 750 },
        { label: 'May 23', value: 700 },
        { label: 'May 24', value: 1248 },
    ],
    pointsTransactions: [
        { label: 'May 17', added: 1100, deducted: 700 },
        { label: '18', added: 950, deducted: 450 },
        { label: '20', added: 1300, deducted: 900 },
        { label: '21', added: 950, deducted: 700 },
        { label: '22', added: 900, deducted: 950 },
        { label: '23', added: 700, deducted: 750 },
        { label: '24', added: 650, deducted: 500 },
    ],
    stampsTransactions: [
        { label: 'May 17', added: 1250, redeemed: 250 },
        { label: '18', added: 350, redeemed: 700 },
        { label: '20', added: 1250, redeemed: 250 },
        { label: '21', added: 750, redeemed: 700 },
        { label: '22', added: 1500, redeemed: 700 },
        { label: '23', added: 750, redeemed: 350 },
        { label: '24', added: 250, redeemed: 700 },
    ],
    topPromotions: [
        { rank: 1, title: 'Free Coffee (Big Size)', redeemed: 485 },
        { rank: 2, title: 'Discount 20%', redeemed: 234 },
        { rank: 3, title: 'Free Dessert', redeemed: 123 },
    ],
    totalRedemptions: 352,
    redemptionsChangePct: '+18.6%',
    redemptionsByDay: [
        { label: 'MON', value: 40 },
        { label: 'TUE', value: 55 },
        { label: 'WED', value: 90 },
        { label: 'THU', value: 118 },
        { label: 'FRI', value: 85 },
        { label: 'SAT', value: 65 },
        { label: 'SUN', value: 35 },
    ],
};

export const scannedCustomer = {
    id: 'CUS-000125',
    name: 'John Doe',
    stamps: 6,
    stampsRequired: 10,
    points: 125,
};

// Admin-side placeholder data
export const adminOverview = {
    totalVendors: 142,
    pendingApprovals: 3,
    stampsRedeemed: 18560,
    suspendedVendors: 0,
    vendorGrowth: [
        { label: 'May 1', value: 8 },
        { label: 'May 8', value: 10 },
        { label: 'May 15', value: 22 },
        { label: 'May 22', value: 18 },
        { label: 'May 29', value: 30 },
    ],
    vendorStatus: {
        total: 142,
        active: 108,
        pending: 3,
        rejected: 0,
    },
    platformActivity: {
        totalCustomers: 2458,
        stampsIssued: 18560,
        pointsIssued: 45230,
        rewardsRedeemed: 7892,
    },
};

export const adminAnalytics = {
    totalCustomers: 2458,
    customerGrowthPct: '+12.5%',
    activeVendors: 108,
    vendorGrowthPct: '+8.3%',
    stampsIssued: 18560,
    pointsIssued: 45230,
    vendorGrowthSeries: [
        { label: 'May 1', value: 10 },
        { label: 'May 8', value: 14 },
        { label: 'May 15', value: 26 },
        { label: 'May 22', value: 20 },
        { label: 'May 29', value: 32 },
    ],
    customerGrowthSeries: [
        { label: 'May 1', value: 300 },
        { label: 'May 8', value: 700 },
        { label: 'May 15', value: 1200 },
        { label: 'May 22', value: 600 },
        { label: 'May 29', value: 2458 },
    ],
};

export const vendorApprovals = {
    pending: [
        {
            id: 1,
            name: 'The Coffee Bean',
            category: 'Coffee Shop',
            location: '#123, Street 123, Phnom Penh',
            owner: 'John Doe',
            email: 'john@gmail.com',
            phone: '+855 12 345 678',
            website: 'www.coffeebean.com',
            submitted: 'May 20, 2026 10:30 AM',
        },
        {
            id: 2,
            name: 'Sweet Bites Bakery',
            category: 'Bakery',
            location: 'Central Market, Block B',
            owner: 'Jane Smith',
            email: 'jane@gmail.com',
            phone: '+855 12 000 000',
            website: '',
            submitted: 'May 20, 2026 09:15 AM',
        },
    ],
    approved: [],
    rejected: [],
    history: [
        { id: 1, name: 'The Coffee Bean', category: 'Coffee Shop', date: 'May 20, 2026 09:15 AM', status: 'approved' },
        { id: 2, name: 'Sweet Bites Bakery', category: 'Bakery', date: 'May 20, 2026 09:15 AM', status: 'approved' },
        { id: 3, name: 'Fit & Fresh Juice Bar', category: 'Juice Bar', date: 'May 20, 2026 09:15 AM', status: 'rejected' },
        { id: 4, name: 'Burger House', category: 'Fast Food', date: 'May 20, 2026 09:15 AM', status: 'approved' },
        { id: 5, name: 'TK Cafe', category: 'Cafe', date: 'May 20, 2026 09:15 AM', status: 'approved' },
        { id: 6, name: 'Healthy Bowl', category: 'Healthy Food', date: 'May 20, 2026 09:15 AM', status: 'rejected' },
        { id: 7, name: 'Green Garden', category: 'Restaurant', date: 'May 20, 2026 09:15 AM', status: 'approved' },
    ],
};

export const adminUser = {
    name: 'Admin User',
    role: 'Super Administrator',
    avatar: null,
};
