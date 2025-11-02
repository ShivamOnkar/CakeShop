const testFrontendAuth = async () => {
  console.log('🔍 Testing Frontend Auth Endpoints...\n');

  // Test 1: Registration
  console.log('1. Testing Registration...');
  try {
    const registerData = {
      name: "Frontend Test User",
      email: `frontendtest${Date.now()}@example.com`,
      password: "password123",
      phone: "9876543210"
    };

    const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData),
    });

    console.log('   Registration Status:', registerResponse.status);
    
    if (registerResponse.ok) {
      const data = await registerResponse.json();
      console.log('   ✅ Registration SUCCESS!');
      console.log('   User:', data.name);
      console.log('   Token:', data.token ? 'Received' : 'Missing');
      
      // Test 2: Login with same credentials
      console.log('\n2. Testing Login...');
      const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: registerData.email,
          password: registerData.password
        }),
      });

      console.log('   Login Status:', loginResponse.status);
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('   ✅ Login SUCCESS!');
        
        // Test 3: Profile with token
        console.log('\n3. Testing Profile with Token...');
        const profileResponse = await fetch('http://localhost:5000/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${loginData.token}`,
          },
        });

        console.log('   Profile Status:', profileResponse.status);
        
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          console.log('   ✅ Profile SUCCESS!');
          console.log('   User Profile:', profileData.name);
        } else {
          console.log('   ❌ Profile failed');
        }
      } else {
        console.log('   ❌ Login failed');
      }
    } else {
      const error = await registerResponse.json();
      console.log('   ❌ Registration failed:', error.message);
    }
  } catch (error) {
    console.log('   ❌ Network error:', error.message);
  }
};

testFrontendAuth();