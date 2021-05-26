export const removeEmpty = obj => Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined ))
