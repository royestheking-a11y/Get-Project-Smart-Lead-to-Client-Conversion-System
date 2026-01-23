import fetch from 'node-fetch';

const checkRenderConfig = async () => {
    try {
        const response = await fetch('https://get-project-backend.onrender.com/api/cron/debug-config');
        const data = await response.json();

        console.log('🔍 Render Configuration Status:\n');
        console.log(JSON.stringify(data, null, 2));

        // Now check what the actual transporter config would be
        const testResponse = await fetch('https://get-project-backend.onrender.com/api/cron/test-smtp-connection', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer clientcatcher-cron-secret-2024',
                'Content-Type': 'application/json'
            }
        });

        if (testResponse.ok) {
            const result = await testResponse.json();
            console.log('\n📧 SMTP Test Result:\n');
            console.log(JSON.stringify(result, null, 2));
        } else {
            console.log('\n⚠️ Test endpoint not available (needs to be created)');
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
};

checkRenderConfig();
