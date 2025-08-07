'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, getDocs } from 'firebase/firestore';

export default function TestBlogPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogsDirectly = async () => {
      try {
        setLoading(true);
        console.log('Fetching blogs directly from Firestore...');
        
        const blogsCollection = collection(db, 'blogs');
        const snapshot = await getDocs(blogsCollection);
        
        console.log('Snapshot size:', snapshot.size);
        
        const blogData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        console.log('Fetched blogs:', blogData);
        setBlogs(blogData);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogsDirectly();
  }, []);

  if (loading) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-4">Testing Blog Database Connection</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Blog Database Test</h1>
      <p className="mb-4">Found {blogs.length} blogs in the database</p>
      
      <div className="space-y-4">
        {blogs.map((blog, index) => (
          <div key={blog.id} className="border p-4 rounded-lg">
            <h3 className="font-bold">Blog #{index + 1}</h3>
            <p><strong>ID:</strong> {blog.id}</p>
            <p><strong>Title:</strong> {blog.title || 'No title'}</p>
            <p><strong>Status:</strong> {blog.status || 'No status'}</p>
            <p><strong>Author:</strong> {blog.author || 'No author'}</p>
            <p><strong>Category:</strong> {blog.category || 'No category'}</p>
            <p><strong>Published At:</strong> {blog.publishedAt || 'Not set'}</p>
            <p><strong>Created At:</strong> {blog.createdAt || 'Not set'}</p>
            <details className="mt-2">
              <summary className="cursor-pointer text-blue-600">View full data</summary>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                {JSON.stringify(blog, null, 2)}
              </pre>
            </details>
          </div>
        ))}
      </div>
      
      {blogs.length === 0 && (
        <p className="text-gray-600">No blogs found in the database.</p>
      )}
    </div>
  );
}