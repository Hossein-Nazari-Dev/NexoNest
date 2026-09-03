(function () {
  const form = document.querySelector('#newsletter-form');
  if (!form) return;

  const status = document.querySelector('#form-status');
  const submitButton = form.querySelector('button[type="submit"]');
  const endpoint = document.querySelector('meta[name="newsletter-endpoint"]')?.content.trim();
  const destination = 'hossein.nazari.ac@gmail.com';

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

    form.querySelectorAll('input[required]:not([type="radio"]):not([type="checkbox"])').forEach((input) => {
      if (input.validity.valid) return;
      input.setAttribute('aria-invalid', 'true');
      const error = input.closest('.field')?.querySelector('.field-error');
      if (error) error.textContent = input.validity.typeMismatch ? 'Enter a valid email address.' : 'This field is required.';
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
    return {
      fullName: data.get('fullName'),
      email: data.get('email'),
      occupation: data.get('occupation'),
      organization: data.get('organization') || '—',
      educationLevel: data.get('educationLevel'),
      fieldOfStudy: data.get('fieldOfStudy') || '—',
      interests: data.getAll('interests'),
      currentExploration: data.get('currentExploration') || '—',
      consent: Boolean(data.get('consent')),
      source: 'nexonest.com/newsletter.html',
      submittedAt: new Date().toISOString()
    };
  }

  function openEmail(data) {
    const subject = encodeURIComponent('NexoNest Field Notes subscription');
    const body = encodeURIComponent([
      'NexoNest Field Notes — subscription request', '',
      'Name: ' + data.fullName,
      'Email: ' + data.email,
      'Education: ' + data.educationLevel,
      'Field of study: ' + data.fieldOfStudy,
      'Role: ' + data.occupation,
      'Institution / organisation: ' + data.organization,
      'Interests: ' + data.interests.join(', '),
      'Currently exploring: ' + data.currentExploration, '',
      'Consent to occasional NexoNest emails: Yes'
    ].join('\n'));

    setStatus('Your email app is opening. Send the prepared message to complete the subscription.', 'success');
    window.location.href = 'mailto:' + destination + '?subject=' + subject + '&body=' + body;
  }

  async function sendToEndpoint(data) {
    submitButton.disabled = true;
    submitButton.querySelector('span').textContent = 'Submitting…';
    setStatus('Submitting your introduction…', 'pending');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Subscription request failed.');
      form.reset();
      setStatus('You are on the list. The next useful note will find you.', 'success');
      submitButton.querySelector('span').textContent = 'Subscribed';
    } catch (error) {
      setStatus('The direct form is temporarily unavailable. A prepared email will open instead.', 'error');
      openEmail(data);
      submitButton.disabled = false;
      submitButton.querySelector('span').textContent = 'Prepare subscription';
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
    const data = getValues();
    if (endpoint) sendToEndpoint(data);
    else openEmail(data);
  });
})();
