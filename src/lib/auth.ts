import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export async function validateAndRefreshToken() {
  const accessToken = Cookies.get('access_token');
  const refreshToken = Cookies.get('refresh_token');

  if (!accessToken || !refreshToken) {
    return null;
  }

  try {
    // First try to validate the access token
    const validateRes = await fetch(`${API_BASE_URL}/validate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    if (validateRes.ok) {
      return accessToken;
    }

    // If access token is invalid, try to refresh
    const refreshRes = await fetch(`${API_BASE_URL}/refresh`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      credentials: 'include', // Important for cookies
    });

    if (!refreshRes.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await refreshRes.json();

    // Update the access token in cookies
    Cookies.set('access_token', data.new_access_token);

    return data.new_access_token;
  } catch (error) {
    console.error('Token validation/refresh error:', error);
    // Clear tokens on error
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    return null;
  }
}
