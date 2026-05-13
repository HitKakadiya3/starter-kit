/**
 * Narrow shapes for Module 1. Other modules may extend.
 */

export interface ApiQuestionOption {
  id: string;
  text: string;
  // Backend sometimes omits weight on legacy rows; always ignored by the frontend.
  weight?: number;
  // Keep open — backend may send more fields we don't care about.
  [k: string]: unknown;
}

export interface ApiQuestion {
  id: string;
  // Backend returns this as a stringified number in live responses.
  question_type_id: number | string;
  text: string;
  options: ApiQuestionOption[];
  [k: string]: unknown;
}

export interface QuizAnswer {
  id: string; // question id
  answer: string; // option id (PRD Assumption A1)
}

export interface PricingPaymentGateway {
  id: string;
  name: string;
}

export interface PricingInfo {
  currency_code: string;
  /** Numeric string, e.g. "4.99". Kept as string so backend's locale-safe
   *  labels are the render surface and JS floats are not the source of truth. */
  first_sale_price: string;
  first_sale_price_label: string;
  cross_sale_price: string;
  cross_sale_price_label: string;
  subscription_price: string;
  subscription_price_label: string;
  /** Post-submit responses only (POST /price omits this pre-submit). */
  subscription_day_label?: string;
  /** Post-submit responses only. */
  first_and_cross_sale_price_label?: string;
  /** Post-submit responses only. Module 4 will consume these. */
  show_cross_sale_page?: boolean;
  cross_sale_compulsory?: boolean;
  payment_gateways: PricingPaymentGateway[];
  /** Backend occasionally adds fields; do not let that break typecheck. */
  [k: string]: unknown;
}

export interface QuizSubmitRequestBody {
  email: string;
  variant_type: "";
  quiz_data: QuizAnswer[];
  start_time: number;
  end_time: number;
  prc_id: string;
  pricing_discount: { mdid: string };
  user_device_info: {
    user_device: string;
    user_os: string;
    user_browser: string;
  };
  landing_url_detail: {
    landing_url: string;
    landing_time: number | null;
  };
  geo_data: { city: string; region: string };
}

export interface QuizSubmitResponse {
  quiz_result_id: number;
  encrypted_quiz_result_id: string;
  email?: string;
  pricing_info?: PricingInfo;
  redirect_page?: string;
  [k: string]: unknown;
}
