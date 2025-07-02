// pages/managers/edit/[id].jsx
import EditManager from '@/components/EditManager/EditManager';
// import { useRouter } from 'next/navigation';

export default function EditManagerPage() {
  // const router = useRouter();


  return (
    <EditManager
      manager={currentManager}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}