'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  fetchManagerDetails,
  deleteManager,
  selectCurrentManager,
  selectAllRounds,
  selectDetailsLoading,
  selectDetailsError,
  selectDeleteLoading,
  clearCurrentManager,
  clearError
} from '@/store/slices/managerSlice';
import ManagerDetails from '@/components/ManagerDetails/ManagerDetails';

export default function ManagerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Redux state
  const manager = useAppSelector(selectCurrentManager);
  const rounds = useAppSelector(selectAllRounds);
  const loading = useAppSelector(selectDetailsLoading);
  const error = useAppSelector(selectDetailsError);
  const deleteLoading = useAppSelector(selectDeleteLoading);

  useEffect(() => {
    if (params.id) {
      dispatch(fetchManagerDetails(params.id));
    }

    // Cleanup when component unmounts
    return () => {
      dispatch(clearCurrentManager());
      dispatch(clearError('details'));
    };
  }, [params.id, dispatch]);

  const handleUpdate = (manager) => {
    // التوجه إلى صفحة التحديث
    router.push(`/managers/edit/${manager._id || manager.id}`);
  };

  const handleDelete = async (managerId) => {
    try {
      await dispatch(deleteManager(managerId)).unwrap();
      // التوجه إلى قائمة المديرين
      router.push('/managers');
    } catch (error) {
      console.error('Error deleting manager:', error);
    }
  };

  const handlePrintReport = (manager) => {
    // طباعة مخصصة أو توليد PDF
    window.print();
  };

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
        <div>Loading manager details...</div>
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
        <div>Error: {error}</div>
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

  // No manager found
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

  // Format rounds data for the component
  const formattedRounds = manager.lastRounds?.map(round => ({
    id: round._id,
    location: round.location,
    day: round.day,
    hijriDate: round.Hijri ? 
      `${round.Hijri.year}-${String(round.Hijri.month).padStart(2, '0')}-${String(round.Hijri.day).padStart(2, '0')} ${round.Hijri.time}` :
      'N/A'
  })) || [];

  return (
    <ManagerDetails
      manager={{
        id: manager._id,
        name: manager.name,
        rank: manager.rank,
        department: manager.department,
        avatar: manager.avatar || "https://via.placeholder.com/128"
      }}
      rounds={formattedRounds}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      onPrintReport={handlePrintReport}
      isDeleting={deleteLoading}
    />
  );
}