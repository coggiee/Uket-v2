import { AdminLoginRequestParams } from "@uket/api/types/admin-auth";

import { useMutation } from "@tanstack/react-query";
import { adminLogin } from "../admin-auth";

export const useMutationAdminLogin = () => {
  const mutation = useMutation({
    mutationFn: ({ email, password }: AdminLoginRequestParams) =>
      adminLogin({ email, password }),
    throwOnError: false,
  });

  return mutation;
};
