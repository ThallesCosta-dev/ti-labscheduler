const auth = {
    token: null,
    
    init() {
        this.token = localStorage.getItem('token');
        if (this.token) {
            this.redirectIfAuthenticated();
        }
    },

    isAuthenticated() {
        return !!this.token;
    },

    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    },

    logout() {
        this.token = null;
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    },

    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };
    },

    redirectIfAuthenticated() {
        const currentPath = window.location.pathname;
        if (currentPath.includes('login.html') && this.isAuthenticated()) {
            window.location.href = 'main.html';
        } else if (!currentPath.includes('login.html') && !this.isAuthenticated()) {
            window.location.href = 'login.html';
        }
    }
};

auth.init(); 