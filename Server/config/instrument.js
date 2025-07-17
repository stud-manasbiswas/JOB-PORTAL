// Import with `import * as Sentry from "@sentry/node"` if you are using ESM

import * as Sentry from "@sentry/node"
Sentry.init({
  dsn: "https://f37698abfbb78757258df4974c25652f@o4509679302410240.ingest.us.sentry.io/4509679307718656",
  

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});