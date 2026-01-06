'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { MessageSquare, Plus, Clock, User, Pin } from 'lucide-react'
import Link from 'next/link'

export default function ForumPage() {
  const { data: session } = useSession()
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [])

  async function loadPosts() {
    setLoading(true)
    try {
      const res = await fetch('/api/forum/posts')
      const data = await res.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error('Failed to load posts:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <div className="inline-flex p-4 rounded-2xl bg-gradient-accent/20 mb-4">
              <MessageSquare className="w-8 h-8 text-wrench-accent" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Community <span className="gradient-text">Forum</span>
            </h1>
            <p className="text-xl text-wrench-chrome-dark">
              Share tips, ask questions, and learn from experienced mechanics
            </p>
          </div>
          {session && (
            <Link href="/forum/new">
              <Button size="lg">
                <Plus className="w-5 h-5 mr-2" />
                New Post
              </Button>
            </Link>
          )}
        </motion.div>

        {/* Posts List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="animate-pulse h-32" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-wrench-chrome-dark mb-4">No posts yet. Be the first to start a discussion!</p>
            {session ? (
              <Link href="/forum/new">
                <Button>Create First Post</Button>
              </Link>
            ) : (
              <p className="text-sm text-wrench-chrome-dark">Sign in to create a post</p>
            )}
          </Card>
        ) : (
          <div className="space-y-4">
            {posts.map((post, i) => (
              <Link key={post.id} href={`/forum/${post.id}`}>
                <Card delay={i * 0.05} className="cursor-pointer hover:border-wrench-accent/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {post.pinned && <Pin className="w-4 h-4 text-wrench-accent" />}
                        <h3 className="text-xl font-bold text-wrench-chrome">{post.title}</h3>
                      </div>
                      <p className="text-wrench-chrome-dark line-clamp-2 mb-4">{post.content}</p>
                      <div className="flex items-center gap-4 text-sm text-wrench-chrome-dark">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {post.author?.name || 'Anonymous'}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {post.replyCount || 0} replies
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

