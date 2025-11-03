import { NextRequest, NextResponse } from 'next/server';
import { PredictionRequest, PredictionResponse, ExternalAPIResponse } from '@/types/prediction';

// Configuration
const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL || 'https://fmcg-api.onrender.com';
const API_TIMEOUT = parseInt(process.env.EXTERNAL_API_TIMEOUT || '100000');

// External API call function
async function callExternalAPI(data: PredictionRequest): Promise<ExternalAPIResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(`${EXTERNAL_API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result: ExternalAPIResponse = await response.json();
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout - API took too long to respond');
    }
    throw error;
  }
}

// Transform external API response to our format
function transformExternalResponse(
  externalData: ExternalAPIResponse,
  originalRequest: PredictionRequest,
  processingTime: number
): PredictionResponse['data'] {
  const score = Math.min(30, Math.max(0, Math.round(externalData.prediction_score)));
  const analysis = generateAnalysis(originalRequest, score);
  const risk_assessment = score >= 21 ? 'Low' : score >= 15 ? 'Medium' : 'High';

  return {
    score,
    model_used: externalData.model_used,
    prediction_id: `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    analysis,
    risk_assessment,
    processing_time : processingTime,
  };
}

// Generate analysis based on input data and score
function generateAnalysis(data: PredictionRequest, score: number) {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: string[] = [];

  // Analyze strengths based on visible fields
  if (data.WH_capacity_size === 'Large') {
    strengths.push('Large capacity facility supports high volume operations');
  }
  if (data.workers_num >= 50) {
    strengths.push('Strong workforce capacity for efficient operations');
  }
  if (data.wh_est_year <= 2000) {
    strengths.push('Well-established business with proven track record');
  }
  if (data.wh_owner_type === 'Franchise') {
    strengths.push('Franchise model provides operational support and branding');
  }
  if (data.Competitor_in_mkt <= 3) {
    strengths.push('Low competition environment offers market advantages');
  }
  if (data.approved_wh_govt_certificate === 'A+' || data.approved_wh_govt_certificate === 'A') {
    strengths.push('High-grade government certification ensures quality standards');
  }

  // Analyze weaknesses based on visible fields
  if (data.WH_capacity_size === 'Small') {
    weaknesses.push('Limited capacity may restrict growth potential');
  }
  if (data.workers_num < 10) {
    weaknesses.push('Small workforce may limit operational efficiency');
  }
  if (data.wh_est_year >= 2020) {
    weaknesses.push('Newer business may lack operational experience');
  }
  if (data.approved_wh_govt_certificate === 'C') {
    weaknesses.push('Lower certification grade indicates compliance concerns');
  }
  if (data.Competitor_in_mkt > 7) {
    weaknesses.push('High competition density in the market');
  }

  // Generate recommendations based on visible fields and score
  if (data.WH_capacity_size === 'Small') {
    recommendations.push('Consider facility expansion to increase capacity');
  }
  if (data.workers_num < 20) {
    recommendations.push('Invest in staff training and hiring to improve operations');
  }
  if (data.approved_wh_govt_certificate === 'B' || data.approved_wh_govt_certificate === 'C') {
    recommendations.push('Focus on improving certification to A+ grade');
  }
  if (data.Competitor_in_mkt > 5) {
    recommendations.push('Develop competitive advantages through service differentiation');
  }
  if (data.wh_est_year >= 2015) {
    recommendations.push('Build operational expertise through process optimization');
  }
  if (score < 15) {
    recommendations.push('Focus on improving key business metrics for better performance');
  }
  if (score >= 21) {
    recommendations.push('Excellent facility - consider expanding capacity and operations');
    recommendations.push('Use as a model for other retail locations');
  }

  return { strengths, weaknesses, recommendations };
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body: PredictionRequest = await request.json();

    // Basic validation
    if (!body.model || !body.Location_type || !body.WH_capacity_size) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Call external API
    const externalResult = await callExternalAPI(body);

    if (externalResult.status !== 'success') {
      return NextResponse.json(
        { success: false, error: externalResult.error || 'Prediction failed' },
        { status: 500 }
      );
    }

    const processingTime = Date.now() - startTime;
    const prediction = transformExternalResponse(externalResult, body, processingTime);

    const response: PredictionResponse = {
      success: true,
      data: prediction
    };

    return NextResponse.json(response);

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'External API unavailable'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'FMCG Prediction API',
    version: '1.0.0',
    endpoints: {
      POST: '/api/predict - Submit prediction request',
    },
    models: ['fmcg_darknet', 'fmcg_hashlock', 'fmcg_infinity']
  });
}