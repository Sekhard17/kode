const { Client } = require('pg');

const connectionString = 'postgresql://postgres.fmbqznynpdohrpyztzh:ZeVNjsUhDz5560v1@aws-1-us-east-2.pooler.supabase.com:5432/postgres';

async function testConnection() {
    const client = new Client({
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('Connecting to Supabase...');
        await client.connect();
        console.log('Connected successfully!');
        const res = await client.query('SELECT NOW()');
        console.log('Result:', res.rows[0]);
        await client.end();
    } catch (err) {
        console.error('Connection error:', err.message);
        if (err.detail) console.error('Detail:', err.detail);
        if (err.hint) console.error('Hint:', err.hint);
    }
}

testConnection();
