// API configuration
const API_BASE_URL = 'http://localhost:5000/api';

// API helper functions
class PortfolioAPI {
    static async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Authentication
    static async signup(userData) {
        return this.request('/signup', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    static async login(credentials) {
        return this.request('/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    }

    // Contact form
    static async submitContact(contactData) {
        return this.request('/contact', {
            method: 'POST',
            body: JSON.stringify(contactData)
        });
    }

    // Projects
    static async addProject(projectData) {
        return this.request('/projects', {
            method: 'POST',
            body: JSON.stringify(projectData)
        });
    }

    static async getProjects() {
        return this.request('/projects');
    }

    // Health check
    static async healthCheck() {
        return this.request('/health');
    }
}

// Update contact form to use API
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const contactData = {
                name: formData.get('name') || this.querySelector('input[type="text"]').value,
                email: formData.get('email') || this.querySelector('input[type="email"]').value,
                message: formData.get('message') || this.querySelector('textarea').value
            };

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            try {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
                
                await PortfolioAPI.submitContact(contactData);
                
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
                submitBtn.style.background = 'var(--gradient-3)';
                
                // Reset form
                this.reset();
                
                // Show success message
                showNotification('Message sent successfully!', 'success');
                
            } catch (error) {
                submitBtn.innerHTML = '<i class="fas fa-times"></i> Failed';
                submitBtn.style.background = 'var(--gradient-2)';
                showNotification('Failed to send message. Please try again.', 'error');
            } finally {
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = 'var(--gradient-1)';
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    }
});

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}-circle"></i>
        ${message}
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--gradient-1);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);