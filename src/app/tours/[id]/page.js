
'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  fetchRoundById,
  selectCurrentRound,
  selectDetailsLoading,
  selectDetailsError,
  clearCurrentRound,
  clearError
} from '@/store/slices/roundsSlice';
import TourDetails from '@/components/TourDetails/TourDetails';

export default function TourDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const tour = useAppSelector(selectCurrentRound);
  const loading = useAppSelector(selectDetailsLoading);
  const error = useAppSelector(selectDetailsError);

  useEffect(() => {
    if (params.id) {
      dispatch(fetchRoundById(params.id));
    }

    return () => {
      dispatch(clearCurrentRound());
      dispatch(clearError('details'));
    };
  }, [params.id, dispatch]);

  // Loading state
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #0b80ee',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <div>جاري تحميل تفاصيل الجولة...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div>خطأ: {error}</div>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#0b80ee',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer'
          }}
        >
          حاول مرة أخرى
        </button>
      </div>
    );
  }

  // No tour found
  if (!tour) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <div>لم يتم العثور على الجولة</div>
      </div>
    );
  }

  return (
    <TourDetails tour={tour} />
  );
}
