import { db } from '../config';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  setDoc,
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  Timestamp,
  increment
} from 'firebase/firestore';

// Collection names
const BLOGS_COLLECTION = 'blogs';
const BLOG_CATEGORIES_COLLECTION = 'blog_categories';

// Blog数据结构
export interface Blog {
  id?: string;
  title: string;
  slug: string;
  content: BlogContent[];
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  updatedAt: string;
  image: string;
  readTime: number;
  status: 'draft' | 'published' | 'archived';
  metaTitle: string;
  metaDescription: string;
  views: number;
  isFeatured: boolean;
  seoKeywords: string[];
  createdAt: string;
}

// Rich text link structure
export interface RichTextLink {
  url: string;
  text: string;
  startIndex: number;
  endIndex: number;
}

// Rich text content structure
export interface RichTextContent {
  text: string;
  links: RichTextLink[];
}

// Blog内容结构 - 支持多种内容类型
export interface BlogContent {
  id: string;
  type: 'heading' | 'paragraph' | 'image' | 'quote' | 'list' | 'code' | 'divider';
  content: string;
  richContent?: RichTextContent; // for rich text with links
  level?: number; // for headings (h1, h2, h3, etc.)
  imageUrl?: string; // for images
  alt?: string; // for images
  caption?: string; // for images
  listItems?: string[]; // for lists
  language?: string; // for code blocks
  order: number; // content order
}

// Blog分类结构
export interface BlogCategory {
  id?: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

// Blog统计数据
export interface BlogStats {
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  totalViews: number;
  totalComments: number;
  mostViewedBlog: string;
  recentBlogs: Blog[];
}

// ========== Blog CRUD Operations ==========

export const getBlogs = async (options: {
  status?: 'draft' | 'published' | 'archived';
  category?: string;
  limit?: number;
  page?: number;
  search?: string;
} = {}): Promise<{ blogs: Blog[]; totalCount: number }> => {
  try {
    let q = query(collection(db, BLOGS_COLLECTION));
    
    // Apply filters
    if (options.status) {
      q = query(q, where('status', '==', options.status));
    }
    
    if (options.category) {
      q = query(q, where('category', '==', options.category));
    }
    
    // Get all documents first without ordering
    const snapshot = await getDocs(q);
    const blogs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Blog));
    
    // Sort by publishedAt in memory (to avoid Firestore index issues)
    const sortedBlogs = blogs.sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA; // descending order
    });
    
    // Filter by search if provided
    let filteredBlogs = sortedBlogs;
    if (options.search) {
      const searchLower = options.search.toLowerCase();
      filteredBlogs = sortedBlogs.filter(blog => 
        blog.title.toLowerCase().includes(searchLower) ||
        (blog.excerpt && blog.excerpt.toLowerCase().includes(searchLower)) ||
        (blog.tags && blog.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }
    
    // Apply pagination
    const page = options.page || 1;
    const limitValue = options.limit || 10;
    const startIndex = (page - 1) * limitValue;
    const endIndex = startIndex + limitValue;
    
    return {
      blogs: filteredBlogs.slice(startIndex, endIndex),
      totalCount: filteredBlogs.length
    };
  } catch (error) {
    console.error('Error fetching blogs:', error);
    // Return empty result instead of throwing
    return {
      blogs: [],
      totalCount: 0
    };
  }
};

export const getBlogById = async (id: string): Promise<Blog | null> => {
  try {
    const docRef = doc(db, BLOGS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Blog;
    }
    return null;
  } catch (error) {
    console.error('Error fetching blog by ID:', error);
    throw error;
  }
};

export const getBlogBySlug = async (slug: string): Promise<Blog | null> => {
  try {
    const q = query(collection(db, BLOGS_COLLECTION), where('slug', '==', slug));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as Blog;
    }
    return null;
  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    throw error;
  }
};

