// API utility functions

/**
 * تنسيق بيانات المدير للعرض
 * @param {Object} manager - بيانات المدير من API
 * @returns {Object} - بيانات المدير المنسقة
 */
export const formatManagerData = (manager) => {
    if (!manager) return null;

    return {
        id: manager._id || manager.id,
        name: manager.name || '',
        rank: manager.rank || '',
        department: manager.department || '',
        avatar: manager.avatar || 'https://via.placeholder.com/128',
        createdAt: manager.createdAt,
        updatedAt: manager.updatedAt,
        lastRounds: manager.lastRounds || []
    };
};

/**
 * تنسيق بيانات الجولة للعرض
 * @param {Object} round - بيانات الجولة من API
 * @returns {Object} - بيانات الجولة المنسقة
 */
export const formatRoundData = (round) => {
    if (!round) return null;

    return {
        id: round._id || round.id,
        location: round.location || '',
        day: round.day || '',
        hijriDate: round.Hijri ?
            `${round.Hijri.year}-${String(round.Hijri.month).padStart(2, '0')}-${String(round.Hijri.day).padStart(2, '0')} ${round.Hijri.time}` :
            'N/A',
        managerName: round.managerName || '',
        managerRank: round.managerRank || '',
        managerDepartment: round.managerDepartment || '',
        createdAt: round.createdAt,
        updatedAt: round.updatedAt
    };
};

/**
 * تحويل قائمة المديرين إلى تنسيق موحد
 * @param {Array} managers - قائمة المديرين من API
 * @returns {Array} - قائمة المديرين المنسقة
 */
export const formatManagersList = (managers) => {
    if (!Array.isArray(managers)) return [];

    return managers.map(manager => formatManagerData(manager));
};

/**
 * تحويل قائمة الجولات إلى تنسيق موحد
 * @param {Array} rounds - قائمة الجولات من API
 * @returns {Array} - قائمة الجولات المنسقة
 */
export const formatRoundsList = (rounds) => {
    if (!Array.isArray(rounds)) return [];

    return rounds.map(round => formatRoundData(round));
};

/**
 * استخراج رسالة الخطأ من استجابة API
 * @param {Error} error - خطأ من API
 * @returns {string} - رسالة الخطأ
 */
export const extractErrorMessage = (error) => {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }

    if (error.message) {
        return error.message;
    }

    return 'An unexpected error occurred';
};

/**
 * التحقق من صحة بيانات المدير
 * @param {Object} managerData - بيانات المدير
 * @returns {Object} - نتيجة التحقق { isValid, errors }
 */
export const validateManagerData = (managerData) => {
    const errors = {};

    if (!managerData.name?.trim()) {
        errors.name = 'Name is required';
    }

    if (!managerData.rank?.trim()) {
        errors.rank = 'Rank is required';
    }

    if (!managerData.department?.trim()) {
        errors.department = 'Department is required';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * تحويل التاريخ الهجري إلى تنسيق قابل للقراءة
 * @param {Object} hijriDate - التاريخ الهجري
 * @returns {string} - التاريخ المنسق
 */
export const formatHijriDate = (hijriDate) => {
    if (!hijriDate || typeof hijriDate !== 'object') {
        return 'N/A';
    }

    const { year, month, day, time } = hijriDate;

    if (!year || !month || !day) {
        return 'Invalid Date';
    }

    const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    if (time) {
        return `${formattedDate} ${time}`;
    }

    return formattedDate;
};

/**
 * إنشاء URL للصورة الافتراضية
 * @param {string} name - اسم المدير
 * @returns {string} - URL الصورة
 */
export const generateAvatarUrl = (name) => {
    if (!name) return 'https://via.placeholder.com/128';

    // يمكن استخدام خدمة مثل UI Avatars
    const initials = name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0b80ee&color=fff&size=128&format=png&rounded=true&font-size=0.6&length=2`;
};

/**
 * تنظيف بيانات النموذج قبل الإرسال
 * @param {Object} formData - بيانات النموذج
 * @returns {Object} - البيانات المنظفة
 */
export const sanitizeFormData = (formData) => {
    const cleaned = {};

    Object.keys(formData).forEach(key => {
        const value = formData[key];

        if (typeof value === 'string') {
            cleaned[key] = value.trim();
        } else {
            cleaned[key] = value;
        }
    });

    return cleaned;
};