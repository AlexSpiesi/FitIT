document.querySelector('.login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = e.target.querySelector('input[type="email"]').value;
      const password = e.target.querySelector('input[type="password"]').value;
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        console.log('Login successful!');
        // Redirect or update UI as needed
        window.location.href = "../dashboard/dashboard.html";
      } else {
        console.log(data.error || 'Login failed');
      }
    });