export const createBlog = async (blog: Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    // 获取当前最大的博客编号
    const blogsSnapshot = await getDocs(collection(db, BLOGS_COLLECTION));
    let maxNumber = 0;
    
    blogsSnapshot.docs.forEach(doc => {
      const id = doc.id;
      // 检查是否符合 blog_XXXX 格式
      if (id.startsWith('blog_')) {
        const numberPart = id.substring(5); // 获取 blog_ 后面的部分
        const number = parseInt(numberPart, 10);
        if (!isNaN(number) && number > maxNumber) {
          maxNumber = number;
        }
      }
    });
    
    // 生成新的博客ID
    const newNumber = maxNumber + 1;
    const newBlogId = `blog_${String(newNumber).padStart(4, '0')}`;
    
    const now = new Date().toISOString();
    const blogData = {
      ...blog,
      createdAt: now,
      updatedAt: now,
      views: 0
    };
    
    // 使用指定的ID创建文档
    await setDoc(doc(db, BLOGS_COLLECTION, newBlogId), blogData);
    return newBlogId;
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
};

export const updateBlog = async (id: string, blog: Partial<Blog>): Promise<void> => {
  try {
    const docRef = doc(db, BLOGS_COLLECTION, id);
    await updateDoc(docRef, {
      ...blog,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
};

export const deleteBlog = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, BLOGS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
};

export const incrementBlogViews = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, BLOGS_COLLECTION, id);
    await updateDoc(docRef, {
      views: increment(1)
    });
  } catch (error) {
    console.error('Error incrementing blog views:', error);
    throw error;
  }
};

// ========== Blog Category Operations ==========

export const getBlogCategories = async (): Promise<BlogCategory[]> => {
  try {
    const snapshot = await getDocs(collection(db, BLOG_CATEGORIES_COLLECTION));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as BlogCategory));
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    throw error;
  }
};

export const createBlogCategory = async (category: Omit<BlogCategory, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const now = new Date().toISOString();
    const categoryData = {
      ...category,
      createdAt: now,
      updatedAt: now
    };
    
    const docRef = await addDoc(collection(db, BLOG_CATEGORIES_COLLECTION), categoryData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating blog category:', error);
    throw error;
  }
};

export const updateBlogCategory = async (id: string, category: Partial<BlogCategory>): Promise<void> => {
  try {
    const docRef = doc(db, BLOG_CATEGORIES_COLLECTION, id);
    await updateDoc(docRef, {
      ...category,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating blog category:', error);
    throw error;
  }
};

export const deleteBlogCategory = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, BLOG_CATEGORIES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting blog category:', error);
    throw error;
  }
};

// ========== Blog Statistics ==========

export const getBlogStats = async (): Promise<BlogStats> => {
  try {
    const blogsSnapshot = await getDocs(collection(db, BLOGS_COLLECTION));
    const allBlogs = blogsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Blog));
    
    const publishedBlogs = allBlogs.filter(blog => blog.status === 'published');
    const draftBlogs = allBlogs.filter(blog => blog.status === 'draft');
    
    const totalViews = allBlogs.reduce((sum, blog) => sum + (blog.views || 0), 0);
    
    // Get most viewed blog
    const mostViewedBlog = allBlogs.reduce((max, blog) => 
      (blog.views || 0) > (max.views || 0) ? blog : max
    );
    
    // Get recent blogs (last 5 published)
    const recentBlogs = publishedBlogs
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 5);
    
    return {
      totalBlogs: allBlogs.length,
      publishedBlogs: publishedBlogs.length,
      draftBlogs: draftBlogs.length,
      totalViews,
      totalComments: 0, // TODO: Implement comments
      mostViewedBlog: mostViewedBlog.title,
      recentBlogs
    };
  } catch (error) {
    console.error('Error fetching blog stats:', error);
    throw error;
  }
};

// ========== Utility Functions ==========

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const calculateReadTime = (content: BlogContent[]): number => {
  const wordsPerMinute = 200;
  const totalWords = content.reduce((count, item) => {
    if (item.type === 'paragraph' || item.type === 'heading') {
      // Use rich text content if available, otherwise use plain content
      const textContent = item.richContent?.text || item.content;
      return count + textContent.split(' ').length;
    }
    return count;
  }, 0);
  
  return Math.ceil(totalWords / wordsPerMinute);
};

export const extractExcerpt = (content: BlogContent[], maxLength: number = 160): string => {
  const textContent = content
    .filter(item => item.type === 'paragraph' || item.type === 'heading')
    .map(item => {
      // Use rich text content if available, otherwise use plain content
      return item.richContent?.text || item.content;
    })
    .join(' ');
  
  return textContent.length > maxLength 
    ? textContent.substring(0, maxLength) + '...'
    : textContent;
};