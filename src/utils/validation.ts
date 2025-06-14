
// Input validation utilities for enhanced security

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateTurkishPhone = (phone: string): boolean => {
  // Turkish mobile phone format: +90 5XX XXX XX XX or 05XX XXX XX XX
  const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateIdNumber = (idNumber: string): boolean => {
  // Basic validation for Turkish ID number (11 digits)
  const cleanId = idNumber.replace(/\s/g, '');
  return /^[1-9][0-9]{10}$/.test(cleanId);
};

export const validatePrescriptionData = (data: any): string[] => {
  const errors: string[] = [];
  
  // Basic required field validation
  if (!data.firstName?.trim()) {
    errors.push("First name is required");
  }
  
  if (!data.lastName?.trim()) {
    errors.push("Last name is required");
  }
  
  if (!data.email?.trim()) {
    errors.push("Email is required");
  } else if (!validateEmail(data.email)) {
    errors.push("Please enter a valid email address");
  }
  
  if (!data.idNumber?.trim()) {
    errors.push("ID number is required");
  } else if (!validateIdNumber(data.idNumber)) {
    errors.push("Please enter a valid Turkish ID number");
  }
  
  if (data.phone && !validateTurkishPhone(data.phone)) {
    errors.push("Please enter a valid Turkish phone number");
  }
  
  // Medical data validation
  if (data.visionType === 'single' || data.visionType === 'bifocal') {
    if (!data.rightEye?.sph && !data.leftEye?.sph) {
      errors.push("At least one eye prescription is required");
    }
  }
  
  if (data.visionType === 'progressive') {
    if (!data.rightEyeFar?.sph && !data.leftEyeFar?.sph) {
      errors.push("Far vision prescription is required for progressive lenses");
    }
  }
  
  return errors;
};

export const sanitizeInput = (input: string): string => {
  // Remove potentially dangerous characters
  return input.replace(/[<>\"']/g, '').trim();
};
