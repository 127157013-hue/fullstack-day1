const express = require('express');
const path = require('path');
const app = express();
const PORT = 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));
let blogPosts = [
  { id: 1, title: 'Getting Started with Full-Stack Development', author: 'Admin', content: 'A beginner-friendly guide...' }
];
app.get('/', (req, res) => {
  res.send('Hello World! Backend server is running.');
});
app.get('/api/blogs', (req, res) => {
  res.json(blogPosts);
});
app.get('/api/blogs/:id', (req, res) => {
  const blog = blogPosts.find(b => b.id === parseInt(req.params.id));
  if (!blog) {
    return res.status(404).json({ message: 'Blog post not found' });
  }
  res.json(blog);
});
app.post('/api/blogs', (req, res) => {
  const { title, author, content } = req.body;
  if (!title || !author || !content) {
    return res.status(400).json({ message: 'Title, author, and content are required' });
  }
  const newBlog = {
    id: blogPosts.length + 1,
    title,
    author,
    content
  };
  blogPosts.push(newBlog);
  res.status(201).json({ message: 'Blog post created successfully', blog: newBlog });
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});