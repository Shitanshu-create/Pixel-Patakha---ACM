import {
  sightengineApiUrl,
  sightengineApiUser,
  sightengineApiSecret,
  sightengineTimeoutMs,
} from '../config/env.js';

export const check = async (fileBuffer, mimeType, originalName) => {
  if (!sightengineApiUser || !sightengineApiSecret) {
    return {
      type: 'credentials',
      error: 'Missing Sightengine API User or Secret',
    };
  }

  const formData = new FormData();
  formData.append('api_user', sightengineApiUser);
  formData.append('api_secret', sightengineApiSecret);
  formData.append('models', 'genai');

  const blob = new Blob([fileBuffer], { type: mimeType || 'application/octet-stream' });
  formData.append('media', blob, originalName || 'design.png');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), sightengineTimeoutMs);

  try {
    const response = await fetch(sightengineApiUrl, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const json = await response.json().catch(() => null);

    if (!json) {
      return {
        type: 'retryable',
        error: `Invalid JSON response from Sightengine (HTTP ${response.status})`,
      };
    }

    if (json.status === 'success') {
      return {
        type: 'ok',
        score: json.type?.ai_generated ?? 0,
        generators: json.type?.ai_generators || {},
        operations: json.request?.operations ?? 5,
        requestId: json.request?.id || null,
      };
    }

    // Handle Failure
    const errType = json.error?.type || 'unknown_error';
    const errMessage = json.error?.message || 'Sightengine scan failure';

    if (errType === 'usage_limit') {
      return { type: 'usageLimit', error: errMessage };
    }

    if (errType === 'credentials_error' || errType === 'plan_error') {
      return { type: 'credentials', error: `${errType}: ${errMessage}` };
    }

    if (
      errType === 'media_error' ||
      errType === 'argument_error' ||
      errType === 'request_error'
    ) {
      return { type: 'fatal', error: `${errType}: ${errMessage}` };
    }

    // Default to retryable for api_error, unknown_error, 5xx
    return { type: 'retryable', error: `${errType}: ${errMessage}` };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      return { type: 'retryable', error: 'Sightengine request timed out' };
    }
    return { type: 'retryable', error: err.message || 'Network error' };
  }
};

export default {
  check,
};
