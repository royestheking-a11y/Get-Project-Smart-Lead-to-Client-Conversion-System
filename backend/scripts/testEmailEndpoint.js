import fetch from 'node-fetch';

const testEmailEndpoint = async () => {
    try {
        console.log('🧪 Testing email sending endpoint directly...\n');

        // Calling the correct endpoint: /run-jobs
        const response = await fetch('http://localhost:8000/api/cron/run-jobs?limit=5', {
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

testEmailEndpoint();
