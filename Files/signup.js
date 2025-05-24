document.querySelector('.signup-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const inputs = e.target.querySelectorAll('input');
  const email = inputs[0].value;
  const password = inputs[1].value;
  const repeatPassword = inputs[2].value;
  const gender = e.target.querySelector('select').value;
  const age = inputs[3].value || undefined;

  if (password !== repeatPassword) {
    alert('Passwords do not match!');
    return;
  }

  if (!gender) {
    alert('Please select a gender!');
    return;
  }

  const res = await fetch('/api/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, gender, age })
  });
  const data = await res.json();
  if (res.ok) {
    localStorage.setItem('token', data.token);
    alert('Registration successful!');
    window.location.href = "dashboard.html";
  } else {
    alert(data.error || 'Registration failed');
  }
});