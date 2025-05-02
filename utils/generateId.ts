export const generateId = () => 
    crypto.randomUUID ? crypto.randomUUID() :  Math.random().toString(36).substring(2,15)