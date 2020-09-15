import * as core from '@actions/core'
import {GoogleAuth} from 'google-auth-library'

interface ServiceAccountKey {
  type: string
  project_id: string
  project_key_id: string
  private_key: string
  client_email: string
  client_id: string
  auth_uri: string
  token_uri: string
  auth_provider_x509_cert_url: string
  client_x509_cert_url: string
}

/**
 * Parses the service account string into JSON.
 *
 * @param serviceAccountKey The service account key used for authentication.
 * @returns ServiceAccountKey as an object.
 */
export function parseServiceAccountKey(
  serviceAccountKey: string
): ServiceAccountKey {
  let serviceAccount = serviceAccountKey
  // Handle base64-encoded credentials
  if (!serviceAccountKey.trim().startsWith('{')) {
    serviceAccount = Buffer.from(serviceAccountKey, 'base64').toString('utf8')
  }
  return JSON.parse(serviceAccount)
}

async function run(): Promise<void> {
  try {
    const url: string = core.getInput('url')
    const targetAudience: string = core.getInput('target-audience')
    const serviceAccountKey = core.getInput('service_account_key')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const method: any = core.getInput('method')
    core.info(`request IAP ${url} with target audience ${targetAudience}`)
    const serviceAccountJson = parseServiceAccountKey(serviceAccountKey)
    const auth = new GoogleAuth({
      credentials: {
        client_email: serviceAccountJson.client_email,
        private_key: serviceAccountJson.private_key
      }
    })

    const client = await auth.getIdTokenClient(targetAudience)
    const res = await client.request({url, method})
    core.info(JSON.stringify(res.data))

    core.info('Request done')
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
