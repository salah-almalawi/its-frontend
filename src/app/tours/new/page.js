'use client';

import { useRouter } from 'next/navigation';
import CreateTour from '@/components/CreateTour/CreateTour';

export default function CreateTourPage() {
  const router = useRouter();

  const handleSuccess = (newTour) => {
    // التوجه إلى صفحة تفاصيل الجولة الجديدة
    router.push(`/tours/${newTour._id || newTour.id}`);
  };

  const handleCancel = () => {
    // العودة إلى قائمة الجولات
    router.push('/tours');
  };

  return (
    <CreateTour
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
}
