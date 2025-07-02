'use client';

import CreateManager from '@/components/CreateManager/CreateManager';

export default function CreateManagerPage() {
  const handleSuccess = (newManager) => {
    // التوجه إلى صفحة تفاصيل المدير الجديد
    window.location.href = `/managers/${newManager._id || newManager.id}`;
  };

  const handleCancel = () => {
    // العودة إلى قائمة المديرين
    window.location.href = '/managers';
  };

  return (
    <CreateManager
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
}