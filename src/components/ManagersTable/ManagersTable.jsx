'use client'
import styles from './ManagersTable.module.css';

const ManagersTable = () => {
    const managers = [
        {
            id: 1,
            name: "Sophia Carter",
            rank: "Senior Manager",
            department: "Marketing"
        },
        {
            id: 2,
            name: "Ethan Bennett",
            rank: "Manager",
            department: "Sales"
        },
        {
            id: 3,
            name: "Olivia Hayes",
            rank: "Director",
            department: "Operations"
        },
        {
            id: 4,
            name: "Liam Foster",
            rank: "Manager",
            department: "Finance"
        },
        {
            id: 5,
            name: "Ava Morgan",
            rank: "Senior Manager",
            department: "Human Resources"
        }
    ];

    const handleAddManager = () => {
        // Add your logic here
        console.log('Add Manager clicked');
    };

    return (
        <div className={styles.container}>
            <div className={styles.layoutContainer}>
                <div className={styles.contentWrapper}>
                    <div className={styles.layoutContentContainer}>
                        <div className={styles.header}>
                            <p className={styles.title}>Managers</p>
                            <button
                                className={styles.addButton}
                                onClick={handleAddManager}
                            >
                                <span className={styles.buttonText}>Add Manager</span>
                            </button>
                        </div>
                        <div className={styles.tableContainer}>
                            <div className={styles.tableWrapper}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr className={styles.headerRow}>
                                            <th className={`${styles.headerCell} ${styles.nameColumn}`}>
                                                Name
                                            </th>
                                            <th className={`${styles.headerCell} ${styles.rankColumn}`}>
                                                Rank
                                            </th>
                                            <th className={`${styles.headerCell} ${styles.departmentColumn}`}>
                                                Department
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {managers.map((manager) => (
                                            <tr key={manager.id} className={styles.dataRow}>
                                                <td className={`${styles.dataCell} ${styles.nameColumn} ${styles.nameCell}`}>
                                                    {manager.name}
                                                </td>
                                                <td className={`${styles.dataCell} ${styles.rankColumn} ${styles.secondaryCell}`}>
                                                    {manager.rank}
                                                </td>
                                                <td className={`${styles.dataCell} ${styles.departmentColumn} ${styles.secondaryCell}`}>
                                                    {manager.department}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagersTable;