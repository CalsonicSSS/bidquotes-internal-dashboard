// =====================================
// Job Validation Types
// =====================================

export interface AdminJobImageResponse {
  id: string;
  image_url: string;
  image_order: number;
}

export interface BuyerContactResponse {
  contact_email: string;
  phone_number: string;
}

export interface AdminJobCardResponse {
  id: string;
  title: string;
  job_type: string;
  job_budget: string;
  city: string;
  status: string;
  is_validated: boolean;
  thumbnail_url: string | null;
  created_at: string;
}

export interface AdminJobDetailResponse {
  // Job fields
  id: string;
  buyer_id: string;
  title: string;
  job_type: string;
  job_budget: string;
  description: string;
  location_address: string;
  city: string;
  other_requirements: string | null;
  status: string;
  is_validated: boolean;
  created_at: string;
  updated_at: string;

  // Job images
  images: AdminJobImageResponse[];

  // Buyer contact info
  buyer_contact: BuyerContactResponse;
}

export interface PaginatedJobsResponse {
  jobs: AdminJobCardResponse[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
