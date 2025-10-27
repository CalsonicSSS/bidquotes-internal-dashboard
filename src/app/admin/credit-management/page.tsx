'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getJobBidInquiry, addCreditToContractor } from '@/lib/api/admin-credit-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Plus, Mail, Phone, MapPin, User, Briefcase } from 'lucide-react';

export default function CreditManagementPage() {
  const queryClient = useQueryClient();
  const [jobId, setJobId] = useState('');
  const [bidId, setBidId] = useState('');
  const [error, setError] = useState('');

  // Fetch inquiry mutation
  const {
    data: inquiryData,
    isLoading: isLoadingInquiry,
    refetch,
  } = useQuery({
    queryKey: ['job-bid-inquiry', jobId, bidId],
    queryFn: () => getJobBidInquiry(jobId.trim(), bidId.trim()),
    enabled: false, // Don't auto-fetch on mount
    retry: false, // Don't retry on error for manual searches
  });

  // Add credit mutation
  const addCreditMutation = useMutation({
    mutationFn: (contractorId: string) => addCreditToContractor(contractorId),
    onSuccess: (data) => {
      // Refresh the inquiry to show updated credit balance
      // we have to use "refetch" here instead of queryClient.invalidateQueries -> as this query has "enabled: false" and needs to be manually triggered
      refetch();
      alert(`Successfully added ${data.credits_added} credit(s). New balance: ${data.new_balance}`);
    },
    onError: (error: Error) => {
      alert(`Failed to add credit: ${error.message}`);
    },
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobId.trim() || !bidId.trim()) {
      setError('Both Job ID and Bid ID are required');
      return;
    }
    setError('');

    // Manually trigger the query
    const result = await refetch();

    if (result.isError) {
      setError('Failed to fetch details. Please check the IDs and try again.');
    }
  };

  const handleAddCredit = () => {
    if (!inquiryData) return;

    if (
      window.confirm(
        `Add 1 credit to contractor "${inquiryData.contractor_contact.contractor_name}"?\n\nThis will increase their credit balance from ${
          inquiryData.contractor_current_credits
        } to ${inquiryData.contractor_current_credits + 1}.`
      )
    ) {
      addCreditMutation.mutate(inquiryData.contractor_id);
    }
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className='space-y-6 max-w-6xl'>
      <div>
        <h2 className='text-2xl font-bold font-roboto text-gray-900'>Credit Management</h2>
        <p className='font-inter text-gray-600 mt-1'>Verify contractor claims and manage credit refunds</p>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg font-roboto'>Job & Bid Inquiry</CardTitle>
        </CardHeader>
        <CardContent>
          {/* When the user submits the form (via the button or pressing Enter), call handleSearch. */}
          {/* Click a button with type="submit", OR Press Enter while focused on an input inside the form. */}
          <form onSubmit={handleSearch} className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label htmlFor='jobId' className='block text-sm font-inter font-medium text-gray-700 mb-2'>
                  Job ID
                </label>
                <input
                  id='jobId'
                  type='text'
                  value={jobId}
                  onChange={(e) => setJobId(e.target.value)}
                  placeholder='Enter job ID...'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg font-inter text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
                />
              </div>
              <div>
                <label htmlFor='bidId' className='block text-sm font-inter font-medium text-gray-700 mb-2'>
                  Bid ID
                </label>
                <input
                  id='bidId'
                  type='text'
                  value={bidId}
                  onChange={(e) => setBidId(e.target.value)}
                  placeholder='Enter bid ID...'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg font-inter text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
                />
              </div>
            </div>

            {error && (
              <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
                <p className='text-sm font-inter text-red-800'>{error}</p>
              </div>
            )}

            <button
              // When clicked, submit the parent form -> it will trigger the form's onSubmit handler (handleSearch).
              // So this button doesn’t directly call handleSearch; instead, it triggers the form’s onSubmit, which then calls handleSearch.
              // if type is "button", Clicking it would not trigger onSubmit of the form automatically.
              type='submit'
              disabled={isLoadingInquiry}
              className='inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-inter text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              {isLoadingInquiry ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  Searching...
                </>
              ) : (
                <>
                  <Search className='h-4 w-4' />
                  Search Inquiry
                </>
              )}
            </button>
          </form>
        </CardContent>
      </Card>

      {/* Inquiry Results */}
      {inquiryData && (
        <div className='space-y-6'>
          {/* Credit Action Card */}
          <Card className='bg-blue-50 border-blue-200'>
            <CardContent className='pt-6'>
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                <div>
                  <p className='font-roboto font-semibold text-gray-900 text-lg'>Current Credit Balance: {inquiryData.contractor_current_credits}</p>
                  <p className='font-inter text-sm text-gray-600 mt-1'>Contractor: {inquiryData.contractor_contact.contractor_name}</p>
                </div>
                <button
                  onClick={handleAddCredit}
                  disabled={addCreditMutation.isPending}
                  className='inline-flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg font-inter text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                >
                  {addCreditMutation.isPending ? (
                    <>
                      <Loader2 className='h-4 w-4 animate-spin' />
                      Adding Credit...
                    </>
                  ) : (
                    <>
                      <Plus className='h-4 w-4' />
                      Add 1 Credit
                    </>
                  )}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Contractor Contact */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg font-roboto flex items-center gap-2'>
                  <Briefcase className='h-5 w-5 text-blue-600' />
                  Contractor Contact
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='flex items-start gap-3'>
                  <User className='h-5 w-5 text-gray-400 mt-0.5 shrink-0' />
                  <div>
                    <p className='text-xs font-inter text-gray-500'>Name</p>
                    <p className='font-inter text-sm font-medium text-gray-900'>{inquiryData.contractor_contact.contractor_name}</p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <Mail className='h-5 w-5 text-gray-400 mt-0.5 shrink-0' />
                  <div>
                    <p className='text-xs font-inter text-gray-500'>Email</p>
                    <a href={`mailto:${inquiryData.contractor_contact.email}`} className='font-inter text-sm text-blue-600 hover:underline break-all'>
                      {inquiryData.contractor_contact.email}
                    </a>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <Phone className='h-5 w-5 text-gray-400 mt-0.5 shrink-0' />
                  <div>
                    <p className='text-xs font-inter text-gray-500'>Phone</p>
                    <a href={`tel:${inquiryData.contractor_contact.phone}`} className='font-inter text-sm text-blue-600 hover:underline'>
                      {inquiryData.contractor_contact.phone}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Buyer Contact */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg font-roboto flex items-center gap-2'>
                  <User className='h-5 w-5 text-green-600' />
                  Buyer Contact
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='flex items-start gap-3'>
                  <Mail className='h-5 w-5 text-gray-400 mt-0.5 shrink-0' />
                  <div>
                    <p className='text-xs font-inter text-gray-500'>Email</p>
                    <a href={`mailto:${inquiryData.buyer_contact.contact_email}`} className='font-inter text-sm text-blue-600 hover:underline break-all'>
                      {inquiryData.buyer_contact.contact_email}
                    </a>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <Phone className='h-5 w-5 text-gray-400 mt-0.5 shrink-0' />
                  <div>
                    <p className='text-xs font-inter text-gray-500'>Phone</p>
                    <a href={`tel:${inquiryData.buyer_contact.phone_number}`} className='font-inter text-sm text-blue-600 hover:underline'>
                      {inquiryData.buyer_contact.phone_number}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Job & Bid Details */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Job Details */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg font-roboto'>Job Details</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <p className='text-sm font-inter text-gray-500 mb-1'>Title</p>
                  <p className='font-inter font-semibold text-gray-900'>{inquiryData.job_title}</p>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm font-inter text-gray-500 mb-1'>Type</p>
                    <Badge variant='outline'>{inquiryData.job_type}</Badge>
                  </div>
                  <div>
                    <p className='text-sm font-inter text-gray-500 mb-1'>Budget</p>
                    <p className='font-inter font-medium text-gray-900'>{inquiryData.job_budget}</p>
                  </div>
                  <div>
                    <p className='text-sm font-inter text-gray-500 mb-1'>Status</p>
                    <Badge variant='outline'>{inquiryData.job_status}</Badge>
                  </div>
                  <div>
                    <p className='text-sm font-inter text-gray-500 mb-1'>Posted</p>
                    <p className='font-inter text-sm text-gray-900'>{new Date(inquiryData.job_created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div>
                  <p className='text-sm font-inter text-gray-500 mb-1'>City & Address</p>
                  <div className='flex items-start gap-2'>
                    <MapPin className='h-4 w-4 text-gray-400 mt-0.5 shrink-0' />
                    <div className='font-inter text-sm'>
                      <p className='text-gray-900'>{inquiryData.job_location_address}</p>
                      <p className='text-gray-600'>City: {inquiryData.job_city}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className='text-sm font-inter text-gray-500 mb-1'>Description</p>
                  <p className='font-inter text-sm text-gray-900 whitespace-pre-wrap'>{inquiryData.job_description}</p>
                </div>
                {inquiryData.job_other_requirements && (
                  <div>
                    <p className='text-sm font-inter text-gray-500 mb-1'>Requirements</p>
                    <p className='font-inter text-sm text-gray-900 whitespace-pre-wrap'>{inquiryData.job_other_requirements}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bid Details */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg font-roboto'>Bid Details</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <p className='text-sm font-inter text-gray-500 mb-1'>Bid Title</p>
                  <p className='font-inter font-semibold text-gray-900'>{inquiryData.bid_title}</p>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm font-inter text-gray-500 mb-1'>Price Range</p>
                    <p className='font-inter font-medium text-gray-900'>
                      {inquiryData.bid_price_min} - {inquiryData.bid_price_max}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-inter text-gray-500 mb-1'>Timeline</p>
                    <p className='font-inter font-medium text-gray-900'>{inquiryData.bid_timeline_estimate}</p>
                  </div>
                  <div>
                    <p className='text-sm font-inter text-gray-500 mb-1'>Status</p>
                    <Badge variant='outline'>{inquiryData.bid_status}</Badge>
                  </div>
                  <div>
                    <p className='text-sm font-inter text-gray-500 mb-1'>Submitted</p>
                    <p className='font-inter text-sm text-gray-900'>{new Date(inquiryData.bid_created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className='bg-gray-50 rounded-lg p-4 space-y-2'>
                  <p className='text-xs font-inter font-medium text-gray-700 uppercase tracking-wide'>Reference IDs</p>
                  <div className='space-y-1'>
                    <p className='font-inter text-xs text-gray-600'>
                      Job ID: <span className='font-mono bg-white px-2 py-0.5 rounded'>{inquiryData.job_id}</span>
                    </p>
                    <p className='font-inter text-xs text-gray-600'>
                      Bid ID: <span className='font-mono bg-white px-2 py-0.5 rounded'>{inquiryData.bid_id}</span>
                    </p>
                    <p className='font-inter text-xs text-gray-600'>
                      Contractor ID: <span className='font-mono bg-white px-2 py-0.5 rounded'>{inquiryData.contractor_id}</span>
                    </p>
                    <p className='font-inter text-xs text-gray-600'>
                      Buyer ID: <span className='font-mono bg-white px-2 py-0.5 rounded'>{inquiryData.buyer_id}</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
