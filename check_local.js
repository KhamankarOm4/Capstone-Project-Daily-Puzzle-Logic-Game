import http from 'http';

const req = http.request('http://localhost:3000/api/test', (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`TYPE: ${res.headers['content-type']}`);
        console.log(`BODY: ${data.substring(0, 200)}`);
    });
});

req.on('error', (e) => {
    console.error(`ERROR: ${e.message}`);
});

req.end();
