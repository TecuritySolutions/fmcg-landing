'use client';
import React, { useState, useEffect } from 'react';
import { BarChart3, Brain, TrendingUp, Zap, Target, Clock, Sparkles, CheckCircle2, ArrowRight, Globe2, Shield, LineChart } from 'lucide-react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const heroStats = [
    { value: '92%', label: 'Prediction Accuracy' },
    { value: '90%', label: 'Time Reduction' },
    { value: '1000+', label: 'Outlets Analyzed' },
    { value: '60%', label: 'Cost Savings' }
  ];

  const features = [
    {
      icon: Target,
      title: 'Smart Scoring',
      description: 'AI algorithm evaluate outlets on a 0-30 scale, analyzing location, demographics, competition, and 13 other critical factors.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: BarChart3,
      title: 'Narrative Reports',
      description: 'AI-generated insights highlight strengths, weaknesses, and opportunities with human-readable recommendations.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      title: 'Real-Time Analysis',
      description: 'Evaluate thousands of outlets with 2.3-second average processing time per location.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Globe2,
      title: 'Deep Market Insights',
      description: 'Analyze spending power, population density, competition index, and CIBIL scores for complete market understanding.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Sparkles,
      title: 'Customizable Framework',
      description: 'Adapt the system to your specific business needs with configurable parameters and weighted scoring models.',
      color: 'from-violet-500 to-purple-500'
    },
    {
      icon: TrendingUp,
      title: 'Custom Whitelabel solution',
      description: 'Models improve over time with new data, delivering increasingly accurate predictions and recommendations.',
      color: 'from-pink-500 to-rose-500'
    }
  ];

  const steps = [
    {
      number: '1',
      title: 'Data Collection',
      description: 'Gather outlet parameters including location, demographics, financial data, and operational metrics'
    },
    {
      number: '2',
      title: 'AI Processing',
      description: 'Advanced ML algorithms analyze data using Random Forest, Gradient Boosting, and Neural Networks'
    },
    {
      number: '3',
      title: 'Score Generation',
      description: 'Receive precise 0-30 retail scores with R²=0.81 correlation to expert evaluations'
    },
    {
      number: '4',
      title: 'Actionable Reports',
      description: 'Get comprehensive narrative reports with strategic recommendations and risk assessments'
    }
  ];

  const results = [
    { metric: '92%', label: 'Classification Accuracy', icon: Target },
    { metric: '0.81', label: 'R² Score Correlation', icon: LineChart },
    { metric: '82%', label: 'Expert Agreement', icon: Shield },
    { metric: '2.3s', label: 'Processing Speed', icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-lg shadow-md' : 'bg-transparent text-white'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Brain className={`w-8 h-8 ${scrolled ? 'text-purple-600' : 'text-white'}`} />
            <span className={`text-2xl font-bold ${scrolled ? 'text-gray-900' : 'text-white'}`}>
              RetailScore AI
            </span>
          </div>
          <div className="hidden md:flex space-x-8 items-center">
            <a href="#features" className={`hover:text-purple-600 transition ${scrolled ? 'text-gray-700' : 'text-white/90'}`}>Features</a>
            <a href="#how-it-works" className={`hover:text-purple-600 transition ${scrolled ? 'text-gray-700' : 'text-white/90'}`}>How It Works</a>
            <a href="#results" className={`hover:text-purple-600 transition ${scrolled ? 'text-gray-700' : 'text-white/90'}`}>Results</a>
            <button className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:shadow-lg transition">
              Request Demo
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white pt-32 pb-24 px-6 overflow-hidden">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20px 20px, white 2px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        {/* Floating Gradient Orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Transform Your Retail Distribution with AI
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-purple-100 font-light">
              Intelligent retail outlet scoring powered by machine learning and advanced analytics. 
              Make data-driven decisions in seconds, not weeks.
            </p>
            <button className="bg-white text-purple-600 px-10 py-5 rounded-full text-lg font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              Request a Demo
            </button>

            {/* Hero Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {heroStats.map((stat, idx) => (
                <div 
                  key={idx}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
                >
                  <div className="text-4xl font-extrabold mb-2">{stat.value}</div>
                  <div className="text-sm text-purple-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Comprehensive Retail Intelligence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform analyzes 16 critical parameters to deliver actionable insights for every retail outlet
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              const isActive = activeFeature === idx;
              return (
                <div 
                  key={idx}
                  className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 ${
                    isActive ? 'ring-2 ring-purple-500 transform scale-105' : ''
                  }`}
                  onMouseEnter={() => setActiveFeature(idx)}
                >
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              From data to decisions in four simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                    {step.number}
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-1/2 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600"
                         style={{width: 'calc(100% + 2rem)', transform: 'translateX(2.5rem)'}}></div>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section id="results" className="py-24 px-6 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Proven Results
            </h2>
            <p className="text-xl text-purple-200">
              Validated across 1,000+ outlets in Ahmedabad, Mumbai and Delhi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {results.map((result, idx) => {
              const Icon = result.icon;
              return (
                <div 
                  key={idx}
                  className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 text-center"
                >
                  <Icon className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                  <div className="text-5xl font-extrabold mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {result.metric}
                  </div>
                  <p className="text-purple-200">{result.label}</p>
                </div>
              );
            })}
          </div>

          {/* Additional Stats */}
          <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
              <div className="text-4xl font-bold text-purple-400 mb-2">16</div>
              <div className="text-purple-200">Analysis Parameters</div>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
              <div className="text-4xl font-bold text-pink-400 mb-2">3 Cities</div>
              <div className="text-purple-200">Ahmedabad, Mumbai, Delhi</div>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
              <div className="text-4xl font-bold text-blue-400 mb-2">100%</div>
              <div className="text-purple-200">Data-Driven Decisions</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Ready to Optimize Your Distribution Strategy?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join leading FMCG companies using AI-driven retail scoring to make smarter, faster decisions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-10 py-4 rounded-full text-lg font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2">
              <span>Get Started Today</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border-2 border-purple-600 text-purple-600 px-10 py-4 rounded-full text-lg font-bold hover:bg-purple-50 transition-all duration-300">
              View Documentation
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Brain className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold">RetailScore AI</span>
            </div>
            <div className="text-gray-400">
              © 2025 RetailScore AI. Powered by Tecurity
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}