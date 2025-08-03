// components/BlogCarousel.tsx
'use client';

import * as React from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ArrowUpRight } from 'lucide-react';

// Define the structure of a blog post based on your API response
interface BlogPost {
  id: number;
  blog_title: string;
  image1: string; // Updated from 'image' to 'image1'
}

// Define the structure of the API response
interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: BlogPost[];
}

export function BlogCarousel() {
  const [blogs, setBlogs] = React.useState<BlogPost[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Fetch data from the 'blog-list-create' endpoint
        const response = await api.get<ApiResponse>('/blogs/');

        // The blog posts are in the 'results' array
        if (response.data && response.data.results) {
          setBlogs(response.data.results);
        } else {
          throw new Error("Invalid API response structure");
        }

      } catch (err) {
        console.error('Failed to fetch blogs:', err);
        setError('Failed to load blogs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    // A simple loading state skeleton
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-8">
        <div className="flex space-x-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex-1 p-1">
              <div className="bg-slate-200 rounded-lg h-80 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="w-full mx-auto px-4 py-8">
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2">
          {blogs.map((blog) => (
            <CarouselItem key={blog.id} className="pl-2 md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card className="bg-slate-100 border-none rounded-lg overflow-hidden h-full flex flex-col">
                  <CardContent className="flex flex-col p-0 flex-grow">
                    <div className="relative w-full h-48">
                      <Image
                        src={blog.image1} // Updated field
                        alt={blog.blog_title} // Updated field
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-6 w-full text-left flex flex-col flex-grow">
                      <p className="font-semibold text-lg text-gray-800 flex-grow">
                        {blog.blog_title} {/* Updated field */}
                      </p>
                      {/* Using a generic "Read More" since category name is not in the object */}
                      <Link
                        // Link to the 'blog-detail' page using the blog's ID
                        href={`/blogs/${blog.id}`}
                        className="text-green-600 font-semibold inline-flex items-center gap-1 group mt-4"
                      >
                        Read More
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-[-20px] top-1/2 -translate-y-1/2 sm:flex hidden" />
        <CarouselNext className="absolute right-[-20px] top-1/2 -translate-y-1/2 sm:flex hidden" />
      </Carousel>
    </div>
  );
}