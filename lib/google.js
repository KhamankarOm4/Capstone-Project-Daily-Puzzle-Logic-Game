const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

/**
 * Build redirect URI from request origin
 * @param {string} origin - Request origin (e.g., "https://your-app.onrender.com")
 * @returns {string} Redirect URI
 */
function getRedirectUri(origin) {
    if (origin) {
        return `${origin.replace(/\/$/, '')}/auth/google/callback`;
    }
    return process.env.NODE_ENV === "production"
        ? `${process.env.APP_URL || 'http://localhost:3000'}/auth/google/callback`
        : "http://localhost:3000/auth/google/callback";
}

/**
 * Generate Google OAuth URL
 * @param {string} [origin] - Request origin for dynamic redirect URI
 * @returns {string} Google OAuth consent URL
 */
export function getGoogleAuthURL(origin) {
    const redirectUri = getRedirectUri(origin);
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

    const options = {
        redirect_uri: redirectUri,
        client_id: GOOGLE_CLIENT_ID,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ].join(" "),
    };

    const qs = new URLSearchParams(options);
    return `${rootUrl}?${qs.toString()}`;
}

/**
 * Exchange auth code for Google user info
 * @param {string} code - Auth code from Google
 * @param {string} [origin] - Request origin (must match the one used in getGoogleAuthURL)
 * @returns {Promise<object>} Google user info (email, name, picture)
 */
export async function getGoogleUser(code, origin) {
    const redirectUri = getRedirectUri(origin);
    const tokenUrl = "https://oauth2.googleapis.com/token";

    const values = {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
    };

    const tokenRes = await fetch(tokenUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(values).toString(),
    });

    if (!tokenRes.ok) {
        throw new Error("Failed to fetch token");
    }

    const { access_token } = await tokenRes.json();

    const userRes = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`
    );

    if (!userRes.ok) {
        throw new Error("Failed to fetch user");
    }

    return await userRes.json();
}
