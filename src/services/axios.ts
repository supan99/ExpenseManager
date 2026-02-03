import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import qs from 'qs';
import { deleteKeyChain, getKeyChain, setKeyChain } from './keyChain';
import { navigateToAuth, navigateToRestricted } from './navigationHandler';
import { showToast } from '../utils/toast';
import { KeyChainKeys } from '../enums/keyChainKeys';

const API_URL = process.env.API_URL ?? '';

const client = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  paramsSerializer: (params: any) =>
    qs.stringify(params, { arrayFormat: 'repeat' }),
});

client.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getKeyChain('token');
    const profileId = await getKeyChain(KeyChainKeys.PROFILE_ID);
    console.log('token :>> ', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (profileId && profileId !== '') {
      config.headers['x-profile-id'] = profileId;
    }

    console.log('config :>> ', JSON.stringify(config, null, 2));
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

client.interceptors.response.use(
  (response: AxiosResponse) => response,
  async error => {
    const status = error.response ? error.response.status : null;
    const config = error.response ? error.response.config : null;
    const data = error.response ? error.response.data : null;

    if (
      status === 401 &&
      config.url !== '/signIn' &&
      config.url !== '/refreshToken'
    ) {
      try {
        const refreshToken = await getKeyChain('refreshToken');
        if (!refreshToken) {
          await deleteKeyChain('token');
          await deleteKeyChain('refreshToken');
          return Promise.reject(error);
        } else {
          const res = await axios.post(`${process.env.API_URL}/api/refreshToken`, {
            refreshToken,
          });
          const { data } = res;

          if (!data.token) {
            await deleteKeyChain('token');
            await deleteKeyChain('refreshToken');
            navigateToAuth();
            return Promise.reject(error);
          }

          await setKeyChain('token', data.token);
          await setKeyChain('refreshToken', data.refreshToken);
          error.config.headers.Authorization = `Bearer ${data.token}`;
          return axios(error.config);
        }
      } catch (refreshError) {
        await deleteKeyChain('token');
        await deleteKeyChain('refreshToken');
        navigateToAuth();
        return Promise.reject(refreshError);
      }
    } else if (status === 403 && data.isBanned) {
      await deleteKeyChain('token');
      await deleteKeyChain('refreshToken');
      navigateToRestricted();
    } else {
      const errorMessage = data?.message
        ? data?.message
        : typeof data?.error === 'string'
          ? data?.error
          : data?.error?.message
            ? data?.error?.message
            : data?.errors
              ? data.errors[0].message
              : 'Something went wrong';

      if (status !== 502) {
        showToast({
          type: 'error',
          message: errorMessage,
        });
      }

    }
    return Promise.reject(error);
  },
);

export default client;

