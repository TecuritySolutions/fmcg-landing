'use client';
import React, { useState } from 'react';
import { Brain, BarChart3, Loader2, CheckCircle2, AlertCircle, ArrowLeft, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Gauge } from '@mui/x-charts/Gauge';
import { PredictionRequest, PredictionResponse, FormField, PincodeResponse } from '@/types/prediction';

const formFields: FormField[] = [
  {
    name: 'model',
    label: 'Select Model',
    type: 'select',
    required: true,
    options: [
      { value: 'fmcg_darknet', label: 'FMCG DarkNet' },
      { value: 'fmcg_hashlock', label: 'FMCG HashLock' },
      { value: 'fmcg_infinity', label: 'FMCG Infinity' }
    ]
  },
  {
    name: 'Location_type',
    label: 'Location Type',
    type: 'select',
    required: true,
    hidden: true,
    fixedValue: 'Urban',
    options: [
      { value: 'Urban', label: 'Urban' },
      { value: 'Rural', label: 'Rural' }
    ]
  },
  {
    name: 'WH_capacity_size',
    label: 'Retail Shop Capacity Size',
    type: 'select',
    required: true,
    options: [
      { value: 'Small', label: 'Small' },
      { value: 'Mid', label: 'Mid' },
      { value: 'Large', label: 'Large' }
    ]
  },
  {
    name: 'zone',
    label: 'Zone',
    type: 'select',
    required: true,
    hidden: true,
    fixedValue: 'West',
    options: [
      { value: 'North', label: 'North' },
      { value: 'South', label: 'South' },
      { value: 'East', label: 'East' },
      { value: 'West', label: 'West' }
    ]
  },
  {
    name: 'WH_regional_zone',
    label: 'Regional Zone',
    type: 'select',
    required: true,
    hidden: true,
    fixedValue: 'Zone 2',
    options: [
      { value: 'Zone 1', label: 'Zone 1' },
      { value: 'Zone 2', label: 'Zone 2' },
      { value: 'Zone 3', label: 'Zone 3' },
      { value: 'Zone 4', label: 'Zone 4' },
      { value: 'Zone 5', label: 'Zone 5' },
      { value: 'Zone 6', label: 'Zone 6' }
    ]
  },
  {
    name: 'num_refill_req_l3m',
    label: 'Number of Refills (Last 3 Months)',
    type: 'number',
    required: true,
    hidden: true,
    randomRange: [1, 50],
    min: 0,
    max: 50
  },
  {
    name: 'transport_issue_l1y',
    label: 'Transport Issues (Last 1 Year)',
    type: 'number',
    required: true,
    hidden: true,
    randomRange: [1, 10],
    min: 0,
    max: 10
  },
  {
    name: 'Competitor_in_mkt',
    label: 'Competitors in Market',
    type: 'number',
    required: true,
    min: 0,
    max: 10
  },
  {
    name: 'retail_shop_num',
    label: 'Retail Shop Count (in the area)',
    type: 'number',
    required: true,
    hidden: true,
    randomRange: [1, 10000],
    min: 0,
    max: 10000
  },
  {
    name: 'wh_owner_type',
    label: 'Retail Owner Type',
    type: 'select',
    required: true,
    options: [
      { value: 'Private', label: 'Private' },
      // { value: 'Government', label: 'Government' },
      { value: 'Franchise', label: 'Franchise' }
    ]
  },
  {
    name: 'distributor_num',
    label: 'Distributor Count',
    type: 'number',
    required: true,
    hidden: true,
    randomRange: [1, 500],
    min: 0,
    max: 500
  },
  {
    name: 'flood_impacted',
    label: 'Flood Impacted',
    type: 'toggle',
    required: true,
    hidden: true,
    fixedValue: 0
  },
  {
    name: 'flood_proof',
    label: 'Flood Proof',
    type: 'toggle',
    required: true,
    hidden: true,
    fixedValue: 1
  },
  {
    name: 'electric_supply',
    label: '24 hours Electricity Available',
    type: 'toggle',
    required: true,
    hidden: true,
    fixedValue: 1
  },
  {
    name: 'dist_from_hub',
    label: 'Distance from Hub (km)',
    type: 'number',
    required: true,
    hidden: true,
    randomRange: [1, 1000],
    min: 0,
    max: 1000
  },
  {
    name: 'workers_num',
    label: 'Number of Employees',
    type: 'number',
    required: true,
    min: 0,
    max: 200
  },
  {
    name: 'wh_est_year',
    label: 'Retail Shop Established Year',
    type: 'number',
    required: true,
    min: 1980,
    max: 2025
  },
  {
    name: 'storage_issue_reported_l3m',
    label: 'Storage Issues (Last 3 Months)',
    type: 'number',
    required: true,
    hidden: true,
    randomRange: [1, 50],
    min: 0,
    max: 50
  },
  {
    name: 'temp_reg_mach',
    label: 'Temperature Regulation Machine',
    type: 'toggle',
    required: true,
    hidden: true,
    fixedValue: 1
  },
  {
    name: 'approved_wh_govt_certificate',
    label: 'Personality of Shop Owner',
    type: 'select',
    required: true,
    options: [
      { value: 'A+', label: 'A+' },
      { value: 'A', label: 'A' },
      { value: 'B', label: 'B' },
      { value: 'C', label: 'C' }
    ]
  },
  {
    name: 'wh_breakdown_l3m',
    label: 'Retail Shop Closure (Last 3 Months)',
    type: 'number',
    required: true,
    hidden: true,
    randomRange: [1, 20],
    min: 0,
    max: 20
  },
  {
    name: 'govt_check_l3m',
    label: 'Government Checks (Last 3 Months)',
    type: 'number',
    required: true,
    hidden: true,
    randomRange: [1, 50],
    min: 0,
    max: 50
  },
  {
    name: 'product_wg_ton',
    label: 'Product Weight (in Tons)',
    type: 'number',
    required: true,
    hidden: true,
    randomRange: [1, 50000],
    min: 0,
    max: 50000
  },
  {
    name: 'pincode',
    label: 'Pincode',
    type: 'text',
    required: true
  }
];

