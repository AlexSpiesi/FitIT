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
    if (data.user.bmi) {
        const bmiValue = Number(data.user.bmi).toFixed(2);
        const category = data.user.bmi_category ? ` (${data.user.bmi_category})` : '';
        document.getElementById('bmi-value').textContent = `BMI: ${bmiValue}${category}`;
    }
});

// Handle form submission
document.querySelector('.profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;
    const weight = document.querySelector('input[name="weight"]').value;
    const height = document.querySelector('input[name="height"]').value;
    const bmiText = document.getElementById('bmi-value').textContent.replace('BMI: ', '');
    const [bmi, category] = bmiText.split(' (');
    const bmiValue = bmi ? bmi.trim() : null;
    const bmiCategory = category ? category.replace(')', '').trim() : null;

    const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ weight, height, bmi: bmiValue, bmi_category: bmiCategory })
    });
    const data = await res.json();
    if (res.ok) {
        console.log('Profile updated!');
    } else {
        console.log(data.error || 'Failed to update profile');
    }
});

// Calculate BMI button
document.getElementById('calc-bmi-btn').addEventListener('click', async () => {
    const token = localStorage.getItem('token');
    const height = document.querySelector('input[name="height"]').value;
    const weight = document.querySelector('input[name="weight"]').value;
    if (!height || !weight) {
        console.log('Please fill in height and weight.');
        return;
    }
    const res = await fetch(`/api/health/BMI/metric?kg=${weight}&cm=${height}`, {
        headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await res.json();
    if (res.ok && data.bmi) {
        const bmiValue = Number(data.bmi).toFixed(2);
        const category = data.bmiCategoryForAdults?.category || '';
        document.getElementById('bmi-value').textContent = `BMI: ${bmiValue}${category ? ' (' + category + ')' : ''}`;
        await fetch('/api/users/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ weight, height, bmi: data.bmi, bmi_category: category })
        });
    } else {
        console.log(data);
        console.log(data.error || JSON.stringify(data) || 'Failed to calculate BMI');
    }
});