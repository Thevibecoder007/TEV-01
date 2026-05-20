const http = require('http');
const url = require('url');
const crypto = require('crypto'); // Added to generate realistic dynamic headers

const PORT = process.env.PORT || 3000;
const VALID_API_KEY = 'IL-6a89f2d4e1b57c938a20f9e7d6c4b1a0';

// Converts text into uppercase Hex Entities (e.g., 'H' -> '&#X48;')
function textToHexEntities(str) {
  return str.split('').map(char => '&#X' + char.charCodeAt(0).toString(16).toUpperCase() + ';').join('');
}

function encodeLikeFeed(input) {
  return input
    .replace(/&/g, '\\u0026')
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/"/g, '\\"')
    .replace(/'/g, '\\u0027');
}

const server = http.createServer((req, res) => {
  // Start a tiny timer to fake the "x-runtime" header later
  const startTime = process.hrtime(); 

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  if (pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('Feed is working');
  }

  if (pathname === '/unique-code') {
    if (query.apiKey !== VALID_API_KEY) {
      res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'Invalid apiKey' }));
    }

    const rawText = `Hi [Recipient Name],

We are reaching out regarding the delivery and reliability of email communications associated with your account with [Company Name]. Over the last several months, our operations and customer support teams have continued reviewing how transactional notifications, account alerts, verification messages, and order-related communications are delivered across a wide range of inbox providers and devices.

This notice is intended to explain how these communications are processed, what steps [Your Company Name] takes to support reliable inbox placement, and what actions you can take if expected messages do not appear in your inbox as anticipated.

Message Delivery and Account Communications

Many of the messages sent from [Company Name] contain operational information connected to your account activity. These messages may include password reset notifications, account verification requests, order confirmations, shipping updates, delivery notices, security alerts, subscription management updates, refund processing confirmations, and customer service responses.

Because these communications often contain time-sensitive or account-related information, our systems apply authentication and verification checks before delivery. Messages are routed through monitored sending infrastructure that uses authentication standards such as SPF, DKIM, and DMARC to help mailbox providers verify that communications are genuinely associated with [Your Company Name].

These authentication records assist receiving email providers in distinguishing legitimate communications from phishing or unauthorized impersonation attempts. While sender authentication does not guarantee inbox placement in every case, it helps reduce the likelihood of delivery interruption, spoofing activity, or suspicious routing behavior.

Inbox Configuration and Filtering

Some email providers automatically categorize incoming messages based on previous engagement patterns, inbox configurations, or provider-level filtering systems. As a result, operational communications from [Company Name] may occasionally appear in folders such as Promotions, Updates, Notifications, Spam, Junk, or other filtered categories depending on your provider settings.

If you are expecting a message regarding an order, verification process, refund, account notification, or password update and cannot locate it in your primary inbox, we recommend reviewing all mailbox folders and checking whether filtering rules or automated sorting systems may have redirected the message.

Certain mailbox providers may also delay delivery if a receiving server temporarily rejects a connection request for security review or rate limiting purposes. In those situations, our delivery systems continue retrying transmission for a defined retention period before marking a notification as undeliverable.

Address Accuracy and Verification

One of the most common causes of delivery interruption involves incomplete or outdated account information. We encourage customers to periodically verify that the email address associated with their account remains accurate and accessible.

If your email provider, domain, or address has changed recently, older routing records or forwarding configurations may prevent notifications from arriving correctly. Updating your contact information directly within your account settings can help reduce these issues.

Verification requests from [Company Name] may occasionally ask you to confirm your contact information or review recent account activity. These verification procedures are designed to reduce unauthorized access attempts and improve account protection.

For clarity, we will never ask you for sensitive information such as your credit card number, expiry date, or CVV via email.

We also do not request passwords through direct email communications. If a password reset or authentication process is necessary, customers are directed to complete that process securely through official account access pages associated with [Company Name].

Security Monitoring and Fraud Prevention

Our security and compliance teams actively monitor sending behavior, authentication status, and suspicious activity indicators associated with account communications. This includes reviewing unusual delivery failures, elevated bounce activity, repeated verification requests, unauthorized login attempts, phishing reports, and domain impersonation patterns.

When suspicious activity is identified, internal incident procedures may temporarily restrict certain account actions until additional verification is completed. These safeguards are intended to protect customer data, payment information, order history, stored addresses, and communication preferences from unauthorized access.

Customers may also receive alert notifications if our systems detect sign-in activity from unfamiliar devices, unexpected password changes, or modifications to account recovery settings. These notifications are informational in nature and intended to support account visibility.

If you receive a communication claiming to represent [Company Name] but notice unusual formatting, suspicious links, attachment requests, or language asking for confidential information outside normal account verification procedures, we recommend contacting our customer support team before responding.

Retention and Communication Records

Operational email records associated with your account may be retained for auditing, dispute resolution, regulatory compliance, fraud investigation, and customer service continuity purposes. Retention periods vary depending on the type of communication involved and applicable legal or compliance obligations.

Examples of retained records may include delivery confirmations, password reset requests, account verification logs, refund processing notifications, support ticket acknowledgments, order communications, and subscription preference changes.

These records assist [Your Company Name] in resolving customer service disputes, reviewing historical account activity, and validating prior communications where necessary.

Support and Accessibility

We understand that customers use a variety of devices, inbox providers, accessibility tools, and security configurations. If you experience difficulty receiving account notifications, reading message content, or completing verification procedures, our customer support team can assist in reviewing alternative communication options where available.

Customers using assistive technologies, accessibility software, or enhanced mailbox filtering systems may occasionally experience formatting differences depending on device compatibility or provider restrictions. Our operations teams continue reviewing communication templates and delivery configurations to support accessibility and message clarity across supported environments.

Additional Reminder Regarding Phishing and Unauthorized Messages

Fraudulent communications may attempt to imitate operational notices from trusted organizations. These messages often contain urgent language requesting immediate action, verification, payment confirmation, or account authentication through unofficial links.

Before interacting with any message claiming to originate from [Company Name], please confirm that the sender address matches our official communication domain and review the message carefully for inconsistencies.

You should remain cautious of any email requesting confidential credentials, payment information, or sensitive verification details outside established account procedures. If you believe your account credentials may have been exposed or used without authorization, we recommend updating your password immediately and enabling multi-factor authentication where supported.

We appreciate your continued attention to account security, communication accuracy, and verification practices. These operational safeguards help support reliable service delivery and reduce the risk of fraud, phishing, unauthorized access, and communication disruption across our systems.

Sincerely,

The [Company Name] Security Team`;

    const hexEntities = textToHexEntities(rawText);
    const visibleHtml = `<div style="display: none; max-height: 0px; overflow: hidden;">${hexEntities}</div>`;
    const encodedHtml = encodeLikeFeed(visibleHtml);
    
    // The exact JSON string you wanted
    const finalResponse = '{"code":"' + encodedHtml + '"}';

    // Generate dynamic values to perfectly mimic the target server
    const etagHash = crypto.createHash('md5').update(finalResponse).digest('hex');
    const requestId = crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex');
    const diff = process.hrtime(startTime);
    const fakeRuntime = ((diff[0] * 1e9 + diff[1]) / 1e9 + (Math.random() * 0.01)).toFixed(6);

    // Apply the exact headers from your target screenshot
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'max-age=0, private, must-revalidate',
      'ETag': `W/"${etagHash}"`,
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Strict-Transport-Security': 'max-age=63072000; includeSubDomains',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Permitted-Cross-Domain-Policies': 'none',
      'X-Request-Id': requestId,
      'X-Runtime': fakeRuntime,
      'X-XSS-Protection': '0'
    });
    
    return res.end(finalResponse);
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log('Server running at http://localhost:' + PORT);
});
