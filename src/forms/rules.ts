export const phone = [(val: string) => /^[0-9\(\)x\s+.-]+$/.test(val) || 'Invalid phone number'];
export const required = (errorMessage: string) =>
    [(val: string) => !!val || errorMessage];