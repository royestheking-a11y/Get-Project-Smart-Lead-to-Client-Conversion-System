import fetch from 'node-fetch';

const reloadEmailConfig = async () => {
    try {
        console.log('🔄 Reloading Email Service Configuration...\n');

        const response = await fetch('http://localhost:8000/api/cron/reload-email-config', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-cron-secret': 'clientcatcher-cron-secret-2024'
            }
        });

        const data = await response.json();
        console.log('Response status:', response.status);
        console.log('Response body:', JSON.stringify(data, null, 2));

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
};

reloadEmailConfig();
