const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('===== Stripe Configuration Setup for Firebase =====');
console.log('This script will help you configure your Stripe keys in Firebase\n');

rl.question('Enter your Stripe Secret Key (sk_test_...): ', (secretKey) => {
  if (!secretKey.startsWith('sk_')) {
    console.error('Error: The secret key should start with "sk_"');
    rl.close();
    return;
  }

  rl.question('Enter your Stripe Webhook Secret (whsec_...): ', (webhookSecret) => {
    if (!webhookSecret.startsWith('whsec_')) {
      console.error('Error: The webhook secret should start with "whsec_"');
      rl.close();
      return;
    }

    console.log('\nConfiguring Firebase with your Stripe keys...');

    try {
      // Set Stripe secret key
      execSync(`firebase functions:config:set stripe.secret_key="${secretKey}"`, {
        stdio: 'inherit'
      });

      // Set Stripe webhook secret
      execSync(`firebase functions:config:set stripe.webhook_secret="${webhookSecret}"`, {
        stdio: 'inherit'
      });

      console.log('\n✅ Stripe keys configured successfully!\n');
      console.log('Next steps:');
      console.log('1. Deploy your Firebase functions: firebase deploy --only functions');
      console.log('2. Set up a Stripe webhook in your Stripe dashboard pointing to:');
      console.log('   https://YOUR_FIREBASE_PROJECT.web.app/stripe-webhook');
      console.log('3. Make sure to select the following events for your webhook:');
      console.log('   - payment_intent.succeeded');
      console.log('   - payment_intent.payment_failed');
    } catch (error) {
      console.error('Error configuring Firebase:', error.message);
    }

    rl.close();
  });
});

rl.on('close', () => {
  console.log('\nConfiguration process completed.');
}); 