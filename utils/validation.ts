export const validateMobileNumber = (mobile: string): boolean => {
  const mobileRegex = /^\d{10}$/;
  return mobileRegex.test(mobile);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

export const validateName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z\s]+$/;
  return nameRegex.test(name);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateOtp = (otp: string): boolean => {
  const otpRegex = /^\d{4}$/;
  return otpRegex.test(otp);
}; 