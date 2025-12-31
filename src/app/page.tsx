"use client"
import React from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { useRouter } from 'next/navigation'
import { Search, Mic, Wrench, Shield, Users, Zap } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  
  const features = [
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Find torque specs, bolt sizes, and technical data instantly',
      accent: 'text-wrench-accent'
    },
    {
      icon: Mic,
      title: 'Voice Control',
      description: 'Hands-free queries while you work on your bike',
      accent: 'text-wrench-accent'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Built by riders, for riders. Share and verify specs together',
      accent: 'text-wrench-chrome'
    },
    {
      icon: Shield,
      title: 'Verified Data',
      description: 'Community-submitted specs with moderation and verification',
      accent: 'text-wrench-accent-light'
    }
  ]
  
  return (
    <div className="min-h-screen">
      {/* Hero Section - Edgy and Bold */}
      <section className="relative overflow-hidden py-20 md:py-32 border-b-2 border-wrench-chrome/20">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff4500' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-block mb-6 p-4 rounded-lg bg-wrench-accent/10 border-2 border-wrench-accent/30"
            >
              <Wrench className="w-16 h-16 md:w-20 md:h-20 text-wrench-accent stroke-[1.5]" />
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 uppercase tracking-tight">
              <span className="gradient-text">WrenchMC</span>
            </h1>
            <p className="text-xl md:text-2xl text-wrench-text-secondary mb-4 max-w-2xl mx-auto font-semibold">
              Your community-driven technical specs database for
            </p>
            <p className="text-2xl md:text-3xl lg:text-4xl font-black text-wrench-accent mb-12 uppercase tracking-wider">
              Harley-Davidson Motorcycles
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button 
                size="lg" 
                onClick={() => router.push('/search')}
                className="min-w-[200px]"
              >
                <Search className="w-5 h-5 inline mr-2" />
                Search Specs
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => router.push('/voice')}
                className="min-w-[200px]"
              >
                <Mic className="w-5 h-5 inline mr-2" />
                Voice Search
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 uppercase tracking-tight">
              Everything you need to <span className="gradient-text">wrench smarter</span>
            </h2>
            <p className="text-xl text-wrench-text-secondary max-w-2xl mx-auto font-semibold">
              Built by the community, verified by experts, designed for the garage
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} delay={index * 0.1} className="text-center border-wrench-chrome/30">
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 10 }}
                    className={`inline-flex p-4 rounded-lg bg-wrench-accent/10 border-2 border-wrench-accent/30 mb-4 ${feature.accent}`}
                  >
                    <Icon className="w-8 h-8 md:w-10 md:h-10 stroke-[2]" />
                  </motion.div>
                  <h3 className="text-xl md:text-2xl font-black mb-2 uppercase tracking-wide text-wrench-text-primary">{feature.title}</h3>
                  <p className="text-wrench-text-secondary text-sm font-medium">{feature.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="text-center bg-wrench/90 border-2 border-wrench-accent/40 shadow-glow-lg">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Zap className="w-12 h-12 md:w-16 md:h-16 text-wrench-accent mx-auto mb-4 stroke-[2]" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 uppercase tracking-tight">
              Ready to <span className="gradient-text">get started?</span>
            </h2>
            <p className="text-wrench-text-secondary mb-8 text-lg font-semibold">
              Join the community and start finding the specs you need, or contribute your knowledge
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => router.push('/search')}>
                Start Searching
              </Button>
              <Button size="lg" variant="outline" onClick={() => router.push('/specs/new')}>
                Submit a Spec
              </Button>
            </div>
          </Card>
        </motion.div>
      </section>
    </div>
  )
}
