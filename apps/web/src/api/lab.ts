import type {
  LabData,
  LabVariant,
  LabAttempt,
  LabPin,
  CreateVariantBody,
  UpdateVariantBody,
  CreateAttemptBody,
  CreatePinBody,
  UpdateAttemptBody,
} from 'shared';
import { buildApiUrl } from './client';

const lab = {
  async parseError(response: Response, fallbackMessage: string): Promise<Error> {
    try {
      const error = await response.json();
      return new Error(error.message ?? fallbackMessage);
    } catch {
      return new Error(fallbackMessage);
    }
  },

  async getLabData(recipeId: string, token: string): Promise<LabData> {
    const response = await fetch(buildApiUrl(`/recipes/${recipeId}/lab`), {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw await this.parseError(response, 'Failed to fetch lab data');
    }
    return response.json();
  },

  async createVariant(
    recipeId: string,
    body: CreateVariantBody,
    token: string
  ): Promise<LabVariant> {
    const response = await fetch(buildApiUrl(`/recipes/${recipeId}/lab/variants`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw await this.parseError(response, 'Failed to create variant');
    }
    return response.json();
  },

  async updateVariant(
    recipeId: string,
    variantId: string,
    body: UpdateVariantBody,
    token: string
  ): Promise<LabVariant> {
    const response = await fetch(
      buildApiUrl(`/recipes/${recipeId}/lab/variants/${variantId}`),
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      }
    );
    if (!response.ok) {
      throw await this.parseError(response, 'Failed to update variant');
    }
    return response.json();
  },

  async deleteVariant(recipeId: string, variantId: string, token: string): Promise<void> {
    const response = await fetch(
      buildApiUrl(`/recipes/${recipeId}/lab/variants/${variantId}`),
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!response.ok) {
      throw await this.parseError(response, 'Failed to delete variant');
    }
  },

  async logAttempt(
    recipeId: string,
    body: CreateAttemptBody,
    token: string
  ): Promise<LabAttempt> {
    const response = await fetch(buildApiUrl(`/recipes/${recipeId}/lab/attempts`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw await this.parseError(response, 'Failed to log attempt');
    }
    return response.json();
  },

  async updateAttempt(
    recipeId: string,
    attemptId: string,
    body: UpdateAttemptBody,
    token: string
  ): Promise<LabAttempt> {
    const response = await fetch(
      buildApiUrl(`/recipes/${recipeId}/lab/attempts/${attemptId}`),
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      }
    );
    if (!response.ok) {
      throw await this.parseError(response, 'Failed to update attempt');
    }
    return response.json();
  },

  async deleteAttempt(recipeId: string, attemptId: string, token: string): Promise<void> {
    const response = await fetch(
      buildApiUrl(`/recipes/${recipeId}/lab/attempts/${attemptId}`),
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!response.ok) {
      throw await this.parseError(response, 'Failed to delete attempt');
    }
  },

  async createPin(recipeId: string, body: CreatePinBody, token: string): Promise<LabPin> {
    const response = await fetch(buildApiUrl(`/recipes/${recipeId}/lab/pins`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw await this.parseError(response, 'Failed to create pin');
    }
    return response.json();
  },

  async deletePin(recipeId: string, pinId: string, token: string): Promise<void> {
    const response = await fetch(buildApiUrl(`/recipes/${recipeId}/lab/pins/${pinId}`), {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw await this.parseError(response, 'Failed to delete pin');
    }
  },
};

export default lab;
