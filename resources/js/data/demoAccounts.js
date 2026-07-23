// Stand-in for the Google account picker until Socialite login is wired up.
// These map to real seeded users in the database (see database/seeders/).
export const demoAccountsByRole = {
    customer: [
        { name: 'Vitou Raksmey', email: 'Tou@gmail.com' },
        { name: 'John Doe', email: 'john.doe@gmail.com' },
    ],
    vendor: [{ name: 'John Doe', email: 'john@gmail.com' }],
    admin: [{ name: 'Admin User', email: 'admin@universalwallet.test' }],
};
