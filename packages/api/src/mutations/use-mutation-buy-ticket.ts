import { useMutation } from "@tanstack/react-query";

import { TicketResponse } from "../types/show";
import { fetcher } from "../instance";

type FormSchemaType = {
  universityId: number;
  reservationId: number;
};

export const useMutationBuyTicket = () => {
  const mutation = useMutation({
    mutationFn: async (formData: FormSchemaType) => {
      const { data } = await fetcher.post<TicketResponse>("/tickets", formData);
      return data;
    },
  });

  return mutation;
};
