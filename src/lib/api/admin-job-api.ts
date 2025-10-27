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

// =====================================
// Job Validation API Calls
// =====================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getAllJobsPaginated(page: number = 1, pageSize: number = 30): Promise<PaginatedJobsResponse> {
  const response = await fetch(`${API_BASE_URL}/admin/jobs?page=${page}&page_size=${pageSize}`);

  if (!response.ok) {
    throw new Error('Failed to fetch jobs');
  }

  return response.json();
}

export async function getJobDetail(jobId: string): Promise<AdminJobDetailResponse> {
  const response = await fetch(`${API_BASE_URL}/admin/jobs/${jobId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch job detail');
  }

  return response.json();
}

export async function validateJob(jobId: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/admin/jobs/${jobId}/validate`, {
    method: 'PUT',
  });

  if (!response.ok) {
    throw new Error('Failed to validate job');
  }

  return response.json();
}

export async function deleteJob(jobId: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/admin/jobs/${jobId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete job');
  }

  return response.json();
}
