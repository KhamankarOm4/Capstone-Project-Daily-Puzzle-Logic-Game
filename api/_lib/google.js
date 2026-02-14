
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
// Use dynamic callback URL based on environment, default to localhost for dev
// In Vercel production, this should be set to the production URL
const BASE_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
const REDIRECT_URI = `${BASE_URL}/api/auth/google/callback`;

export function getRedirectUri(host) {
    let currentRedirectUri = REDIRECT_URI;
    if (host && !process.env.VERCEL_URL) {
        // If we are getting a specific host (like localhost:3001) and not in Vercel Prod
        const protocol = host.includes('localhost') ? 'http' : 'https';
        currentRedirectUri = `${protocol}://${host}/api/auth/google/callback`;
        console.log('Dynamic Redirect URI:', currentRedirectUri);
    }
    return currentRedirectUri;
}

export function getGoogleAuthURL(host) {
    const currentRedirectUri = getRedirectUri(host);
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';

    console.log('--- Google Auth Debug ---');
    console.log('Client ID:', GOOGLE_CLIENT_ID ? (GOOGLE_CLIENT_ID.substring(0, 10) + '...') : 'UNDEFINED');
    console.log('Redirect URI:', REDIRECT_URI);
    console.log('-------------------------');

    const options = {
        redirect_uri: currentRedirectUri,
        client_id: GOOGLE_CLIENT_ID,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
        ].join(' '),
    };

    const qs = new URLSearchParams(options);
    return `${rootUrl}?${qs.toString()}`;
}

export async function getGoogleUser(code, redirectUri = REDIRECT_URI) {
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const values = {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
    };

    const tokenRes = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(values).toString(),
    });

    if (!tokenRes.ok) {
        throw new Error('Failed to fetch token');
    }

    const { access_token, id_token } = await tokenRes.json();

    const userRes = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
        {
            headers: {
                Authorization: `Bearer ${id_token}`,
            },
        }
    );

    if (!userRes.ok) {
        throw new Error('Failed to fetch user');
    }

    return await userRes.json();
}
