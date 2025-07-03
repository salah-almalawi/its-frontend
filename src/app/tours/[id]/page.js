
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
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif', direction: 'rtl', textAlign: 'right' }}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap gap-2 p-4">
              <a className="text-[#60768a] text-base font-medium leading-normal" href="#">الجولات</a>
              <span className="text-[#60768a] text-base font-medium leading-normal">/</span>
              <span className="text-[#111518] text-base font-medium leading-normal">تفاصيل الجولة</span>
            </div>
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-[#111518] tracking-light text-[32px] font-bold leading-tight">تفاصيل الجولة</p>
                <p className="text-[#60768a] text-sm font-normal leading-normal">عرض وإدارة تفاصيل جولة التفتيش هذه.</p>
              </div>
            </div>
            <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dbe1e6] py-5">
                <p className="text-[#60768a] text-sm font-normal leading-normal">اسم المدير</p>
                <p className="text-[#111518] text-sm font-normal leading-normal">{tour.managerName || 'N/A'}</p>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dbe1e6] py-5">
                <p className="text-[#60768a] text-sm font-normal leading-normal">الموقع</p>
                <p className="text-[#111518] text-sm font-normal leading-normal">{tour.location || 'N/A'}</p>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dbe1e6] py-5">
                <p className="text-[#60768a] text-sm font-normal leading-normal">اليوم</p>
                <p className="text-[#111518] text-sm font-normal leading-normal">{tour.day || 'N/A'}</p>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dbe1e6] py-5">
                <p className="text-[#60768a] text-sm font-normal leading-normal">التاريخ</p>
                <p className="text-[#111518] text-sm font-normal leading-normal">{tour.Hijri ? `${tour.Hijri.year}/${String(tour.Hijri.month).padStart(2, '0')}/${String(tour.Hijri.day).padStart(2, '0')} ${tour.Hijri.time}` : 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
