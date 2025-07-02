'use client';

import { useRouter } from 'next/navigation';
import CreateManager from '@/components/CreateManager/CreateManager';

export default function CreateManagerPage() {
  const router = useRouter();

  const handleSuccess = (newManager) => {
    // التوجه إلى صفحة تفاصيل المدير الجديد
    router.push(`/managers/${newManager._id || newManager.id}`);
  };

  const handleCancel = () => {
    // العودة إلى قائمة المديرين
    router.push('/managers');
  };

  return (
    <CreateManager
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
}