// Helper function to generate random value within range
const generateRandomValue = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Fetch pincode details from API
const fetchPincodeDetails = async (pincode: string): Promise<PincodeResponse> => {
  const response = await fetch('https://fmcg-api.onrender.com/pincode', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pincode })
  });

  const data = await response.json();
  return data;
};

// Initialize hidden fields with fixed or random values
const initializeHiddenFields = (): Partial<PredictionRequest> => {
  const hiddenData: any = {};

  formFields.forEach(field => {
    if (field.hidden) {
      if (field.fixedValue !== undefined) {
        hiddenData[field.name] = field.fixedValue;
      } else if (field.randomRange) {
        hiddenData[field.name] = generateRandomValue(field.randomRange[0], field.randomRange[1]);
      }
    }
  });

  return hiddenData as Partial<PredictionRequest>;
};

export default function PredictionForm() {
  const [formData, setFormData] = useState<Partial<PredictionRequest>>(() => {
    return initializeHiddenFields();
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pincode related state
  const [pincodeData, setPincodeData] = useState<PincodeResponse | null>(null);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState<string | null>(null);

  const handleInputChange = (name: keyof PredictionRequest, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Handle pincode changes
    if (name === 'pincode' && value && value.length === 6) {
      handlePincodeChange(value);
    } else if (name === 'pincode' && (!value || value.length !== 6)) {
      setPincodeData(null);
      setPincodeError(null);
    }
  };

  const handlePincodeChange = async (pincode: string) => {
    setPincodeLoading(true);
    setPincodeError(null);
    setPincodeData(null);

    try {
      const response = await fetchPincodeDetails(pincode);
      if (response.status === 'success' && response.details) {
        setPincodeData(response);
      } else if (response.error) {
        setPincodeError(response.error);
      }
    } catch (error) {
      setPincodeError('Failed to fetch pincode details');
    } finally {
      setPincodeLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    formFields.forEach(field => {
      if (field.required && (!formData[field.name] && formData[field.name] !== 0)) {
        newErrors[field.name] = `${field.label} is required`;
      }

      if (field.type === 'number' && formData[field.name] !== undefined) {
        const value = Number(formData[field.name]);
        if (field.min !== undefined && value < field.min) {
          newErrors[field.name] = `Minimum value is ${field.min}`;
        }
        if (field.max !== undefined && value > field.max) {
          newErrors[field.name] = `Maximum value is ${field.max}`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data: PredictionResponse = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Failed to connect to prediction service'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderField = (field: FormField) => {
    // Skip rendering hidden fields
    if (field.hidden) {
      return null;
    }

    const fieldError = errors[field.name];

    // Type-aware validation for different field types
    const hasValue = (() => {
      const value = formData[field.name];
      if (value === undefined || value === null) return false;

      // For string fields (select dropdowns), check if not empty string
      if (typeof value === 'string') return value.trim() !== '';

      // For number fields, any number (including 0) is valid
      if (typeof value === 'number') return !isNaN(value);

      // For any other defined value, consider it valid
      return true;
    })();

    const isValid = hasValue && !fieldError;

    // AI-themed input styling classes
    const baseInputClasses = "w-full h-12 px-4 border-2 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-0 backdrop-blur-sm";
    const inputStateClasses = fieldError
      ? 'border-red-400/60 bg-red-900/20 text-red-100 placeholder-red-300/60 focus:border-red-400 focus:shadow-lg focus:shadow-red-400/30 focus:bg-red-900/30'
      : isValid
        ? 'border-emerald-400/60 bg-emerald-900/20 text-emerald-100 focus:border-emerald-400 focus:shadow-lg focus:shadow-emerald-400/30 focus:bg-emerald-900/30'
        : 'border-cyan-500/30 bg-slate-800/40 text-cyan-100 placeholder-cyan-300/40 focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/30 hover:border-cyan-400/50 focus:bg-slate-800/60';

    switch (field.type) {
      case 'select':
        return (
          <div key={field.name} className="space-y-3 group">
            <label
              htmlFor={field.name}
              className="block text-sm font-semibold text-cyan-300 group-focus-within:text-cyan-200 transition-colors duration-300"
            >
              <span className="flex items-center space-x-2">
                <span>{field.label}</span>
                {field.required && <span className="text-red-400 ml-1" aria-label="required">*</span>}
                <div className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
              </span>
            </label>
            <div className="relative">
              <select
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                className={`${baseInputClasses} ${inputStateClasses} appearance-none cursor-pointer`}
                aria-describedby={fieldError ? `${field.name}-error` : undefined}
                aria-invalid={!!fieldError}
              >
                <option value="" disabled>Select {field.label}</option>
                {field.options?.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className={`w-5 h-5 transition-colors duration-300 ${fieldError ? 'text-red-400' : isValid ? 'text-emerald-400' : 'text-cyan-400/60'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {fieldError && (
              <p id={`${field.name}-error`} className="text-red-400 text-sm font-medium flex items-center animate-pulse">
                <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                {fieldError}
              </p>
            )}
            {isValid && (
              <p className="text-emerald-400 text-sm font-medium flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1 flex-shrink-0 animate-pulse" />
                Data validated
              </p>
            )}
          </div>
        );

      case 'number':
        return (
          <div key={field.name} className="space-y-3 group">
            <label
              htmlFor={field.name}
              className="block text-sm font-semibold text-cyan-300 group-focus-within:text-cyan-200 transition-colors duration-300"
            >
              <span className="flex items-center space-x-2">
                <span>{field.label}</span>
                {field.required && <span className="text-red-400 ml-1" aria-label="required">*</span>}
                {field.min !== undefined && field.max !== undefined && (
                  <span className="text-cyan-400/60 text-xs font-normal ml-2 bg-cyan-400/10 px-2 py-1 rounded-full">
                    {field.min} - {field.max}
                  </span>
                )}
                <div className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
              </span>
            </label>
            <div className="relative">
              <input
                id={field.name}
                name={field.name}
                type="number"
                value={formData[field.name] || ''}
                onChange={(e) => handleInputChange(field.name, Number(e.target.value))}
                min={field.min}
                max={field.max}
                step={field.step || 1}
                className={`${baseInputClasses} ${inputStateClasses}`}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                aria-describedby={fieldError ? `${field.name}-error` : undefined}
                aria-invalid={!!fieldError}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                {isValid && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-pulse" />
                )}
                {fieldError && (
                  <AlertCircle className="w-5 h-5 text-red-400 animate-pulse" />
                )}
              </div>
            </div>
            {fieldError && (
              <p id={`${field.name}-error`} className="text-red-400 text-sm font-medium flex items-center animate-pulse">
                <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                {fieldError}
              </p>
            )}
            {isValid && (
              <p className="text-emerald-400 text-sm font-medium flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1 flex-shrink-0 animate-pulse" />
                Data validated
              </p>
            )}
          </div>
        );

      case 'text':
        return (
          <div key={field.name} className="space-y-3 group">
            <label
              htmlFor={field.name}
              className="block text-sm font-semibold text-cyan-300 group-focus-within:text-cyan-200 transition-colors duration-300"
            >
              <span className="flex items-center space-x-2">
                <span>{field.label}</span>
                {field.required && <span className="text-red-400 ml-1" aria-label="required">*</span>}
                <div className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
              </span>
            </label>
            <div className="relative">
              <input
                id={field.name}
                name={field.name}
                type="text"
                value={formData[field.name] || ''}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                className={`${baseInputClasses} ${inputStateClasses}`}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                aria-describedby={fieldError ? `${field.name}-error` : undefined}
                aria-invalid={!!fieldError}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                {field.name === 'pincode' && pincodeLoading && (
                  <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
                )}
                {field.name === 'pincode' && !pincodeLoading && isValid && (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                )}
                {field.name !== 'pincode' && isValid && (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                )}
                {fieldError && (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            </div>
            {fieldError && (
              <p id={`${field.name}-error`} className="text-red-600 text-sm font-medium flex items-center">
                <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                {fieldError}
              </p>
            )}
            {field.name === 'pincode' && pincodeData && pincodeData.details && (
              <div className="bg-emerald-900/20 border border-emerald-400/30 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0 animate-pulse" />
                  <div className="space-y-2">
                    <p className="text-emerald-300 font-medium">🛰️ Location Scan Complete</p>
                    <div className="text-sm text-emerald-100/80 space-y-1">
                      <p><span className="font-medium text-emerald-400">Landmark:</span> {pincodeData.details.landmark}</p>
                      <p><span className="font-medium text-emerald-400">Population:</span> {parseInt(pincodeData.details.population).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {field.name === 'pincode' && pincodeError && (
              <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0 animate-pulse" />
                  <div>
                    <p className="text-blue-300 font-medium">🚀 Service Expansion Zone</p>
                    <p className="text-sm text-blue-100/80 mt-1">Systems are analyzing this location for future service deployment.</p>
                  </div>
                </div>
              </div>
            )}
            {field.name !== 'pincode' && isValid && (
              <p className="text-emerald-400 text-sm font-medium flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1 flex-shrink-0 animate-pulse" />
               Data validated
              </p>
            )}
          </div>
        );

      case 'toggle':
        return (
          <div key={field.name} className="space-y-3">
            <label className="block text-sm font-semibold text-gray-800">
              {field.label}
              {field.required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
            </label>
            <div className="flex space-x-6" role="radiogroup" aria-labelledby={`${field.name}-label`}>
              <label className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name={field.name}
                  value="1"
                  checked={formData[field.name] === 1}
                  onChange={(e) => handleInputChange(field.name, 1)}
                  className="sr-only"
                  aria-describedby={fieldError ? `${field.name}-error` : undefined}
                />
                <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center transition-all duration-200 group-hover:scale-105 ${
                  formData[field.name] === 1
                    ? 'border-purple-500 bg-purple-500 shadow-lg shadow-purple-200'
                    : 'border-gray-300 group-hover:border-purple-300'
                }`}>
                  {formData[field.name] === 1 && (
                    <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                  )}
                </div>
                <span className={`font-medium ${formData[field.name] === 1 ? 'text-purple-700' : 'text-gray-700'}`}>
                  Yes
                </span>
              </label>
              <label className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name={field.name}
                  value="0"
                  checked={formData[field.name] === 0}
                  onChange={(e) => handleInputChange(field.name, 0)}
                  className="sr-only"
                  aria-describedby={fieldError ? `${field.name}-error` : undefined}
                />
                <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center transition-all duration-200 group-hover:scale-105 ${
                  formData[field.name] === 0
                    ? 'border-purple-500 bg-purple-500 shadow-lg shadow-purple-200'
                    : 'border-gray-300 group-hover:border-purple-300'
                }`}>
                  {formData[field.name] === 0 && (
                    <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                  )}
                </div>
                <span className={`font-medium ${formData[field.name] === 0 ? 'text-purple-700' : 'text-gray-700'}`}>
                  No
                </span>
              </label>
            </div>
            {fieldError && (
              <p id={`${field.name}-error`} className="text-red-600 text-sm font-medium flex items-center">
                <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                {fieldError}
              </p>
            )}
            {(formData[field.name] === 0 || formData[field.name] === 1) && (
              <p className="text-green-600 text-sm font-medium flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1 flex-shrink-0" />
                Selection made
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full filter blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Neural Network Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 1000 1000">
          <defs>
            <pattern id="neural-grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <circle cx="25" cy="25" r="1" fill="currentColor" opacity="0.3">
                <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" />
              </circle>
              <line x1="25" y1="25" x2="75" y2="25" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
              <line x1="25" y1="25" x2="25" y2="75" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#neural-grid)" className="text-cyan-400" />
        </svg>
      </div>

      {/* Header */}
      <header className="relative bg-black/20 backdrop-blur-xl border-b border-cyan-500/20 shadow-lg shadow-cyan-500/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 text-cyan-400 hover:text-cyan-300 transition-all duration-300 group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <div className="relative">
                <Brain className="w-8 h-8 animate-pulse" />
                <div className="absolute inset-0 bg-cyan-400/20 rounded-full animate-ping"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                RetailScore AI
              </span>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-3 py-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-emerald-400 font-medium"> Online</span>
              </div>
              {/* <div className="flex items-center space-x-2 text-blue-400">
                <BarChart3 className="w-6 h-6 animate-pulse" />
                <span className="text-lg font-semibold">Neural Prediction Engine</span>
              </div> */}
            </div>
          </div>
        </div>
      </header>

      <div className="relative max-w-4xl mx-auto px-6 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 animate-pulse">
             Retail Score Analysis
            </h1>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
          </div>
          {/* <p className="text-xl text-cyan-100/80 mt-6 font-light">
            Advanced machine learning algorithms analyze your retail data in real-time
          </p> */}
          {/* <div className="flex items-center justify-center space-x-6 mt-4 text-sm text-cyan-300/60">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Neural Network Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
              <span>Deep Learning Ready</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-700"></div>
              <span>Predictive AI Online</span>
            </div>
          </div> */}
        </div>

        {/* Form */}
        <div className="relative bg-black/30 backdrop-blur-xl border border-cyan-500/20 rounded-3xl shadow-2xl shadow-cyan-500/10 p-6 md:p-8 mb-8 group hover:border-cyan-500/40 transition-all duration-300">
          {/* Holographic Border Effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Corner Accents */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-cyan-400/50 rounded-tl-lg"></div>
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-cyan-400/50 rounded-tr-lg"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-cyan-400/50 rounded-bl-lg"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-cyan-400/50 rounded-br-lg"></div>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
              {formFields.filter(field => !field.hidden).map(renderField)}
            </div>

            {/* Submit Button */}
            <div className="flex flex-col items-center pt-8 space-y-6">
              <div className="relative group">
                {/* Glowing ring effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300 animate-pulse"></div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white px-12 py-4 rounded-xl text-lg font-bold shadow-2xl shadow-cyan-500/20 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-3 min-w-[320px] justify-center border border-cyan-500/30 backdrop-blur-sm"
                >
                  {isLoading ? (
                    <>
                      <div className="relative">
                        <Loader2 className="w-6 h-6 animate-spin text-cyan-300" />
                        <div className="absolute inset-0 w-6 h-6 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
                      </div>
                      <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                        🧠 Neural Processing...
                      </span>
                    </>
                  ) : (
                    <>
                      <Brain className="w-6 h-6 animate-pulse text-cyan-300" />
                      <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                        ⚡ Initiate Analysis
                      </span>
                    </>
                  )}

                  {/* Holographic overlay */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>

              {/* Neural Progress Indicator */}
              <div className="text-center">
                {(() => {
                  const visibleFields = formFields.filter(field => !field.hidden);
                  const visibleFieldsCompleted = visibleFields.filter(field => {
                    const value = formData[field.name];
                    if (value === undefined || value === null) return false;
                    if (typeof value === 'string') return value.trim() !== '';
                    if (typeof value === 'number') return !isNaN(value);
                    return true;
                  }).length;
                  const progress = (visibleFieldsCompleted / visibleFields.length) * 100;

                  return (
                    <div className="space-y-4">
                      <div className="text-sm text-cyan-300/80 flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                        <span>Neural Analysis Progress: {visibleFieldsCompleted} / {visibleFields.length} data nodes</span>
                      </div>

                      {/* Neural Network Progress Bar */}
                      <div className="relative w-80 mx-auto">
                        <div className="h-3 bg-slate-700/50 rounded-full backdrop-blur-sm border border-cyan-500/20 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full transition-all duration-500 shadow-lg shadow-cyan-500/30 relative overflow-hidden"
                            style={{ width: `${progress}%` }}
                          >
                            {/* Scanning effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                          </div>
                        </div>

                        {/* Neural nodes */}
                        <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between px-1">
                          {Array.from({ length: visibleFields.length }, (_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                i < visibleFieldsCompleted
                                  ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50 animate-pulse'
                                  : 'bg-slate-600/50 border border-cyan-500/30'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="text-xs text-cyan-400/60">
                        {progress === 100 ? '🤖 Ready for Neural Processing' : '⚡ Collecting data for analysis...'}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </form>
        </div>

        {/* AI Analysis Results */}
        {result && (
          <div className="relative bg-black/30 backdrop-blur-xl border border-cyan-500/20 rounded-3xl shadow-2xl shadow-cyan-500/10 p-8 group">
            {/* Holographic Border Effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/10 via-transparent to-blue-500/10 opacity-50"></div>

            {/* Corner Accents */}
            <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-emerald-400/50 rounded-tl-lg"></div>
            <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-emerald-400/50 rounded-tr-lg"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-emerald-400/50 rounded-bl-lg"></div>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-emerald-400/50 rounded-br-lg"></div>

            {result.success && result.data ? (
              <div className="relative space-y-8">
                {/* Header */}
                <div className="text-center">
                  <div className="relative inline-block">
                    <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4 animate-pulse" />
                    <div className="absolute inset-0 bg-emerald-400/20 rounded-full animate-ping"></div>
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                    🧠 Retail Score Analysis Complete
                  </h2>
                  <p className="text-cyan-300/80 flex items-center justify-center space-x-2">
                    <span>⚡ Processing time: {result.data.processing_time}ms</span>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  </p>
                </div>

                {/* AI Neural Meter Display */}
                <div className="text-center">
                  <div className="relative inline-block">
                    {/* Outer glow ring */}
                    <div className="absolute -inset-8 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full blur-xl opacity-20 animate-pulse"></div>

                    <div className="relative w-80 h-80 mx-auto">
                      {/* Floating particles around meter */}
                      <div className="absolute top-4 left-8 w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
                      <div className="absolute top-12 right-12 w-1 h-1 bg-blue-400 rounded-full animate-ping delay-500"></div>
                      <div className="absolute bottom-8 left-12 w-1 h-1 bg-purple-400 rounded-full animate-ping delay-1000"></div>
                      <div className="absolute bottom-12 right-8 w-1 h-1 bg-emerald-400 rounded-full animate-ping delay-1500"></div>

                      {/* MUI X-Charts Gauge */}
                      <div className="flex justify-center items-center">
                        <Gauge
                          width={280}
                          height={180}
                          value={(result.data.score / 30) * 100}
                          startAngle={-90}
                          endAngle={90}
                          sx={{
                            '& .MuiGauge-valueText': {
                              display: 'none', // Hide the percentage value completely
                            },
                            '& .MuiGauge-valueArc': {
                              fill: 'url(#scoreGradient)',
                            },
                            '& .MuiGauge-referenceArc': {
                              fill: 'rgba(71, 85, 105, 0.3)',
                            },
                          }}
                        />
                        {/* Hidden gradient definition for gauge */}
                        <svg width="0" height="0">
                          <defs>
                            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#ef4444" />
                              <stop offset="25%" stopColor="#f59e0b" />
                              <stop offset="50%" stopColor="#eab308" />
                              <stop offset="75%" stopColor="#22c55e" />
                              <stop offset="100%" stopColor="#10b981" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>

                      {/* Score Information Below Gauge */}
                      <div className="text-center mt-6">
                        <div className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                          {result.data.score} / 30
                        </div>
                        <div className="text-lg text-cyan-200 mb-3">Retail Score</div>

                        {/* Performance indicator */}
                        <div className="px-4 py-2 rounded-full text-sm font-medium border backdrop-blur-sm bg-black/20 inline-block">
                          <span className={`${
                            result.data.score >= 21 ? 'text-emerald-400' :
                            result.data.score >= 15 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {result.data.score >= 21 ? '⚡ Excellent' :
                             result.data.score >= 15 ? '⚡ Good' :
                             '⚡ Needs Improvement'}
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="mt-8">
                    <span className={`inline-block px-6 py-3 rounded-full text-sm font-semibold border backdrop-blur-sm ${
                      result.data.risk_assessment === 'Low'
                        ? 'bg-emerald-900/30 text-emerald-300 border-emerald-400/30' :
                      result.data.risk_assessment === 'Medium'
                        ? 'bg-yellow-900/30 text-yellow-300 border-yellow-400/30' :
                        'bg-red-900/30 text-red-300 border-red-400/30'
                    }`}>
                      {result.data.risk_assessment === 'Low' ? '🟢' : result.data.risk_assessment === 'Medium' ? '🟡' : '🔴'} {result.data.risk_assessment} Risk Classification
                    </span>
                  </div>
                </div>

                {/* AI Dashboard Analysis */}
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Strengths Panel */}
                  <div className="relative bg-emerald-900/20 backdrop-blur-sm border border-emerald-400/30 rounded-xl p-6 group hover:border-emerald-400/50 transition-all duration-300">
                    <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <h3 className="text-lg font-semibold text-emerald-300 mb-4 flex items-center space-x-2">
                      <span>✅ Strengths</span>
                      <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></div>
                    </h3>
                    <ul className="space-y-3">
                      {result.data.analysis.strengths.map((strength, idx) => (
                        <li key={idx} className="text-emerald-100/90 text-sm flex items-start group">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-3 mt-0.5 flex-shrink-0 animate-pulse" />
                          <span className="group-hover:text-emerald-100 transition-colors">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses Panel */}
                  <div className="relative bg-red-900/20 backdrop-blur-sm border border-red-400/30 rounded-xl p-6 group hover:border-red-400/50 transition-all duration-300">
                    <div className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    <h3 className="text-lg font-semibold text-red-300 mb-4 flex items-center space-x-2">
                      <span>⚠️ Weaknesses</span>
                      <div className="w-1 h-1 bg-red-400 rounded-full animate-pulse"></div>
                    </h3>
                    <ul className="space-y-3">
                      {result.data.analysis.weaknesses.map((weakness, idx) => (
                        <li key={idx} className="text-red-100/90 text-sm flex items-start group">
                          <AlertCircle className="w-4 h-4 text-red-400 mr-3 mt-0.5 flex-shrink-0 animate-pulse" />
                          <span className="group-hover:text-red-100 transition-colors">{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendations Panel */}
                  <div className="relative bg-blue-900/20 backdrop-blur-sm border border-blue-400/30 rounded-xl p-6 group hover:border-blue-400/50 transition-all duration-300">
                    <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <h3 className="text-lg font-semibold text-blue-300 mb-4 flex items-center space-x-2">
                      <span>🚀 Recommendations</span>
                      <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                    </h3>
                    <ul className="space-y-3">
                      {result.data.analysis.recommendations.map((rec, idx) => (
                        <li key={idx} className="text-blue-100/90 text-sm flex items-start group">
                          <Brain className="w-4 h-4 text-blue-400 mr-3 mt-0.5 flex-shrink-0 animate-pulse" />
                          <span className="group-hover:text-blue-100 transition-colors">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Terminal-style System Info */}
                <div className="bg-slate-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 text-center">
                  <div className="text-sm text-cyan-300/80 space-y-2">
                    <div className="flex items-center justify-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span>Neural Model: <span className="font-mono text-cyan-400">{result.data.model_used}</span></span>
                      </div>
                      <div className="w-1 h-4 bg-cyan-500/30"></div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                        <span>Session ID: <span className="font-mono text-xs text-blue-400">{result.data.prediction_id}</span></span>
                      </div>
                    </div>
                    <div className="text-xs text-cyan-400/60 mt-3">
                      🤖 Powered by Tecurity • Real-time Analysis
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative text-center py-8">
                <div className="relative inline-block">
                  <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4 animate-pulse" />
                  <div className="absolute inset-0 bg-red-400/20 rounded-full animate-ping"></div>
                </div>
                <h2 className="text-2xl font-bold text-red-300 mb-2">⚠️ Analysis Failed</h2>
                <p className="text-red-400/80">{result.error}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}