document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const res = await fetch('/api/users/profile', {
        headers: { 'Authorization': 'Bearer ' + token }
    });
    if (!res.ok) return;
    const data = await res.json();
    document.querySelector('input[name="age"]').value = data.user.age || '';
    document.querySelector('select[name="gender"]').value = data.user.gender || '';
    if (data.user.weight) document.querySelector('input[name="weight"]').value = data.user.weight;
    if (data.user.height) document.querySelector('input[name="height"]').value = data.user.height;
});

// Handle form submission
document.querySelector('.profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;
    const weight = document.querySelector('input[name="weight"]').value;
    const height = document.querySelector('input[name="height"]').value;

    const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ weight, height })
    });
    const data = await res.json();
    if (res.ok) {
        alert('Profile updated!');
    } else {
        alert(data.error || 'Failed to update profile');
    }
});