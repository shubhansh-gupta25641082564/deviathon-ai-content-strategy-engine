const OpenAI = require('openai');
require('dotenv').config();

const testOpenAIIntegration = async () => {
  console.log('🧪 Testing OpenAI API Integration...\n');

  // Check if API key is provided
  if (!process.env.OPENAI_API_KEY) {
    console.log('❌ OpenAI API key not found in environment variables');
    console.log('💡 Please add your OpenAI API key to the .env file:');
    console.log('   OPENAI_API_KEY=your_api_key_here');
    console.log('\n📖 See OPENAI_SETUP.md for detailed instructions');
    return;
  }

  if (process.env.OPENAI_API_KEY === 'your_openai_api_key_here' || process.env.OPENAI_API_KEY.length < 20) {
    console.log('❌ OpenAI API key appears to be placeholder or invalid');
    console.log('💡 Please replace with your actual OpenAI API key');
    console.log('\n📖 See OPENAI_SETUP.md for detailed instructions');
    return;
  }

  try {
    console.log('🔧 Initializing OpenAI client...');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    console.log('📡 Testing API connection...');
    
    // Test with a simple request
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "Say 'OpenAI integration test successful!' if you receive this message."
        }
      ],
      max_tokens: 20,
      temperature: 0.1,
    });

    if (response.choices && response.choices[0] && response.choices[0].message) {
      console.log('✅ OpenAI API integration successful!');
      console.log('🤖 Response:', response.choices[0].message.content.trim());
      console.log('\n📊 Usage Info:');
      console.log(`   Model: ${response.model}`);
      console.log(`   Tokens used: ${response.usage?.total_tokens || 'N/A'}`);
      console.log('\n🎉 Your AI Content Strategy Engine is ready to use advanced AI features!');
    } else {
      console.log('⚠️  Received unexpected response format');
      console.log('Response:', JSON.stringify(response, null, 2));
    }

  } catch (error) {
    console.log('❌ OpenAI API test failed');
    console.log('Error:', error.message);
    
    if (error.code === 'invalid_api_key') {
      console.log('\n💡 Your API key appears to be invalid');
      console.log('   - Check that you copied the entire key correctly');
      console.log('   - Ensure the key starts with "sk-"');
      console.log('   - Verify the key hasn\'t been revoked');
    } else if (error.code === 'insufficient_quota') {
      console.log('\n💡 Insufficient quota (billing issue)');
      console.log('   - Check your OpenAI billing dashboard');
      console.log('   - Ensure you have available credits');
      console.log('   - Add a payment method if needed');
    } else if (error.code === 'rate_limit_exceeded') {
      console.log('\n💡 Rate limit exceeded');
      console.log('   - Wait a moment and try again');
      console.log('   - Check your usage limits');
    }
    
    console.log('\n📖 See OPENAI_SETUP.md for detailed troubleshooting');
  }
};

// Run the test
testOpenAIIntegration();