'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getJobDetail, validateJob, deleteJob } from '@/lib/api/admin-job-api';
import { Loader2, ArrowLeft, CheckCircle, Trash2, Mail, Phone, MapPin, DollarSign, Calendar } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const jobId = params.jobId as string;
  const [imageError, setImageError] = useState<{ [key: string]: boolean }>({});

  // Fetch job detail
  const {
    data: job,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['admin-job-detail', jobId],
    queryFn: () => getJobDetail(jobId),
  });

  // Validate mutation
  const validateMutation = useMutation({
    mutationFn: () => validateJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-job-detail', jobId] });
      // will mark all queries with keys starting with ['admin-jobs'] as stale (very important)
      // the query with ['admin-jobs', currentPage] will be refetched if it's active | If it's not active, it will be marked as stale and will refetch the next time it becomes active.
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteJob(jobId),
    onSuccess: () => {
      router.push('/admin/job-validation');
    },
  });

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className='space-y-6'>
        <Link href='/admin/job-validation' className='inline-flex items-center gap-2 text-sm font-inter text-gray-600 hover:text-gray-900'>
          <ArrowLeft className='h-4 w-4' />
          Back to Jobs
        </Link>
        <div className='text-center py-12'>
          <p className='font-inter text-red-600'>Error loading job details. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6 max-w-6xl'>
      {/* Back Button */}
      <Link href='/admin/job-validation' className='inline-flex items-center gap-2 text-sm font-inter text-gray-600 hover:text-gray-900'>
        <ArrowLeft className='h-4 w-4' />
        Back to Jobs
      </Link>

      {/* Header with Actions */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h2 className='text-2xl font-bold font-roboto text-gray-900'>{job.title}</h2>
          <p className='font-inter text-sm text-gray-500 mt-1'>Job ID: {job.id}</p>
        </div>
        <div className='flex items-center gap-3'>
          {job.is_validated ? (
            <Badge variant='default' className='flex items-center gap-1 bg-green-200 text-green-800 rounded-full px-4 py-2'>
              <CheckCircle className='w-4 h-4' />
              Validated
            </Badge>
          ) : (
            <button
              onClick={() => validateMutation.mutate()}
              disabled={validateMutation.isPending}
              className='inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-inter text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              {validateMutation.isPending ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  Validating...
                </>
              ) : (
                <>
                  <CheckCircle className='h-4 w-4' />
                  Validate Job
                </>
              )}
            </button>
          )}
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
                deleteMutation.mutate();
              }
            }}
            disabled={deleteMutation.isPending}
            className='inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-inter text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin' />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className='h-4 w-4' />
                Delete
              </>
            )}
          </button>
        </div>
      </div>

      {/* Job Images Gallery */}
      {job.images && job.images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='text-lg font-roboto'>Job Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {job.images.map((image) => (
                <div key={image.id} className='relative aspect-video rounded-lg overflow-hidden bg-gray-100'>
                  {!imageError[image.id] ? (
                    <Image
                      src={image.image_url}
                      alt={`Job image ${image.image_order}`}
                      fill
                      className='object-cover'
                      onError={() => setImageError({ ...imageError, [image.id]: true })}
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center'>
                      <p className='text-sm font-inter text-gray-500'>Image unavailable</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Job Details */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Main Details */}
        <div className='lg:col-span-2 space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg font-roboto'>Job Information</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm font-inter text-gray-500 mb-1'>Job Type</p>
                  <p className='font-inter font-medium text-gray-900'>{job.job_type}</p>
                </div>
                <div>
                  <p className='text-sm font-inter text-gray-500 mb-1'>Budget</p>
                  <p className='font-inter font-medium text-gray-900'>{job.job_budget}</p>
                </div>
                <div>
                  <p className='text-sm font-inter text-gray-500 mb-1'>Status</p>
                  <Badge variant='outline' className='w-fit'>
                    {job.status}
                  </Badge>
                </div>
                <div>
                  <p className='text-sm font-inter text-gray-500 mb-1'>Posted On</p>
                  <p className='font-inter font-medium text-gray-900'>{new Date(job.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <p className='text-sm font-inter text-gray-500 mb-2'>Location & Address</p>
                <div className='flex items-start gap-2 text-gray-900'>
                  <MapPin className='h-5 w-5 text-gray-400 mt-0.5 shrink-0' />
                  <div className='font-inter'>
                    <p className='font-medium'>{job.location_address}</p>
                    <p className='text-sm text-gray-600'>City: {job.city}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className='text-sm font-inter text-gray-500 mb-2'>Description</p>
                <p className='font-inter text-gray-900 whitespace-pre-wrap'>{job.description}</p>
              </div>

              {job.other_requirements && (
                <div>
                  <p className='text-sm font-inter text-gray-500 mb-2'>Additional Requirements</p>
                  <p className='font-inter text-gray-900 whitespace-pre-wrap'>{job.other_requirements}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Buyer Contact Info */}
        <div className='lg:col-span-1'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg font-roboto'>Buyer Contact</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center gap-3'>
                <Mail className='h-5 w-5 text-gray-400' />
                <div>
                  <p className='text-xs font-inter text-gray-500'>Email</p>
                  <a href={`mailto:${job.buyer_contact.contact_email}`} className='font-inter text-sm text-blue-600 hover:underline break-all'>
                    {job.buyer_contact.contact_email}
                  </a>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <Phone className='h-5 w-5 text-gray-400' />
                <div>
                  <p className='text-xs font-inter text-gray-500'>Phone</p>
                  <a href={`tel:${job.buyer_contact.phone_number}`} className='font-inter text-sm text-blue-600 hover:underline'>
                    {job.buyer_contact.phone_number}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
