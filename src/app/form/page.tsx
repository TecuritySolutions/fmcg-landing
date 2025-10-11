'use client';
import React, { useState } from 'react';
import { Brain, BarChart3, Loader2, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { PredictionRequest, PredictionResponse, FormField } from '@/types/prediction';

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
    options: [
      { value: 'Urban', label: 'Urban' },
      { value: 'Rural', label: 'Rural' }
    ]
  },
  {
    name: 'WH_capacity_size',
    label: 'Warehouse Capacity Size',
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
    min: 0,
    max: 50
  },
  {
    name: 'transport_issue_l1y',
    label: 'Transport Issues (Last 1 Year)',
    type: 'number',
    required: true,
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
    label: 'Retail Shop Count',
    type: 'number',
    required: true,
    min: 0,
    max: 10000
  },
  {
    name: 'wh_owner_type',
    label: 'Warehouse Owner Type',
    type: 'select',
    required: true,
    options: [
      { value: 'Private', label: 'Private' },
      { value: 'Government', label: 'Government' },
      { value: 'Franchise', label: 'Franchise' }
    ]
  },
  {
    name: 'distributor_num',
    label: 'Distributor Count',
    type: 'number',
    required: true,
    min: 0,
    max: 500
  },
  {
    name: 'flood_impacted',
    label: 'Flood Impacted',
    type: 'toggle',
    required: true
  },
  {
    name: 'flood_proof',
    label: 'Flood Proof',
    type: 'toggle',
    required: true
  },
  {
    name: 'electric_supply',
    label: 'Electric Supply Available',
    type: 'toggle',
    required: true
  },
  {
    name: 'dist_from_hub',
    label: 'Distance from Hub (km)',
    type: 'number',
    required: true,
    min: 0,
    max: 1000
  },
  {
    name: 'workers_num',
    label: 'Number of Workers',
    type: 'number',
    required: true,
    min: 0,
    max: 200
  },
  {
    name: 'wh_est_year',
    label: 'Warehouse Established Year',
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
    min: 0,
    max: 50
  },
  {
    name: 'temp_reg_mach',
    label: 'Temperature Regulation Machine',
    type: 'toggle',
    required: true
  },
  {
    name: 'approved_wh_govt_certificate',
    label: 'Govt. Approval Certificate',
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
    label: 'Warehouse Breakdowns (Last 3 Months)',
    type: 'number',
    required: true,
    min: 0,
    max: 20
  },
  {
    name: 'govt_check_l3m',
    label: 'Government Checks (Last 3 Months)',
    type: 'number',
    required: true,
    min: 0,
    max: 50
  },
  {
    name: 'product_wg_ton',
    label: 'Product Weight (in Tons)',
    type: 'number',
    required: true,
    min: 0,
    max: 50000
  }
];

