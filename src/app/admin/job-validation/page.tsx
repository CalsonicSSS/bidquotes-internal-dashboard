'use client';

import { useQuery } from '@tanstack/react-query';
import { getAllJobsPaginated } from '@/lib/api/admin-job-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function JobValidationPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-jobs', currentPage],
    queryFn: () => getAllJobsPaginated(currentPage, 30),
  });

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center py-12'>
        <p className='font-inter text-red-600'>Error loading jobs. Please try again.</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold font-roboto text-gray-900'>Job Validation</h2>
        <p className='font-inter text-gray-600 mt-1'>Review and validate posted jobs</p>
      </div>

      {/* Stats */}
      <div className='bg-white rounded-lg border border-gray-200 p-4'>
        <p className='font-inter text-sm text-gray-600'>
          Total Jobs: <span className='font-semibold text-gray-900'>{data?.total || 0}</span>
          {' • '}
          Page {data?.page} of {data?.total_pages}
        </p>
      </div>

      {/* Job Cards Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {data?.jobs.map((job) => (
          <Link key={job.id} href={`/admin/job-validation/${job.id}`} className='block'>
            <Card className='hover:shadow-lg transition-shadow cursor-pointer h-full'>
              <CardHeader className='pb-3'>
                <div className='flex items-start justify-between'>
                  <CardTitle className='text-base font-roboto'>{job.title}</CardTitle>
                  {job.is_validated ? (
                    <Badge variant='default' className='flex items-center gap-1 bg-green-200 text-green-800 rounded-full px-3 py-1 text-sm font-medium'>
                      <CheckCircle className='w-4 h-4' />
                      Validated
                    </Badge>
                  ) : (
                    <Badge variant='secondary' className='text-sm bg-gray-100 text-gray-800 rounded-full px-3 py-1 font-medium'>
                      Validation Needed
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {
                  <div className='relative w-full h-40 mb-3 rounded-md overflow-hidden bg-gray-100'>
                    {job.thumbnail_url ? (
                      <Image src={job.thumbnail_url} alt={job.title} fill className='object-cover' />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200'>
                        <div className='text-center'>
                          <svg className='mx-auto h-12 w-12 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={1.5}
                              d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                            />
                          </svg>
                          <p className='mt-2 text-xs font-inter text-gray-500'>No Image</p>
                        </div>
                      </div>
                    )}
                  </div>
                }
                <div className='space-y-2 font-inter text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Type:</span>
                    <span className='font-medium text-gray-900'>{job.job_type}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Budget:</span>
                    <span className='font-medium text-gray-900'>{job.job_budget}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>City:</span>
                    <span className='font-medium text-gray-900'>{job.city}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Status:</span>
                    <Badge variant='outline'>{job.status}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {data && data.total_pages > 1 && (
        <div className='flex justify-center gap-2 mt-6'>
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className='px-4 py-2 rounded-lg bg-white border border-gray-300 font-inter text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50'
          >
            Previous
          </button>
          <span className='px-4 py-2 font-inter text-sm text-gray-700'>
            Page {currentPage} of {data.total_pages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === data.total_pages}
            className='px-4 py-2 rounded-lg bg-white border border-gray-300 font-inter text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50'
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
