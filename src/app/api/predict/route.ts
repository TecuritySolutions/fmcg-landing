import { NextRequest, NextResponse } from 'next/server';
import { PredictionRequest, PredictionResponse, ExternalAPIResponse } from '@/types/prediction';

// Configuration
const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL || 'https://fmcg-api.onrender.com';
const API_TIMEOUT = parseInt(process.env.EXTERNAL_API_TIMEOUT || '30000');

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

  // Analyze strengths
  if (data.Location_type === 'Urban') {
    strengths.push('Strategic urban location with high market potential');
  }
  if (data.electric_supply === 1) {
    strengths.push('Reliable electrical infrastructure');
  }
  if (data.flood_proof === 1) {
    strengths.push('Flood-resistant infrastructure reduces risk');
  }
  if (data.temp_reg_mach === 1) {
    strengths.push('Temperature regulation capability for product quality');
  }
  if (data.approved_wh_govt_certificate === 'A+' || data.approved_wh_govt_certificate === 'A') {
    strengths.push('High-grade government certification');
  }

  // Analyze weaknesses
  if (data.transport_issue_l1y > 5) {
    weaknesses.push('Frequent transport issues affecting supply chain');
  }
  if (data.storage_issue_reported_l3m > 10) {
    weaknesses.push('Multiple storage problems reported recently');
  }
  if (data.wh_breakdown_l3m > 3) {
    weaknesses.push('High frequency of warehouse breakdowns');
  }
  if (data.Competitor_in_mkt > 7) {
    weaknesses.push('High competition density in the market');
  }
  if (data.dist_from_hub > 500) {
    weaknesses.push('Located far from distribution hub');
  }

  // Generate recommendations
  if (score < 15) {
    recommendations.push('Consider infrastructure upgrades to improve operational efficiency');
    recommendations.push('Implement preventive maintenance schedule to reduce breakdowns');
  }
  if (data.temp_reg_mach === 0) {
    recommendations.push('Install temperature regulation systems for product quality');
  }
  if (data.transport_issue_l1y > 3) {
    recommendations.push('Review and optimize transportation logistics');
  }
  if (data.flood_impacted === 1 && data.flood_proof === 0) {
    recommendations.push('Implement flood protection measures');
  }
  if (score >= 21) {
    recommendations.push('Excellent facility - consider expanding capacity');
    recommendations.push('Use as a model for other warehouse locations');
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