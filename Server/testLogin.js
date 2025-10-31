const testLogin = async () => {
  console.log('🔐 Testing Login...\n');

  // Use the credentials from your test registration
  const loginData = {
    email: "test1761852334063@example.com",
    password: "password123"
  };

  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    console.log('📊 Login Response Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Login SUCCESSFUL!');
      console.log('User:', data.name);
      console.log('Email:', data.email);
      console.log('Token received:', data.token ? 'Yes' : 'No');
    } else {
      const errorData = await response.json();
      console.log('❌ Login FAILED:', errorData.message);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
};

testLogin();