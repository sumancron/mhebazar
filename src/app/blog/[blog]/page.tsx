// src/app/blog/[blog]/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  User,
  ArrowLeft,
  Share2,
  Bookmark,
  Clock,
  Tag,
  Loader2,
  Menu,
  X,
  ChevronRight,
  Eye,
  Heart,
  MessageCircle
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

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

const SingleBlogPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const blogUrl = params.blog as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeSection, setActiveSection] = useState<string>("");
  const [tocOpen, setTocOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [views] = useState(Math.floor(Math.random() * 1000) + 100);
  const [likes] = useState(Math.floor(Math.random() * 50) + 10);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (blogUrl) {
      fetchBlog();
      fetchRelatedBlogs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogUrl]);

  useEffect(() => {
    if (blog) {
      generateTOC();
    }
  }, [blog]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-toc-id]');
      let currentSection = '';

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          currentSection = section.getAttribute('data-toc-id') || '';
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocItems]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError(null);

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

  const generateTOC = () => {
    if (!blog) return;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = blog.description;

    const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const items: TOCItem[] = [];

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      const text = heading.textContent || '';
      const id = `heading-${index}`;

      items.push({ id, text, level });
    });

    setTocItems(items);
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
    // Corrected URL based on the user's provided information
    const fileName = imageName?.split('/').pop();
    if (fileName) {
        return `https://mheback.onrender.com/media/blog/image/${fileName}`;
    }
    // Fallback if fileName is not available
    return "/api/placeholder/800/400";
  };

  const estimateReadingTime = (html: string) => {
    const text = html.replace(/<[^>]*>/g, '');
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const processHtmlContent = (html: string) => {
    // Corrected URL for embedded images within the HTML description
    const processedHtml = html.replace(
      /src="([^"]*\.(jpg|jpeg|png|gif|webp))"/gi,
      (match, imageName) => {
        const fileName = imageName.split('/').pop();
        return `src="https://mheback.onrender.com/media/blog/image/${fileName}"`;
      }
    );

    // Add IDs to headings for TOC
    return processedHtml.replace(
      /<(h[1-6])([^>]*)>(.*?)<\/h[1-6]>/gi,
      (match, tag, attrs, content, offset) => {
        const index = (processedHtml.substring(0, offset).match(/<h[1-6]/gi) || []).length;
        return `<${tag}${attrs} id="heading-${index}" data-toc-id="heading-${index}">${content}</${tag}>`;
      }
    );
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTocOpen(false);
    }
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
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f5fbff] to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#5da031] mx-auto mb-4" />
          <p className="text-gray-600">Loading amazing content...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f5fbff] to-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error || "Blog not found"}</p>
            <div className="space-y-3">
              <Button onClick={() => router.back()} className="w-full bg-[#5da031] hover:bg-[#4a8728]">
                Go Back
              </Button>
              <Link href="/blog">
                <Button variant="outline" className="w-full border-[#5da031] text-[#5da031] hover:bg-[#5da031] hover:text-white">
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
    <div className="min-h-screen bg-gradient-to-br from-[#f5fbff] via-white to-[#f5fbff]">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b-2 border-[#5da031]/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/blog">
              <Button variant="ghost" className="text-[#5da031] hover:bg-[#5da031]/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blogs
              </Button>
            </Link>

            {tocItems.length > 0 && (
              <Button
                onClick={() => setTocOpen(!tocOpen)}
                variant="outline"
                size="sm"
                className="md:hidden border-[#5da031] text-[#5da031]"
              >
                <Menu className="h-4 w-4 mr-2" />
                Contents
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Table of Contents - Desktop */}
          {tocItems.length > 0 && (
            <div className="hidden lg:block lg:w-64 xl:w-72">
              <div className="sticky top-24">
                <Card className="shadow-lg border-l-4 border-l-[#5da031]">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                      <Menu className="h-5 w-5 mr-2 text-[#5da031]" />
                      Table of Contents
                    </h3>
                    <nav className="space-y-2">
                      {tocItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => scrollToSection(item.id)}
                          className={`block w-full text-left py-2 px-3 rounded-lg transition-all duration-200 ${activeSection === item.id
                              ? 'bg-[#5da031] text-white shadow-md'
                              : 'text-gray-600 hover:bg-[#5da031]/10 hover:text-[#5da031]'
                            }`}
                          style={{ paddingLeft: `${(item.level - 1) * 12 + 12}px` }}
                        >
                          <span className="text-sm font-medium truncate block">
                            {item.text}
                          </span>
                        </button>
                      ))}
                    </nav>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Mobile TOC Overlay */}
          {tocOpen && (
            <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
              <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-gray-900">Table of Contents</h3>
                    <Button onClick={() => setTocOpen(false)} variant="ghost" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <nav className="space-y-2">
                    {tocItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`block w-full text-left py-2 px-3 rounded-lg transition-all duration-200 ${activeSection === item.id
                            ? 'bg-[#5da031] text-white'
                            : 'text-gray-600 hover:bg-[#5da031]/10'
                          }`}
                        style={{ paddingLeft: `${(item.level - 1) * 12 + 12}px` }}
                      >
                        <span className="text-sm font-medium">
                          {item.text}
                        </span>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <article className="flex-1 max-w-4xl">
            {/* Article Header */}
            <header className="mb-8">
              <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-t-[#5da031]">
                <div className="mb-6">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <Badge className="bg-[#5da031] hover:bg-[#4a8728] text-white px-4 py-1">
                      {blog.blog_category}
                    </Badge>
                    {blog.tags && (
                      <div className="flex items-center bg-[#f1bf25]/10 text-[#f1bf25] px-3 py-1 rounded-full">
                        <Tag className="h-3 w-3 mr-1" />
                        <span className="text-sm font-medium">{blog.tags}</span>
                      </div>
                    )}
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6 bg-gradient-to-r from-gray-900 to-[#5da031] bg-clip-text text-transparent">
                  {blog.blog_title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
                  {blog.author_name && (
                    <div className="flex items-center bg-gray-50 px-3 py-2 rounded-full">
                      <User className="h-4 w-4 mr-2 text-[#5da031]" />
                      <span className="font-medium">{blog.author_name}</span>
                    </div>
                  )}

                  <div className="flex items-center bg-gray-50 px-3 py-2 rounded-full">
                    <Calendar className="h-4 w-4 mr-2 text-[#5da031]" />
                    {formatDate(blog.created_at)}
                  </div>

                  <div className="flex items-center bg-gray-50 px-3 py-2 rounded-full">
                    <Clock className="h-4 w-4 mr-2 text-[#5da031]" />
                    {estimateReadingTime(blog.description)} min read
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {views} views
                  </div>
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-1" />
                    {likes} likes
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Comments
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    onClick={handleShare}
                    className="bg-[#5da031] hover:bg-[#4a8728] text-white"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button
                    onClick={handleBookmark}
                    variant="outline"
                    className={`border-[#f1bf25] ${isBookmarked ? 'bg-[#f1bf25] text-white' : 'text-[#f1bf25] hover:bg-[#f1bf25] hover:text-white'}`}
                  >
                    <Bookmark className={`h-4 w-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
                    {isBookmarked ? 'Saved' : 'Save'}
                  </Button>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            {blog.image1 && (
              <div className="mb-8">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <Image
                    src={getImageUrl(blog.image1)}
                    alt={blog.blog_title}
                    width={800}
                    height={400}
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/api/placeholder/800/400";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </div>
            )}

            {/* Article Content */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-l-4 border-l-[#5da031]">
              {blog.description1 && (
                <div className="text-xl text-gray-700 leading-relaxed mb-8 p-6 bg-gradient-to-r from-[#5da031]/5 to-[#f1bf25]/5 rounded-xl border border-[#5da031]/20">
                  <div className="flex items-start">
                    <div className="w-1 bg-[#5da031] rounded-full mr-4 flex-shrink-0" style={{ height: '1.5em' }} />
                    <p className="font-medium italic">{blog.description1}</p>
                  </div>
                </div>
              )}

              <div
                ref={contentRef}
                className="prose prose-lg max-w-none 
                  prose-headings:text-gray-900 prose-headings:font-bold prose-headings:scroll-mt-24
                  prose-h1:text-3xl prose-h1:text-[#5da031] prose-h1:border-b-2 prose-h1:border-[#5da031]/20 prose-h1:pb-2
                  prose-h2:text-2xl prose-h2:text-[#5da031] prose-h2:border-b prose-h2:border-[#5da031]/20 prose-h2:pb-2
                  prose-h3:text-xl prose-h3:text-[#5da031]
                  prose-p:text-gray-700 prose-p:leading-relaxed 
                  prose-a:text-[#5da031] prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                  prose-strong:text-gray-900 prose-strong:font-bold
                  prose-ul:text-gray-700 prose-ol:text-gray-700
                  prose-li:mb-2
                  prose-img:rounded-xl prose-img:shadow-lg prose-img:border prose-img:border-gray-200
                  prose-blockquote:border-l-4 prose-blockquote:border-[#f1bf25] prose-blockquote:bg-[#f1bf25]/5 prose-blockquote:italic
                  prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-[#5da031]"
                dangerouslySetInnerHTML={{
                  __html: processHtmlContent(blog.description)
                }}
              />
            </div>

            {/* Article Footer */}
            <footer className="bg-white rounded-2xl shadow-xl p-6 mb-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Last updated:</span> {formatDate(blog.updated_at)}
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    size="sm"
                    className="border-[#5da031] text-[#5da031] hover:bg-[#5da031] hover:text-white"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Article
                  </Button>
                </div>
              </div>
            </footer>

            {/* Related Blogs */}
            {relatedBlogs.length > 0 && (
              <section className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Related Articles</h2>
                  <p className="text-gray-600">Discover more amazing content</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedBlogs.slice(0, 3).map((relatedBlog) => (
                    <Link key={relatedBlog.id} href={`/blog/${relatedBlog.blog_url}`}>
                      <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-[#5da031]/20">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <Image
                            src={getImageUrl(relatedBlog.image1)}
                            alt={relatedBlog.blog_title}
                            width={300}
                            height={200}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/api/placeholder/300/200";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <CardContent className="p-6">
                          <h3 className="font-bold text-gray-900 group-hover:text-[#5da031] transition-colors line-clamp-2 mb-3 text-lg">
                            {relatedBlog.blog_title}
                          </h3>
                          <p className="text-gray-600 line-clamp-2 mb-4">
                            {relatedBlog.description1}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-xs text-gray-500">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(relatedBlog.created_at)}
                            </div>
                            <ChevronRight className="h-4 w-4 text-[#5da031] group-hover:translate-x-1 transition-transform duration-200" />
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
      </div>
    </div>
  );
};

export default SingleBlogPage;