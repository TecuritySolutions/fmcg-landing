export interface PredictionRequest {
  // Model Selection
  model: 'fmcg_darknet' | 'fmcg_hashlock' | 'fmcg_infinity';

  // Location and Warehouse Details
  Location_type: 'Urban' | 'Rural';
  WH_capacity_size: 'Small' | 'Mid' | 'Large';
  zone: 'North' | 'South' | 'East' | 'West';
  WH_regional_zone: 'Zone 1' | 'Zone 2' | 'Zone 3' | 'Zone 4' | 'Zone 5' | 'Zone 6';

  // Operational Metrics (Last 3 Months/1 Year)
  num_refill_req_l3m: number; // 0-50
  transport_issue_l1y: number; // 0-10
  storage_issue_reported_l3m: number; // 0-50
  wh_breakdown_l3m: number; // 0-20
  govt_check_l3m: number; // 0-50

  // Market and Competition
  Competitor_in_mkt: number; // 0-10
  retail_shop_num: number; // 0-10000
  distributor_num: number; // 0-500

  // Infrastructure and Facilities
  wh_owner_type: 'Private' | 'Government' | 'Franchise';
  flood_impacted: 1 | 0; // Yes (1), No (0)
  flood_proof: 1 | 0; // Yes (1), No (0)
  electric_supply: 1 | 0; // Yes (1), No (0)
  temp_reg_mach: 1 | 0; // Yes (1), No (0)

  // Location and Logistics
  dist_from_hub: number; // 0-1000 km
  workers_num: number; // 0-200
  wh_est_year: number; // 1980-2025

  // Certifications and Approvals
  approved_wh_govt_certificate: 'A+' | 'A' | 'B' | 'C';

  // Product Details
  product_wg_ton: number; // 0-50000 tons

  // Location Details
  pincode: string;
}

// External API Response Format
export interface ExternalAPIResponse {
  model_used: string;
  prediction_score: number;
  status: 'success' | 'error';
  error?: string;
}

export interface PredictionResponse {
  success: boolean;
  data?: {
    score: number; // 0-30
    model_used: string;
    prediction_id: string;
    analysis: {
      strengths: string[];
      weaknesses: string[];
      recommendations: string[];
    };
    risk_assessment: 'Low' | 'Medium' | 'High';
    processing_time: number; // in milliseconds
  };
  error?: string;
}

export interface FormFieldOption {
  value: string | number;
  label: string;
}

export interface FormField {
  name: keyof PredictionRequest;
  label: string;
  type: 'text' | 'number' | 'select' | 'toggle';
  required: boolean;
  options?: FormFieldOption[];
  min?: number;
  max?: number;
  step?: number;
  hidden?: boolean;
  fixedValue?: string | number;
  randomRange?: [number, number];
}

// Pincode API Response
export interface PincodeResponse {
  details?: {
    landmark: string;
    pincode: string;
    population: string;
  };
  status: string;
  error?: string;
}