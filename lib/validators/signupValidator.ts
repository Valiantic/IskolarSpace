import { ValidationResult } from "../../app/types/signup"


export const validateName = (name: string): ValidationResult => {
    const errors: string[] = [];

    if (name.length > 20) {
        errors.push("Name cannot exceed 20 characters");
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];
  const rules = [
    { test: (p: string) => p.length >= 8, message: "At least 8 characters" },
    { test: (p: string) => /[A-Z]/.test(p), message: "One uppercase letter" },
    { test: (p: string) => /[a-z]/.test(p), message: "One lowercase letter" },
    { test: (p: string) => /\d/.test(p), message: "One number" },
    { test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p), message: "One special character" }
  ];

  rules.forEach(rule => {
    if (!rule.test(password)) {
      errors.push(rule.message);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateForm = (name: string, email: string, password: string): ValidationResult => {
  const nameValidation = validateName(name);
  const passwordValidation = validatePassword(password);
  
  const allErrors = [...nameValidation.errors, ...passwordValidation.errors];
  
  if (!email.trim()) {
    allErrors.push("Email is required");
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
};