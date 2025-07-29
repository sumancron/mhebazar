// src/app/blog/[blog]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  User, 
  ArrowLeft, 
  Share2, 
  Bookmark, 
  Clock,
  Tag,
  Loader2
} from "lucide-react";
import api from "@/lib/api";

interface Blog {
  id: number;
  blog_title: string;
  blog_category: string;
  image1: string | null;
  image2: string | null;
  description: string;
  meta_title: string | null;
  description1: string;
  blog_url: string;
  tags: string | null;
  author_name: string | null;
  created_at: string;
  updated_at: string;
}

interface BlogResponse {
  results: Blog[];
}

const SingleBlogPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const blogUrl = params.blog as string;
  
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    if (blogUrl) {
      fetchBlog();
      fetchRelatedBlogs();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogUrl]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Since we need to find by blog_url, we'll search through the blogs
      const response = await api.get<BlogResponse>(`/blogs/`);
      const foundBlog = response.data.results.find(
        (b: Blog) => b.blog_url === blogUrl
      );
      
      if (foundBlog) {
        setBlog(foundBlog);
      } else {
        setError("Blog not found");
      }
    } catch (err) {
      console.error("Error fetching blog:", err);
      setError("Failed to load blog. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async () => {
    try {
      const response = await api.get<BlogResponse>(`/blogs/?limit=3`);
      setRelatedBlogs(response.data.results.filter(b => b.blog_url !== blogUrl));
    } catch (err) {
      console.error("Error fetching related blogs:", err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getImageUrl = (imageName: string | null) => {
    if (!imageName) return "/api/placeholder/800/400";
    return `https://www.mhebazar.in/css/asset/image/${imageName}`;
  };

  const estimateReadingTime = (html: string) => {
    const text = html.replace(/<[^>]*>/g, '');
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const processHtmlContent = (html: string) => {
    // Replace image src attributes to use our image URL function
    const processedHtml = html.replace(
      /src="([^"]*\.(jpg|jpeg|png|gif|webp))"/gi,
      (match, imageName) => {
        const fileName = imageName.split('/').pop();
        return `src="${getImageUrl(fileName)}"`;
      }
    );
    
    return processedHtml;
  };

  const handleShare = async () => {
    if (navigator.share && blog) {
      try {
        await navigator.share({
          title: blog.blog_title,
          text: blog.description1,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">{error || "Blog not found"}</p>
            <div className="space-y-2">
              <Button onClick={() => router.back()}>Go Back</Button>
              <Link href="/blog">
                <Button variant="outline" className="w-full">
                  Browse All Blogs
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <Link href="/blog">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blogs
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Article Header */}
        <header className="mb-8">
          <div className="mb-4">
            <Badge variant="secondary" className="mb-2">
              Category {blog.blog_category}
            </Badge>
            {blog.tags && (
              <div className="flex items-center mt-2">
                <Tag className="h-4 w-4 mr-1 text-gray-500" />
                <span className="text-sm text-gray-600">{blog.tags}</span>
              </div>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            {blog.blog_title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
            {blog.author_name && (
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                {blog.author_name}
              </div>
            )}
            
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {formatDate(blog.created_at)}
            </div>
            
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              {estimateReadingTime(blog.description)} min read
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mb-8">
            <Button onClick={handleShare} variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Bookmark className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>

          <Separator />
        </header>

        {/* Featured Image */}
        {blog.image1 && (
          <div className="mb-8">
            <Image
              src={getImageUrl(blog.image1)}
              alt={blog.blog_title}
              width={800}
              height={400}
              className="w-full h-auto rounded-lg shadow-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/api/placeholder/800/400";
              }}
            />
          </div>
        )}

        {/* Article Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          {blog.description1 && (
            <div className="text-xl text-gray-700 leading-relaxed mb-8 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              {blog.description1}
            </div>
          )}
          
          <div 
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-img:rounded-lg prose-img:shadow-md"
            dangerouslySetInnerHTML={{ 
              __html: processHtmlContent(blog.description)
            }}
          />
        </div>

        {/* Article Footer */}
        <footer className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Last updated: {formatDate(blog.updated_at)}
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={handleShare} variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share Article
              </Button>
            </div>
          </div>
        </footer>

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <section className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBlogs.slice(0, 3).map((relatedBlog) => (
                <Link key={relatedBlog.id} href={`/blog/${relatedBlog.blog_url}`}>
                  <Card className="group hover:shadow-lg transition-all duration-300">
                    <div className="relative overflow-hidden">
                      <Image
                        src={getImageUrl(relatedBlog.image1)}
                        alt={relatedBlog.blog_title}
                        width={300}
                        height={200}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/api/placeholder/300/200";
                        }}
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                        {relatedBlog.blog_title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {relatedBlog.description1}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 mt-2">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(relatedBlog.created_at)}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
};

export default SingleBlogPage;