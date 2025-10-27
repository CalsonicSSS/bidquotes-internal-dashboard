// =====================================
// Credit Management API Calls
// =====================================

export interface ContractorContactResponse {
  contractor_name: string;
  email: string;
  phone: string;
}

export interface BuyerContactResponse {
  contact_email: string;
  phone_number: string;
}

export interface JobBidInquiryResponse {
  // Job details
  job_id: string;
  job_title: string;
  job_type: string;
  job_budget: string;
  job_status: string;
  job_city: string;
  job_location_address: string;
  job_description: string;
  job_other_requirements: string | null;
  job_created_at: string;

  // Bid details
  bid_id: string;
  bid_title: string;
  bid_price_min: string;
  bid_price_max: string;
  bid_timeline_estimate: string;
  bid_status: string;
  bid_created_at: string;

  // Contractor info
  contractor_id: string;
  contractor_contact: ContractorContactResponse;

  // Buyer info
  buyer_id: string;
  buyer_contact: BuyerContactResponse;

  // Credit info
  contractor_current_credits: number;
}

export interface AddCreditResponse {
  success: boolean;
  contractor_id: string;
  credits_added: number;
  new_balance: number;
  message: string;
}

// ------------------------------------------------------------------------------------------------------------------------

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getJobBidInquiry(jobId: string, bidId: string): Promise<JobBidInquiryResponse> {
  const response = await fetch(`${API_BASE_URL}/admin/credits/inquiry?job_id=${jobId}&bid_id=${bidId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch job/bid inquiry details');
  }

  return response.json();
}

export async function addCreditToContractor(contractorId: string): Promise<AddCreditResponse> {
  const response = await fetch(`${API_BASE_URL}/admin/credits/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ contractor_id: contractorId }),
  });

  if (!response.ok) {
    throw new Error('Failed to add credit to contractor');
  }

  return response.json();
}
