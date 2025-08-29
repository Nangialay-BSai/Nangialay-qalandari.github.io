// Simple admin authentication check
function checkAdminAuth() {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
        const password = prompt('Enter admin password:');
        if (password === 'admin123') {
            localStorage.setItem('isAdmin', 'true');
        } else {
            alert('Access denied!');
            window.location.href = 'index.html';
            return false;
        }
    }
    return true;
}

// Logout function
function logout() {
    localStorage.removeItem('isAdmin');
    window.location.href = 'index.html';
}

// Load projects from localStorage
function loadProjects() {
    const projects = JSON.parse(localStorage.getItem('adminProjects') || '[]');
    const grid = document.getElementById('projectsGrid');
    
    if (projects.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: #666;">No projects uploaded yet.</p>';
        return;
    }
    
    grid.innerHTML = projects.map((project, index) => `
        <div class="project-item">
            <h4>${project.title}</h4>
            <p>${project.description}</p>
            <div class="project-tech">
                ${project.technologies.split(',').map(tech => 
                    `<span>${tech.trim()}</span>`
                ).join('')}
            </div>
            <div class="project-actions">
                <button class="edit-btn" onclick="editProject(${index})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="delete-btn" onclick="deleteProject(${index})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Save project
function saveProject(projectData) {
    const projects = JSON.parse(localStorage.getItem('adminProjects') || '[]');
    projects.push({
        ...projectData,
        id: Date.now(),
        createdAt: new Date().toISOString()
    });
    localStorage.setItem('adminProjects', JSON.stringify(projects));
}

// Delete project
function deleteProject(index) {
    if (confirm('Are you sure you want to delete this project?')) {
        const projects = JSON.parse(localStorage.getItem('adminProjects') || '[]');
        projects.splice(index, 1);
        localStorage.setItem('adminProjects', JSON.stringify(projects));
        loadProjects();
    }
}

// Edit project (simplified)
function editProject(index) {
    const projects = JSON.parse(localStorage.getItem('adminProjects') || '[]');
    const project = projects[index];
    
    const newTitle = prompt('Edit title:', project.title);
    if (newTitle) {
        projects[index].title = newTitle;
        localStorage.setItem('adminProjects', JSON.stringify(projects));
        loadProjects();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    if (!checkAdminAuth()) return;
    
    loadProjects();
    
    // Handle form submission
    document.getElementById('projectForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const projectData = {
            title: formData.get('title'),
            category: formData.get('category'),
            description: formData.get('description'),
            technologies: formData.get('technologies'),
            github: formData.get('github'),
            demo: formData.get('demo') || ''
        };
        
        saveProject(projectData);
        loadProjects();
        this.reset();
        
        // Show success message
        const btn = document.querySelector('.upload-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Project Added!';
        btn.style.background = 'var(--accent-gradient)';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = 'var(--primary-gradient)';
        }, 2000);
    });
});