export const formatDate = (value?: string, lang?: string): string => {
return value
    ? new Date(value).toLocaleString(lang ?? 'en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
    })
    : '';
};

export const formatDateWithTime = (value?: string, lang?: string): string => {
return value
    ? new Date(value).toLocaleString(lang ?? 'en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    })
    : '';
};