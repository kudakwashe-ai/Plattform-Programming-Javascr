document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
        window.location.href = '/login.html';
        return;
    }

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    });

    const articlesList = document.getElementById('articlesList');
    const createArticleForm = document.getElementById('createArticleForm');

    // Fetch My Articles
    const fetchArticles = async () => {
        try {
            const response = await fetch(`/api/articles?authorId=${user.id}`, {
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

    // Calculate read time (average 200 words per minute)
    const calculateReadTime = (text) => {
        const words = text.trim().split(/\s+/).length;
        const minutes = Math.ceil(words / 200);
        return minutes;
    };

    const renderArticles = (articles) => {
        if (articles.length === 0) {
            articlesList.innerHTML = `
                <div class="card empty-state">
                    <div class="empty-state-icon">✍️</div>
                    <h3>No stories yet</h3>
                    <p>Start writing to share your thoughts with the world</p>
                </div>
            `;
            return;
        }

        articlesList.innerHTML = articles.map(article => {
            const isLong = article.content.length > 200;
            const excerpt = isLong ? article.content.substring(0, 200) + '...' : article.content;
            const readTime = calculateReadTime(article.content);

            return `
            <div class="article-card" id="article-${article.id}">
                <h3>${article.title}</h3>
                <div class="article-content">
                    <p class="short-text">${excerpt}</p>
                    <p class="full-text" style="display: none;">${article.content}</p>
                </div>
                <div class="article-meta">
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

        // Update count
        document.getElementById('articleCount').textContent = articles.length;
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

    // Create Article
    createArticleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;

        try {
            const response = await fetch('/api/articles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, content })
            });

            if (response.ok) {
                alert('Article posted!');
                createArticleForm.reset();
                fetchArticles();
            } else {
                alert('Failed to post article');
            }
        } catch (error) {
            console.error(error);
            alert('Error posting article');
        }
    });

    // Global function for editing article
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

    // Global function for deleting article
    window.deleteArticle = async (id) => {
        if (!confirm('Are you sure you want to delete this article?')) {
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

    fetchArticles();
});
