// app/managers/[id]/page.jsx
import ManagerDetails from '@/components/ManagerDetails/ManagerDetails';

async function getManager(id) {
    // جلب بيانات المدير من API
    const response = await fetch(`/api/managers/${id}`);
    return response.json();
}

async function getRounds(managerId) {
    // جلب جولات المدير
    const response = await fetch(`/api/managers/${managerId}/rounds`);
    return response.json();
}

export default async function ManagerDetailsPage({ params }) {
    const manager = await getManager(params.id);
    const rounds = await getRounds(params.id);

    const handleUpdate = (manager) => {
        // التوجه إلى صفحة التحديث
        window.location.href = `/managers/${manager.id}/edit`;
    };

    const handleDelete = async (managerId) => {
        const response = await fetch(`/api/managers/${managerId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            // التوجه إلى قائمة المديرين
            window.location.href = '/managers';
        }
    };

    const handlePrintReport = (manager) => {
        // طباعة مخصصة أو توليد PDF
        window.print();
    };

    return (
        <ManagerDetails
            manager={manager}
            rounds={rounds}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onPrintReport={handlePrintReport}
        />
    );
}