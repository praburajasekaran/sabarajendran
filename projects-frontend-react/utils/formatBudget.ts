/**
 * Format a raw budget number into Indian numbering system (Lakhs/Crores)
 * @param rawBudget - The numeric budget value
 * @param language - The language ('en' or 'ta')
 * @returns Formatted budget string
 */
export const formatBudgetTotal = (rawBudget: number, language: 'en' | 'ta' = 'en'): string => {
    if (rawBudget === 0) {
        return language === 'ta' ? '₹0' : '₹0';
    }

    if (rawBudget < 0) {
        return language === 'ta' ? '₹0' : '₹0';
    }

    // Convert to Crores (1 Crore = 10,000,000)
    if (rawBudget >= 10000000) {
        const crores = rawBudget / 10000000;
        const formatted = crores.toFixed(2);
        return language === 'ta'
            ? `₹${formatted} கோடி`
            : `₹${formatted} Cr`;
    }

    // Convert to Lakhs (1 Lakh = 100,000)
    if (rawBudget >= 100000) {
        const lakhs = rawBudget / 100000;
        const formatted = lakhs.toFixed(2);
        return language === 'ta'
            ? `₹${formatted} லட்சம்`
            : `₹${formatted} L`;
    }

    // Less than 1 Lakh - show in thousands
    if (rawBudget >= 1000) {
        const thousands = rawBudget / 1000;
        const formatted = thousands.toFixed(2);
        return language === 'ta'
            ? `₹${formatted} ஆயிரம்`
            : `₹${formatted} K`;
    }

    // Less than 1000
    return `₹${rawBudget.toLocaleString('en-IN')}`;
};
