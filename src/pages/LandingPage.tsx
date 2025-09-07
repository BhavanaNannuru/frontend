import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { 
  Calendar, 
  Clock, 
  Shield, 
  Users, 
  FileText, 
  Bell,
  Stethoscope,
  CheckCircle,
  ArrowRight,
  Quote,
  Star,
  ChevronLeft,
  ChevronRight,
  Play
} from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook

const LandingPage = () => {
  const { user } = useAuth(); // Access the user state
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const features = [
    {
      icon: Calendar,
      title: 'Easy Appointment Booking',
      description: 'Book appointments with your preferred healthcare providers with just a few clicks.'
    },
    {
      icon: Clock,
      title: 'Real-time Scheduling',
      description: 'View real-time availability and get instant confirmation for your appointments.'
    },
    {
      icon: FileText,
      title: 'Medical Records',
      description: 'Securely store and access your medical history and documents from anywhere.'
    },
    {
      icon: Bell,
      title: 'Smart Reminders',
      description: 'Never miss an appointment with automated email and SMS notifications.'
    },
    {
      icon: Shield,
      title: 'HIPAA Compliant',
      description: 'Your data is protected with enterprise-grade security and privacy measures.'
    },
    {
      icon: Users,
      title: 'Provider Network',
      description: 'Connect with a wide network of qualified healthcare professionals.'
    }
  ];

  const featuresRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const benefits = [
    'Reduce waiting times',
    '24/7 appointment booking',
    'Secure patient data management',
    'Automated appointment reminders',
    'Easy rescheduling and cancellations',
    'Mobile-responsive design'
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Cardiologist',
      image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      quote: 'HealthCare+ has revolutionized how I manage my practice. The scheduling system is intuitive and my patients love the convenience.',
      rating: 5
    },
    {
      name: 'Maria Rodriguez',
      role: 'Patient',
      image: 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      quote: 'Booking appointments has never been easier. I can manage all my family\'s healthcare needs from one simple app.',
      rating: 5
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Pediatrician',
      image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      quote: 'The patient communication features have improved my practice efficiency by 40%. Highly recommended!',
      rating: 5
    }
  ];


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <header className="relative w-full z-10 bg-gradient-to-r from-blue-500 via-blue-800 to-indigo-800 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo & Brand */}
            <div className="flex items-center space-x-3">
              {/* Using a simple, clean SVG icon for a modern feel */}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-8 w-8 text-white"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                <path d="M3.2 11H9l1.5-6 2 10L16 8h2.8" />
              </svg>

              <span className="text-2xl font-bold tracking-wide text-white">
                HealthCare+
              </span>
            </div>

            {/* Conditional Rendering for User Status */}
            {user ? (
              <div className="flex space-x-6 items-center">
                <span className="text-blue-200 font-medium text-base">
                  Welcome back, {user.name}!
                </span>
                <Link
                  to="/dashboard"
                  className="px-5 py-2 font-semibold text-sm rounded-full bg-white text-blue-600 transition-colors duration-200 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                >
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              <div className="flex space-x-4 items-center">
                <Link
                  to="/login"
                  className="text-white hover:text-blue-200 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 font-semibold text-sm rounded-full bg-white text-blue-600 transition-colors duration-200 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section*/}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-900 to-indigo-900">          
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute top-20 left-10 w-20 h-20 bg-red-400/10 rounded-full blur-xl animate-pulse"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          />
          <div 
            className="absolute top-40 right-20 w-32 h-32 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-1000"
            style={{ transform: `translateY(${scrollY * 0.2}px)` }}
          />
          <div 
            className="absolute bottom-20 left-1/4 w-16 h-16 bg-cyan-400/20 rounded-full blur-xl animate-pulse delay-2000"
            style={{ transform: `translateY(${scrollY * 0.4}px)` }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                  <span className="block animate-fade-in-up">Modern</span>
                  <span className="block animate-fade-in-up delay-200 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Healthcare
                  </span>
                  <span className="block animate-fade-in-up delay-400 text-4xl md:text-5xl text-blue-200">
                    Made Simple
                  </span>
                </h1>
                <p className="text-xl text-blue-100 leading-relaxed animate-fade-in-up delay-600 max-w-lg">
                  Experience the future of healthcare management with our HealthCare+ platform. 
                  Seamless connect between patients and providers in one intelligent ecosystem.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in-up delay-800">
                <Link
                  to={user ? "/dashboard" : "/register"}
                  className="group bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:shadow-2xl transition-all duration-300 flex items-center justify-center hover:scale-105"
                >
                  {user ? "Go to Dashboard" : "Start Your Journey"}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
               
              </div>

              {/* Stats Preview */}
              <div className="grid grid-cols-3 gap-6 pt-8 animate-fade-in-up delay-1000">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">50K+</div>
                  <div className="text-blue-200 text-sm">Patients</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">2K+</div>
                  <div className="text-blue-200 text-sm">Providers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">99.9%</div>
                  <div className="text-blue-200 text-sm">Uptime</div>
                </div>
              </div>
            </div>

            {/* Interactive Dashboard Preview */}
            <div className="relative animate-fade-in-up delay-400">
              <div className="relative transform hover:scale-105 transition-transform duration-500">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-lg">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-900">Today's Schedule</h3>
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        { doctor: 'Dr. Sarah Smith', time: '2:00 PM', status: 'confirmed', color: 'green' },
                        { doctor: 'Dr. Michael Johnson', time: '4:30 PM', status: 'pending', color: 'yellow' },
                        { doctor: 'Dr. Emily Davis', time: '6:00 PM', status: 'upcoming', color: 'blue' }
                      ].map((appointment, index) => (
                        <div key={index} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-300 cursor-pointer group">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full bg-${appointment.color}-500 group-hover:scale-125 transition-transform duration-300`}></div>
                              <div>
                                <p className="font-semibold text-gray-900">{appointment.doctor}</p>
                                <p className="text-sm text-gray-600">{appointment.time}</p>
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${appointment.color}-100 text-${appointment.color}-800`}>
                              {appointment.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Features Section Old
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Better Healthcare
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools patients and providers need 
              to manage healthcare efficiently and securely.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section> */}


        {/* Feature Section */}
      <section ref={featuresRef} className="py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-blue-500 to-indigo-800 bg-clip-text text-transparent">
              Everything You Need for Better Healthcare
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover how our cutting-edge technology transforms the healthcare experience 
              for both patients and providers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl"
                     style={{ backgroundImage: `linear-gradient(135deg, ${'from-blue-500 to-blue-600'.split(' ')[1]}, ${'from-blue-500 to-blue-600'.split(' ')[3]})` }}></div>
                
                <div className="relative">
                  <div className={`w-16 h-16 bg-gradient-to-r ${'from-blue-500 to-blue-600'} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Benefits Section */}
      <section className="py-20 bg-white flex items-center justify-center">
  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-blue-500 to-indigo-800 bg-clip-text text-transparent">
              Why Choose HealthCare+?
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Trusted by thousands of patients and healthcare providers — HealthCare+ makes managing healthcare simple, efficient, and reliable.
            </p>
          </div>


    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div className="bg-gray-50 p-6 rounded-2xl shadow-sm flex flex-col items-center text-center">
        <CheckCircle className="h-8 w-8 text-green-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900">Seamless Appointments</h3>
        <p className="text-gray-600 mt-2">Book, manage, and track appointments effortlessly with a user-friendly system.</p>
      </div>

      <div className="bg-gray-50 p-6 rounded-2xl shadow-sm flex flex-col items-center text-center">
        <CheckCircle className="h-8 w-8 text-green-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900">Secure Records</h3>
        <p className="text-gray-600 mt-2">Your medical records are encrypted and always accessible when you need them.</p>
      </div>

      <div className="bg-gray-50 p-6 rounded-2xl shadow-sm flex flex-col items-center text-center">
        <CheckCircle className="h-8 w-8 text-green-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900">Trusted by Experts</h3>
        <p className="text-gray-600 mt-2">Doctors and providers trust HealthCare+ to streamline their practice workflows.</p>
      </div>
    </div>
  </div>
</section>


  {/* Testimonials Carousel */}
  <section className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-blue-500 to-indigo-800 bg-clip-text text-transparent">
              What Our Users Say
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Trusted by healthcare professionals and patients worldwide
            </p>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 to-purple-50 p-12">
              <div className="flex transition-transform duration-500 ease-in-out"
                   style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}>
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <div className="max-w-4xl mx-auto text-center">
                      <Quote className="h-12 w-12 text-blue-400 mx-auto mb-6" />
                      <blockquote className="text-2xl md:text-3xl font-medium text-gray-900 mb-8 leading-relaxed">
                        "{testimonial.quote}"
                      </blockquote>
                      <div className="flex items-center justify-center space-x-4">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="text-left">
                          <div className="font-semibold text-gray-900 text-lg">{testimonial.name}</div>
                          <div className="text-gray-600">{testimonial.role}</div>
                          <div className="flex space-x-1 mt-1">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Controls */}
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-blue-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Stethoscope className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold">HealthCare+</span>
              </div>
              <p className="text-gray-400">
                Transforming healthcare through technology and innovation.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/features" className="hover:text-white">Features</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white">About</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link to="/docs" className="hover:text-white">Documentation</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 HealthCare+. All rights reserved.</p>
          </div>
        </div>
      </footer>


    </div>
  );
};

export default LandingPage;