const API_BASE = "/api";

const URLS = {
	// Public routes
	LOGIN: `${API_BASE}/users/login/`,
	REGISTER: `${API_BASE}/users/register/`,

	// Auth routes
	LOGOUT: `${API_BASE}/users/logout/`,
	CHECK_AUTH: `${API_BASE}/users/check-auth/`,
	REFRESH: `${API_BASE}/users/token-refresh/`,
	DELETE_USER: `${API_BASE}/users/delete-user/`,
};

export default URLS;
