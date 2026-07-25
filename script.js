document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('blogForm');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
    document.getElementById('title').addEventListener('input', () => clearError('title'));
    document.getElementById('author').addEventListener('input', () => clearError('author'));
    document.getElementById('content').addEventListener('input', () => clearError('content'));
  }
  const homeContainer = document.getElementById('homeBlogContainer');
  if (homeContainer) {
    loadBlogsOnHome();
  }
});
async function handleFormSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const author = document.getElementById('author').value.trim();
  const content = document.getElementById('content').value.trim();
  let isValid = true;
  if (title === '') {
    showError('title', 'Title is required.');
    isValid = false;
  } else if (title.length < 5) {
    showError('title', 'Title must be at least 5 characters.');
    isValid = false;
  }
  if (author === '') {
    showError('author', 'Author name is required.');
    isValid = false;
  } else if (!/^[A-Za-z\s]+$/.test(author)) {
    showError('author', 'Author name should contain only letters.');
    isValid = false;
  }
  if (content === '') {
    showError('content', 'Blog content cannot be empty.');
    isValid = false;
  } else if (content.length < 20) {
    showError('content', 'Content must be at least 20 characters.');
    isValid = false;
  }
  if (!isValid) {
    showSuccess('');
    return;
  }
  try {
    const response = await fetch('/api/blogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, author, content })
    });
    const result = await response.json();
    console.log(result);
    if (response.ok) {
      addBlogCard(result.blog.title, result.blog.author, result.blog.content);
      document.getElementById('blogForm').reset();
      showSuccess('Blog post added successfully!');
    } else {
      showSuccess('');
      alert(result.message || 'Something went wrong.');
    }
  } catch (err) {
    console.error('Error submitting blog:', err);
    alert('Could not connect to server. Please try again.');
  }
}
function showError(field, message) {
  document.getElementById(field).style.borderColor = '#e11d48';
  document.getElementById(`${field}Error`).textContent = message;
}
function clearError(field) {
  document.getElementById(field).style.borderColor = '#d1d5db';
  document.getElementById(`${field}Error`).textContent = '';
}
function showSuccess(message) {
  const successEl = document.getElementById('successMsg');
  successEl.textContent = message;
}
function addBlogCard(title, author, content) {
  const container = document.querySelector('.blog-container');
  const card = document.createElement('div');
  card.className = 'blog-card';
  card.innerHTML = `
    <h3>${title}</h3>
    <p><strong>By:</strong> ${author}</p>
    <p>${content.substring(0, 100)}${content.length > 100 ? '...' : ''}</p>
    <a href="#" class="btn-secondary">Read More</a>
  `;
  container.appendChild(card);
}
async function loadBlogsOnHome() {
  const container = document.getElementById('homeBlogContainer');
  try {
    const response = await fetch('/api/blogs');
    const blogs = await response.json();
    if (blogs.length === 0) {
      container.innerHTML = '<p>No blog posts yet. Be the first to add one!</p>';
      return;
    }
    container.innerHTML = '';
    blogs.forEach(blog => {
      const card = document.createElement('div');
      card.className = 'blog-card';
      card.innerHTML = `
        <h3>${blog.title}</h3>
        <p><strong>By:</strong> ${blog.author}</p>
        <p>${blog.content.substring(0, 100)}${blog.content.length > 100 ? '...' : ''}</p>
        <a href="blog.html" class="btn-secondary">Read More</a>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error('Error loading blogs:', err);
    container.innerHTML = '<p>Could not load blog posts. Please try again later.</p>';
  }
}