import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Stethoscope, User, UserCheck, Shield, Phone, GraduationCap, MapPin, Award, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'patient' as 'patient' | 'provider',
    age: '',
    date_of_birth: '',
    password: '',
    confirmPassword: '',
    // Patient-specific fields
    insurance_provider: '',
    insurance_policy_number: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',
    // Provider-specific fields
    specialization: '',
    licence: '',
    experience: '',
    address: '',
    education: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();


  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   if (formData.password !== formData.confirmPassword) {
  //     setError('Passwords do not match');
  //     return;
  //   }

  //   if (formData.password.length < 6) {
  //     setError('Password must be at least 6 characters long');
  //     return;
  //   }

  //   setIsLoading(true);
  //   setError('');

  //   try {
  //     const response = await fetch('http://localhost:5000/api/users', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(formData),
  //     });
      
  //     const data = await response.json();

  //     if (!response.ok) {
  //       throw new Error(data.message || 'Registration failed');
  //     }

  //     // Registration successful
  //     navigate('/login', { 
  //       state: { message: 'Account created successfully! Please log in.' }
  //     });
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : 'Registration failed');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
  
    setIsLoading(true);
    setError('');
  
    try {
      // Build payload dynamically
      let payload: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        age: formData.age,
        date_of_birth: formData.date_of_birth,
        password: formData.password,
      };
  
      if (formData.role === 'patient') {
        payload = {
          ...payload,
          insurance_provider: formData.insurance_provider,
          insurance_policy_number: formData.insurance_policy_number,
          emergency_contact_name: formData.emergency_contact_name,
          emergency_contact_phone: formData.emergency_contact_phone,
          emergency_contact_relationship: formData.emergency_contact_relationship,
        };
      }
  
      if (formData.role === 'provider') {
        payload = {
          ...payload,
          specialization: formData.specialization,
          licence: formData.licence,
          experience: formData.experience,
          address: formData.address,
          education: formData.education,
        };
      }
  
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
  
      navigate('/login', {
        state: { message: 'Account created successfully! Please log in.' },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };
  


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (role: 'patient' | 'provider') => {
    setFormData({ 
      ...formData, 
      role,
      // Reset role-specific fields when switching roles
      insurance_provider: '',
      insurance_policy_number: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      emergency_contact_relationship: '',
      specialization: '',
      licence: '',
      experience: '',
      address: '',
      education: ''
    });
  };

  const nextStep = () => {
    if (currentStep === 1) {
      // Validate basic fields before proceeding
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.age || !formData.date_of_birth) {
        setError('Please fill in all required fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
      setError('');
    }
    setCurrentStep(2);
  };

  const prevStep = () => {
    setCurrentStep(1);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="flex justify-center items-center">
          <div className="relative">
            <Stethoscope className="h-12 w-12 text-blue-600 transform hover:scale-110 transition-transform duration-300" />
            <div className="absolute -inset-2 bg-blue-600/20 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">HealthCare+</span>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 animate-fade-in">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 animate-fade-in delay-200">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors hover:underline"
          >
            Sign in here
          </Link>
        </p>
        
        {/* Progress Indicator */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
              currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 rounded-full transition-all duration-300 ${
              currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'
            }`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
              currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
          </div>
        </div>
        <div className="mt-2 flex justify-center">
          <div className="flex space-x-16 text-xs text-gray-500">
            <span className={currentStep >= 1 ? 'text-blue-600 font-medium' : ''}>Basic Info</span>
            <span className={currentStep >= 2 ? 'text-blue-600 font-medium' : ''}>Additional Details</span>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100 backdrop-blur-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm animate-shake">
                {error}
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6 animate-slide-in">
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    I am a:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleRoleChange('patient')}
                      className={`flex items-center justify-center p-4 border-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                        formData.role === 'patient'
                          ? 'border-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-lg'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                      }`}
                    >
                      <User className="h-5 w-5 mr-2" />
                      Patient
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRoleChange('provider')}
                      className={`flex items-center justify-center p-4 border-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                        formData.role === 'provider'
                          ? 'border-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-lg'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                      }`}
                    >
                      <UserCheck className="h-5 w-5 mr-2" />
                      Provider
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Age *
                  </label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    required
                    value={formData.age}
                    onChange={handleChange}
                    className="mt-1 appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your age"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Date of birth *
                  </label>
                  <input
                    id="date_of_birth"
                    name="date_of_birth"
                    type="date"
                    required
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className="mt-1 appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your age"
                  />
                </div>


                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password *
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="appearance-none block w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 rounded-r-xl transition-colors duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password *
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="appearance-none block w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 rounded-r-xl transition-colors duration-200"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6 animate-slide-in">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {formData.role === 'patient' ? 'Patient Information' : 'Provider Information'}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {formData.role === 'patient' 
                      ? 'Help us provide better care with your details' 
                      : 'Complete your professional profile'
                    }
                  </p>
                </div>

                {formData.role === 'patient' && (
                  <>
                    {/* Insurance Information */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                      <div className="flex items-center mb-3">
                        <Shield className="h-5 w-5 text-blue-600 mr-2" />
                        <h4 className="text-sm font-semibold text-blue-900">Insurance Information</h4>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="insurance_provider" className="block text-sm font-medium text-gray-700">
                            Insurance Provider
                          </label>
                          <input
                            id="insurance_provider"
                            name="insurance_provider"
                            type="text"
                            value={formData.insurance_provider}
                            onChange={handleChange}
                            className="mt-1 appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            placeholder="e.g., Blue Cross Blue Shield"
                          />
                        </div>
                        <div>
                          <label htmlFor="insurance_policy_number" className="block text-sm font-medium text-gray-700">
                            Policy Number
                          </label>
                          <input
                            id="insurance_policy_number"
                            name="insurance_policy_number"
                            type="text"
                            value={formData.insurance_policy_number}
                            onChange={handleChange}
                            className="mt-1 appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            placeholder="Enter your policy number"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 border border-red-100">
                      <div className="flex items-center mb-3">
                        <Phone className="h-5 w-5 text-red-600 mr-2" />
                        <h4 className="text-sm font-semibold text-red-900">Emergency Contact</h4>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="emergency_contact_name" className="block text-sm font-medium text-gray-700">
                            Contact Name
                          </label>
                          <input
                            id="emergency_contact_name"
                            name="emergency_contact_name"
                            type="text"
                            value={formData.emergency_contact_name}
                            onChange={handleChange}
                            className="mt-1 appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            placeholder="Emergency contact full name"
                          />
                        </div>
                        <div>
                          <label htmlFor="emergency_contact_phone" className="block text-sm font-medium text-gray-700">
                            Contact Phone
                          </label>
                          <input
                            id="emergency_contact_phone"
                            name="emergency_contact_phone"
                            type="tel"
                            value={formData.emergency_contact_phone}
                            onChange={handleChange}
                            className="mt-1 appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            placeholder="Emergency contact phone"
                          />
                        </div>
                        <div>
                          <label htmlFor="emergency_contact_relationship" className="block text-sm font-medium text-gray-700">
                            Relationship
                          </label>
                          <input
                            id="emergency_contact_relationship"
                            name="emergency_contact_relationship"
                            type="text"
                            value={formData.emergency_contact_relationship}
                            onChange={handleChange}
                            className="mt-1 appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            placeholder="e.g., Spouse, Parent, Sibling"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {formData.role === 'provider' && (
                  <>
                    {/* Professional Information */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                      <div className="flex items-center mb-3">
                        <Award className="h-5 w-5 text-green-600 mr-2" />
                        <h4 className="text-sm font-semibold text-green-900">Professional Information</h4>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                            Specialization *
                          </label>
                          <input
                            id="specialization"
                            name="specialization"
                            type="text"
                            required
                            value={formData.specialization}
                            onChange={handleChange}
                            className="mt-1 appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            placeholder="e.g., Cardiology, Pediatrics, General Medicine"
                          />
                        </div>
                        <div>
                          <label htmlFor="licence" className="block text-sm font-medium text-gray-700">
                            License Number *
                          </label>
                          <input
                            id="licence"
                            name="licence"
                            type="text"
                            required
                            value={formData.licence}
                            onChange={handleChange}
                            className="mt-1 appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            placeholder="Enter your medical license number"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100">
                      <div className="flex items-center mb-3">
                        <GraduationCap className="h-5 w-5 text-purple-600 mr-2" />
                        <h4 className="text-sm font-semibold text-purple-900">Additional Details</h4>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                            Years of Experience
                          </label>
                          <input
                            id="experience"
                            name="experience"
                            type="number"
                            value={formData.experience}
                            onChange={handleChange}
                            className="mt-1 appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            placeholder="e.g., 5 years, 10+ years"
                          />
                        </div>
                        <div>
                          <label htmlFor="education" className="block text-sm font-medium text-gray-700">
                            Education
                          </label>
                          <input
                            id="education"
                            name="education"
                            type="text"
                            value={formData.education}
                            onChange={handleChange}
                            className="mt-1 appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            placeholder="e.g., MD from Harvard Medical School"
                          />
                        </div>
                        <div>
                          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                            Practice Address
                          </label>
                          <input
                            id="address"
                            name="address"
                            type="text"
                            value={formData.address}
                            onChange={handleChange}
                            className="mt-1 appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            placeholder="Enter your practice address"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-center">
                  <input
                    id="agree-terms"
                    name="agree-terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">
                    I agree to the{' '}
                    <Link to="/terms" className="text-blue-600 hover:text-blue-500 hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-blue-600 hover:text-blue-500 hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
      
      {/* <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        .animate-slide-in { animation: slide-in 0.4s ease-out forwards; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .delay-200 { animation-delay: 0.2s; }
      `}</style> */}
    </div>
  );
};

export default RegisterPage;