export default function PredictionForm() {
  const [formData, setFormData] = useState<Partial<PredictionRequest>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (name: keyof PredictionRequest, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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

    // Common input styling classes
    const baseInputClasses = "w-full h-12 px-4 border-2 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-0";
    const inputStateClasses = fieldError
      ? 'border-red-400 bg-red-50 text-red-900 placeholder-red-400 focus:border-red-500 focus:shadow-lg focus:shadow-red-100'
      : isValid
        ? 'border-green-400 bg-green-50 text-green-900 focus:border-green-500 focus:shadow-lg focus:shadow-green-100'
        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:shadow-lg focus:shadow-purple-100 hover:border-gray-400';

    switch (field.type) {
      case 'select':
        return (
          <div key={field.name} className="space-y-3">
            <label
              htmlFor={field.name}
              className="block text-sm font-semibold text-gray-800"
            >
              {field.label}
              {field.required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
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
                <svg className={`w-5 h-5 ${fieldError ? 'text-red-400' : isValid ? 'text-green-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {fieldError && (
              <p id={`${field.name}-error`} className="text-red-600 text-sm font-medium flex items-center">
                <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                {fieldError}
              </p>
            )}
            {isValid && (
              <p className="text-green-600 text-sm font-medium flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1 flex-shrink-0" />
                Valid selection
              </p>
            )}
          </div>
        );

      case 'number':
        return (
          <div key={field.name} className="space-y-3">
            <label
              htmlFor={field.name}
              className="block text-sm font-semibold text-gray-800"
            >
              {field.label}
              {field.required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
              {field.min !== undefined && field.max !== undefined && (
                <span className="text-gray-500 text-xs font-normal ml-2">
                  ({field.min} - {field.max})
                </span>
              )}
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
            {isValid && (
              <p className="text-green-600 text-sm font-medium flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1 flex-shrink-0" />
                Valid input
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition">
              <ArrowLeft className="w-5 h-5" />
              <Brain className="w-8 h-8" />
              <span className="text-2xl font-bold">RetailScore AI</span>
            </Link>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-6 h-6 text-purple-600" />
              <span className="text-lg font-semibold text-gray-900">FMCG Prediction</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">FMCG Warehouse Prediction</h1>
          <p className="text-xl text-gray-600">
            Enter warehouse and operational data to get AI-powered retail scoring and insights
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
              {formFields.map(renderField)}
            </div>

            {/* Submit Button */}
            <div className="flex flex-col items-center pt-8 space-y-4">
              <button
                type="submit"
                disabled={isLoading}
                className="relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-12 py-4 rounded-xl text-lg font-bold hover:shadow-2xl hover:shadow-purple-200 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none flex items-center space-x-3 min-w-[280px] justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Processing Prediction...</span>
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-6 h-6" />
                    <span>Generate Prediction</span>
                  </>
                )}
              </button>

              {/* Form Progress Indicator */}
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-2">
                  Form Progress: {Object.keys(formData).length} / {formFields.length} fields completed
                </div>
                <div className="w-64 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(Object.keys(formData).length / formFields.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {result.success && result.data ? (
              <div className="space-y-8">
                {/* Header */}
                <div className="text-center">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Prediction Complete</h2>
                  <p className="text-gray-600">Processing time: {result.data.processing_time}ms</p>
                </div>

                {/* Score Display */}
                <div className="text-center">
                  <div className="inline-block bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
                    <div className="text-6xl font-extrabold mb-2">{result.data.score}</div>
                    <div className="text-xl">Retail Score</div>
                    <div className="text-sm opacity-90">out of 100</div>
                  </div>
                  <div className="mt-4">
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                      result.data.risk_assessment === 'Low' ? 'bg-green-100 text-green-800' :
                      result.data.risk_assessment === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {result.data.risk_assessment} Risk
                    </span>
                  </div>
                </div>

                {/* Analysis */}
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Strengths */}
                  <div className="bg-green-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-green-800 mb-3">Strengths</h3>
                    <ul className="space-y-2">
                      {result.data.analysis.strengths.map((strength, idx) => (
                        <li key={idx} className="text-green-700 text-sm flex items-start">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="bg-red-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-red-800 mb-3">Weaknesses</h3>
                    <ul className="space-y-2">
                      {result.data.analysis.weaknesses.map((weakness, idx) => (
                        <li key={idx} className="text-red-700 text-sm flex items-start">
                          <AlertCircle className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3">Recommendations</h3>
                    <ul className="space-y-2">
                      {result.data.analysis.recommendations.map((rec, idx) => (
                        <li key={idx} className="text-blue-700 text-sm flex items-start">
                          <BarChart3 className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <div className="text-sm text-gray-600">
                    <p>Model Used: <span className="font-semibold">{result.data.model_used}</span></p>
                    <p>Prediction ID: <span className="font-mono text-xs">{result.data.prediction_id}</span></p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Prediction Failed</h2>
                <p className="text-red-600">{result.error}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}