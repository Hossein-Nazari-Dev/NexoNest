(function () {
  const form = document.querySelector('#newsletter-form');
  if (!form) return;

  const status = document.querySelector('#form-status');
  const submitButton = form.querySelector('button[type="submit"]');
  const endpoint = document.querySelector('meta[name="newsletter-endpoint"]')?.content.trim();
  const conditionalSelects = [
    { select: form.elements.occupation, input: form.elements.occupationOther },
    { select: form.elements.fieldOfStudy, input: form.elements.fieldOfStudyOther }
  ];

  function setStatus(message, state) {
    status.textContent = message;
    status.dataset.state = state || '';
  }

  function clearErrors() {
    form.querySelectorAll('[aria-invalid="true"]').forEach((field) => field.removeAttribute('aria-invalid'));
    form.querySelectorAll('.field-error, .group-error').forEach((error) => { error.textContent = ''; });
  }

  function validate() {
    clearErrors();
    let valid = true;

    form.querySelectorAll('input[required]:not([type="radio"]):not([type="checkbox"]), select[required]').forEach((control) => {
      if (control.validity.valid) return;
      control.setAttribute('aria-invalid', 'true');
      const error = control.closest('.field')?.querySelector('.field-error');
      if (error) error.textContent = control.validity.typeMismatch ? 'Enter a valid email address.' : 'Choose or complete this field.';
      valid = false;
    });

    if (!form.querySelector('input[name="educationLevel"]:checked')) {
      form.querySelector('[data-error-for="educationLevel"]').textContent = 'Choose one education level.';
      valid = false;
    }
    if (!form.querySelectorAll('input[name="interests"]:checked').length) {
      form.querySelector('[data-error-for="interests"]').textContent = 'Choose at least one area.';
      valid = false;
    }

    const consent = form.querySelector('input[name="consent"]');
    if (!consent.checked) {
      consent.setAttribute('aria-invalid', 'true');
      form.querySelector('[data-error-for="consent"]').textContent = 'Consent is required to join the newsletter.';
      valid = false;
    }

    if (!valid) {
      form.querySelector('[aria-invalid="true"]')?.focus();
      setStatus('Some required information is missing.', 'error');
    }
    return valid;
  }

  function getValues() {
    const data = new FormData(form);
    const occupation = data.get('occupation') === 'Other' ? data.get('occupationOther') : data.get('occupation');
    const fieldOfStudy = data.get('fieldOfStudy') === 'Other' ? data.get('fieldOfStudyOther') : data.get('fieldOfStudy');
    return {
      fullName: data.get('fullName'),
      email: data.get('email'),
      occupation,
      organization: data.get('organization') || '—',
      educationLevel: data.get('educationLevel'),
      fieldOfStudy,
      interests: data.getAll('interests'),
      currentExploration: data.get('currentExploration') || '—',
      consent: Boolean(data.get('consent')),
      website: data.get('website') || '',
      source: 'nexonest.com/newsletter.html',
      submittedAt: new Date().toISOString()
    };
  }

  async function sendToEndpoint(data) {
    submitButton.disabled = true;
    submitButton.querySelector('span').textContent = 'Submitting…';
    setStatus('Submitting your introduction…', 'pending');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: new URLSearchParams({ payload: JSON.stringify(data) })
      });
      form.reset();
      conditionalSelects.forEach(({ select, input }) => updateConditionalField(select, input));
      setStatus('Check your inbox and confirm your email to complete the subscription.', 'success');
      submitButton.querySelector('span').textContent = 'Confirmation sent';
    } catch (error) {
      setStatus('The subscriber list could not be reached. Nothing was submitted; please try again later.', 'error');
      submitButton.disabled = false;
      submitButton.querySelector('span').textContent = 'Join field notes';
    }
  }

  form.addEventListener('input', (event) => {
    event.target.removeAttribute?.('aria-invalid');
    const localError = event.target.closest?.('.field')?.querySelector('.field-error');
    if (localError) localError.textContent = '';
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (form.elements.website.value || !validate()) return;
    if (!endpoint) {
      setStatus('The subscriber list is not connected yet. Nothing was submitted.', 'error');
      return;
    }
    const data = getValues();
    sendToEndpoint(data);
  });

  function updateConditionalField(select, input) {
    const wrapper = input.closest('[data-other-for]');
    const visible = select.value === 'Other';
    wrapper.hidden = !visible;
    input.required = visible;
    if (!visible) {
      input.value = '';
      input.removeAttribute('aria-invalid');
      const error = wrapper.querySelector('.field-error');
      if (error) error.textContent = '';
    }
  }

  conditionalSelects.forEach(({ select, input }) => {
    select.addEventListener('change', () => updateConditionalField(select, input));
    updateConditionalField(select, input);
  });
})();
