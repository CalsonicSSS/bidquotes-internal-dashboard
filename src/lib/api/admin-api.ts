import { AdminJobDetailResponse, PaginatedJobsResponse } from '../types/admin-types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// =====================================
// Job Validation API Calls
// =====================================

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
