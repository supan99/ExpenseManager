import client from '../services/axios';
import { LeadsResponse, LoginRequest, LoginResponse } from '../types';
import { apiEndPoint, throwApiError } from './endpoint';

export const authApi = {
  async signIn(data: LoginRequest): Promise<LoginResponse | undefined> {
    try {
      const response = await client.post<LoginResponse>(
        apiEndPoint.login,
        data,
      );
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },
};

export const leadApi = {
  async getLeads(
    page: number,
    per_page: number,
    sortBy: string,
    sortDirection: string,
    search: string | undefined,
  ): Promise<LeadsResponse | undefined> {
    try {
      const response = await client.get<LeadsResponse>(apiEndPoint.leads, {
        params: {
          page,
          per_page,
          sortBy,
          sortDirection,
          ...(search && { search }),
        },
      });
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },
};
