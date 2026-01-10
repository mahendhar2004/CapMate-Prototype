/**
 * Validation utility functions
 */

/**
 * Email validation
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Password validation
 * Minimum 8 characters, at least one letter and one number
 */
export const isValidPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Phone number validation (Indian format)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

/**
 * Name validation (at least 2 characters)
 */
export const isValidName = (name: string): boolean => {
  return name.trim().length >= 2;
};

/**
 * Price validation
 */
export const isValidPrice = (price: number): boolean => {
  return price > 0 && price <= 1000000; // Max 10 lakhs
};

/**
 * Product title validation
 */
export const isValidProductTitle = (title: string): boolean => {
  return title.trim().length >= 3 && title.trim().length <= 100;
};

/**
 * Product description validation
 */
export const isValidProductDescription = (description: string): boolean => {
  return description.trim().length >= 10 && description.trim().length <= 1000;
};

/**
 * Validation error messages
 */
export const validationMessages = {
  email: {
    required: 'Email is required',
    invalid: 'Please enter a valid email address',
  },
  password: {
    required: 'Password is required',
    invalid: 'Password must be at least 8 characters with letters and numbers',
    mismatch: 'Passwords do not match',
  },
  phone: {
    required: 'Phone number is required',
    invalid: 'Please enter a valid 10-digit phone number',
  },
  name: {
    required: 'Name is required',
    invalid: 'Name must be at least 2 characters',
  },
  price: {
    required: 'Price is required',
    invalid: 'Please enter a valid price (1 - 10,00,000)',
  },
  title: {
    required: 'Title is required',
    invalid: 'Title must be 3-100 characters',
  },
  description: {
    required: 'Description is required',
    invalid: 'Description must be 10-1000 characters',
  },
  category: {
    required: 'Please select a category',
  },
  condition: {
    required: 'Please select condition',
  },
  image: {
    required: 'Please add at least one image',
  },
  college: {
    required: 'Please select your college',
  },
};

/**
 * Validate product form
 */
export interface ProductFormErrors {
  title?: string;
  description?: string;
  price?: string;
  category?: string;
  condition?: string;
  images?: string;
}

export const validateProductForm = (data: {
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  images: string[];
}): ProductFormErrors => {
  const errors: ProductFormErrors = {};

  if (!data.title.trim()) {
    errors.title = validationMessages.title.required;
  } else if (!isValidProductTitle(data.title)) {
    errors.title = validationMessages.title.invalid;
  }

  if (!data.description.trim()) {
    errors.description = validationMessages.description.required;
  } else if (!isValidProductDescription(data.description)) {
    errors.description = validationMessages.description.invalid;
  }

  if (!data.price) {
    errors.price = validationMessages.price.required;
  } else if (!isValidPrice(data.price)) {
    errors.price = validationMessages.price.invalid;
  }

  if (!data.category) {
    errors.category = validationMessages.category.required;
  }

  if (!data.condition) {
    errors.condition = validationMessages.condition.required;
  }

  if (!data.images.length) {
    errors.images = validationMessages.image.required;
  }

  return errors;
};
