export const apiEndPoint = {
  login: "/api/login",
  leads: "/api/leads",
};

export function throwApiError(error: any) {
  if (error?.response?.data?.message) {
    throw new Error(error.response.data.message);
  }
  throw new Error(error.message);
}
