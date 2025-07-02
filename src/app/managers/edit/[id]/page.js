'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  fetchManagerDetails,
  updateManager,
  selectCurrentManager,
  selectDetailsLoading,
  selectDetailsError,
  selectUpdateLoading,
  selectUpdateError,
  clearCurrentManager,
  clearError
} from '@/store/slices/managerSlice';
import EditManager from '@/components/EditManager/EditManager';

export default function EditManagerPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Redux state
  const manager = useAppSelector(selectCurrentManager);
  const detailsLoading = useAppSelector(selectDetailsLoading);
  const detailsError = useAppSelector(selectDetailsError);
  const updateLoading = useAppSelector(selectUpdateLoading);
  const updateError = useAppSelector(selectUpdateError);

  useEffect(() => {
    if (params.id) {
      dispatch(fetchManagerDetails(params.id));
    }

    // Cleanup when component unmounts
    return () => {
      dispatch(clearCurrentManager());
      dispatch(clearError('details'));
      dispatch(clearError('update'));
    };
  }, [params.id, dispatch]);

  const handleSave = async (formData) => {
    try {
      await dispatch(updateManager({ 
        id: params.id, 
        data: formData 
      })).unwrap();
      
      // التوجه إلى صفحة التفاصيل
      router.push(`/managers/${params.id}`);
    } catch (error) {
      // Error is handled by Redux state
      console.error('Error updating manager:', error);
    }
  };

  const handleCancel = () => {
    // العودة إلى صفحة التفاصيل
    router.push(`/managers/${params.id}`);
  };

  // Loading state for fetching manager details
  if (detailsLoading) {
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
        <div>Loading manager data...</div>
      </div>
    );
  }

  // Error state for fetching manager details
  if (detailsError) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div>Error loading manager: {detailsError}</div>
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
          Try Again
        </button>
      </div>
    );
  }

  // Manager not found
  if (!manager) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <div>Manager not found</div>
      </div>
    );
  }

  return (
    <EditManager
      manager={{
        id: manager._id,
        name: manager.name,
        rank: manager.rank,
        department: manager.department
      }}
      onSave={handleSave}
      onCancel={handleCancel}
      isSubmitting={updateLoading}
      error={updateError}
    />
  );
}