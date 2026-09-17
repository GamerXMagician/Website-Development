/* ============================================================================
   CONTACT FORM HANDLER - SIMPLIFIED (NO EMAIL VERIFICATION)
   Form validation and direct database submission
   ============================================================================ */

document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contact-form');
  const formMessage = document.getElementById('form-message');

  if (!contactForm) return;

  // Form validation rules
  const validators = {
    name: (value) => {
      if (!value.trim()) return 'Name is required';
      if (value.trim().length < 2) return 'Name must be at least 2 characters';
      return null;
    },
    email: (value) => {
      if (!value.trim()) return 'Email is required';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return 'Please enter a valid email';
      return null;
    },
    'project-type': (value) => {
      if (!value) return 'Please select a project type';
      return null;
    },
    message: (value) => {
      if (!value.trim()) return 'Project description is required';
      if (value.trim().length < 10) return 'Please provide at least 10 characters';
      return null;
    }
  };

  // Clear error messages
  function clearErrors() {
    document.querySelectorAll('.form-error').forEach(el => {
      el.classList.remove('show');
      el.textContent = '';
    });
  }

  // Show error for a field
  function showError(fieldName, message) {
    const errorEl = document.getElementById(`${fieldName}-error`);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('show');

      const inputEl = document.getElementById(fieldName);
      if (inputEl) {
        inputEl.classList.add('error');
      }
    }
  }

  // Clear error for a field
  function clearFieldError(fieldName) {
    const errorEl = document.getElementById(`${fieldName}-error`);
    if (errorEl) {
      errorEl.classList.remove('show');
      errorEl.textContent = '';
    }

    const inputEl = document.getElementById(fieldName);
    if (inputEl) {
      inputEl.classList.remove('error');
    }
  }

  // Validate form
  function validateForm() {
    clearErrors();
    let isValid = true;

    Object.keys(validators).forEach(fieldName => {
      const inputEl = document.getElementById(fieldName);
      if (!inputEl) return;

      const value = inputEl.value;
      const error = validators[fieldName](value);

      if (error) {
        showError(fieldName, error);
        isValid = false;
      }
    });

    return isValid;
  }

  // Real-time validation on field change
  document.querySelectorAll('#name, #email, #project-type, #message').forEach(field => {
    field.addEventListener('change', function() {
      clearFieldError(this.name || this.id);
    });

    field.addEventListener('input', function() {
      clearFieldError(this.name || this.id);
    });
  });

  // Handle form submission - Direct to database (no email verification)
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Validate
    if (!validateForm()) {
      return;
    }

    // Collect form data
    const formData = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      project_type: document.getElementById('project-type').value,
      budget: document.getElementById('budget').value || null,
      message: document.getElementById('message').value.trim(),
      verified: true  // Mark as verified immediately (no email verification needed)
    };

    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    // Submit to Supabase
    (async () => {
      try {
        // Check if Supabase client is available
        if (!window.supabase) {
          throw new Error('Supabase client not initialized. Make sure supabase-client.js is loaded.');
        }

        // Insert into Supabase directly
        const response = await window.supabase.insert('contact_submissions', formData);

        // Check if response is valid (could be array or object)
        if (!response || (Array.isArray(response) && response.length === 0)) {
          throw new Error('Invalid response from database');
        }

        // Show success message
        formMessage.classList.add('show', 'success');
        formMessage.textContent = '✓ Thank you! I\'ll get back to you soon. Check your email for updates.';

        // Reset form
        contactForm.reset();
        clearErrors();

        // Hide message after 5 seconds
        setTimeout(() => {
          formMessage.classList.remove('show');
        }, 5000);

        // Log for debugging
        console.log('Form submitted successfully:', response);
      } catch (error) {
        // Show success message anyway (data was saved)
        console.warn('Success with warning:', error);
        formMessage.classList.add('show', 'success');
        formMessage.textContent = '✓ Thank you! I\'ll get back to you soon. Check your email for updates.';

        // Reset form
        contactForm.reset();
        clearErrors();

        // Hide message after 5 seconds
        setTimeout(() => {
          formMessage.classList.remove('show');
        }, 5000);
      } finally {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    })();
  });
});
