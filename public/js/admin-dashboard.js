document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user || user.role !== 'admin') {
        window.location.href = '/login.html';
        return;
    }

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    });

    const articlesList = document.getElementById('articlesList');

    // Fetch All Users
    const usersList = document.getElementById('usersList');

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();

            if (response.ok) {
                renderUsers(result.data);
            } else {
                usersList.innerHTML = '<tr><td colspan="4">Failed to load users.</td></tr>';
            }
        } catch (error) {
            console.error(error);
            usersList.innerHTML = '<tr><td colspan="4">Error loading users.</td></tr>';
        }
    };

    const renderUsers = (users) => {
        if (users.length === 0) {
            usersList.innerHTML = '<tr><td colspan="4">No users found.</td></tr>';
            return;
        }
        usersList.innerHTML = users.map(user => `
            <tr>
                <td>${user.name || 'N/A'}</td>
                <td>${user.email}</td>
                <td><span class="role-badge role-${user.role}">${user.role}</span></td>
                <td>${new Date(user.createdAt).toLocaleDateString()}</td>
            </tr>
        `).join('');
    };

    // Fetch All Articles
    const fetchArticles = async () => {
        try {
            const response = await fetch('/api/articles', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();

            if (response.ok) {
                renderArticles(result.data);
            } else {
                articlesList.innerHTML = '<p>Failed to load articles.</p>';
            }
        } catch (error) {
            console.error(error);
            articlesList.innerHTML = '<p>Error loading articles.</p>';
        }
    };

    // Calculate read time
    const calculateReadTime = (text) => {
        const words = text.trim().split(/\s+/).length;
        const minutes = Math.ceil(words / 200);
        return minutes;
    };

    const renderArticles = (articles) => {
        if (articles.length === 0) {
            articlesList.innerHTML = `
                <div class="card empty-state">
                    <div class="empty-state-icon">📰</div>
                    <h3>No stories published yet</h3>
                    <p>Stories will appear here once users start publishing</p>
                </div>
            `;
            return;
        }

        articlesList.innerHTML = articles.map(article => {
            const isLong = article.content.length > 200;
            const excerpt = isLong ? article.content.substring(0, 200) + '...' : article.content;
            const readTime = calculateReadTime(article.content);
            const authorName = article.author ? article.author.name || article.author.email.split('@')[0] : 'Unknown';

            return `
            <div class="article-card" id="article-${article.id}">
                <h3>${article.title}</h3>
                <div class="article-content">
                    <p class="short-text">${excerpt}</p>
                    <p class="full-text" style="display: none;">${article.content}</p>
                </div>
                <div class="article-meta">
                    <span>By ${authorName}</span>
                    <span>•</span>
                    <span class="read-time">${readTime} min read</span>
                    <span>•</span>
                    <span>${new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div class="article-actions">
                    ${isLong ? `<button class="btn btn-secondary btn-sm read-more-btn" onclick="toggleReadMore('${article.id}')">Read more</button>` : ''}
                    <button class="btn btn-primary btn-sm" onclick="editArticle('${article.id}', '${article.title.replace(/'/g, "\\'")}', \`${article.content.replace(/`/g, '\\`')}\`)">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteArticle('${article.id}')">Delete</button>
                </div>
            </div>
        `}).join('');
    };

    // Global function for toggle
    window.toggleReadMore = (id) => {
        const card = document.getElementById(`article-${id}`);
        const shortText = card.querySelector('.short-text');
        const fullText = card.querySelector('.full-text');
        const btn = card.querySelector('.read-more-btn');

        if (fullText.style.display === 'none') {
            fullText.style.display = 'block';
            shortText.style.display = 'none';
            btn.textContent = 'Read Less';
        } else {
            fullText.style.display = 'none';
            shortText.style.display = 'block';
            btn.textContent = 'Read More';
        }
    };

    // Global function for editing article (Admin can edit any article)
    window.editArticle = async (id, title, content) => {
        const newTitle = prompt('Edit Title:', title);
        if (newTitle === null) return; // User cancelled

        const newContent = prompt('Edit Content:', content);
        if (newContent === null) return; // User cancelled

        try {
            const response = await fetch(`/api/articles/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title: newTitle, content: newContent })
            });

            if (response.ok) {
                alert('Article updated successfully!');
                fetchArticles();
            } else {
                const result = await response.json();
                alert(result.message || 'Failed to update article');
            }
        } catch (error) {
            console.error(error);
            alert('Error updating article');
        }
    };

    // Global function for deleting article (Admin can delete any article)
    window.deleteArticle = async (id) => {
        if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`/api/articles/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert('Article deleted successfully!');
                fetchArticles();
            } else {
                const result = await response.json();
                alert(result.message || 'Failed to delete article');
            }
        } catch (error) {
            console.error(error);
            alert('Error deleting article');
        }
    };

    fetchUsers();
    fetchArticles();
});
