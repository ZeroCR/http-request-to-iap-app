# HTTP request to IAP-protected app

Action to call an endpoint protected by IAP. Useful to trigger a process in that service.

## Input

### `url`

https://example.com/start-process

### `target-audience`

IAP_CLIENT_ID.apps.googleusercontent.com

### `service_account_key`

Service Account added to IAP

Base64 encoded GCP service account keys exported as JSON

### `method`

HTTP method

## Output

None

