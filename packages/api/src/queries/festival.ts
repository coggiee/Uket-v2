import { createQueryKeys } from "@lukemorales/query-key-factory";
import { dehydrate, useSuspenseQuery } from "@tanstack/react-query";

import { getQueryClient } from "../get-query-client";
import { fetcher } from "../instance";
import {
  FestivalInfoResponse,
  FestivalUniversity,
  FestivalUniversityResponse,
  UniversityResponse,
} from "../types/univ";

export const festival = createQueryKeys("festival", {
  list: () => ({
    queryKey: ["festival-list"],
    queryFn: async () => {
      const { data } =
        await fetcher.get<FestivalUniversityResponse>(`/universities`);
      return data.items;
    },
  }),
  detail: (id: FestivalUniversity["id"]) => ({
    queryKey: ["festival-detail"],
    queryFn: async () => {
      const { data } = await fetcher.get<FestivalInfoResponse>(
        `/universities/${id}/event`,
      );
      return data;
    },
  }),
  certification: () => ({
    queryKey: ["certification"],
    queryFn: async () => {
      const { data } = await fetcher.get<UniversityResponse>(
        `/universities/certification`,
      );
      return data.items;
    },
  }),
});

/**
 * 현재 진행중인 모든 축제의 목록을 조회합니다.
 * @returns {FestivalUniversity[]} 축제 목록 배열
 */
export const useQueryFestivalList = () => {
  return useSuspenseQuery(festival.list());
};

/**
 * 전달된 id값을 가지는 축제의 상세 정보를 조회합니다.
 * @param {FestivalUniversity["id"]} id
 * @returns {FestivalInfo}
 */
export const useQueryFestivalDetail = (id: FestivalUniversity["id"]) => {
  return useSuspenseQuery(festival.detail(id));
};

/**
 * 인증 가능한 모든 대학을 조회합니다.
 * soritor 도메인에서는 사용하지 않습니다.
 * @returns {UniversityInfo[]}
 */
export const useQueryFestivalCertification = () => {
  return useSuspenseQuery(festival.certification());
};

export const prefetchFestivalList = () => {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    ...festival.list(),
  });

  return dehydrate(queryClient);
};

export const prefetchFestivalDetail = async (id: FestivalUniversity["id"]) => {
  const queryClient = getQueryClient();

  try {
    await queryClient.fetchQuery({
      ...festival.detail(id),
    });

    return { state: dehydrate(queryClient), error: null };
  } catch (error) {
    return { state: dehydrate(queryClient), error };
  }
};

export const prefetchFestivalCertification = () => {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    ...festival.certification(),
  });

  return dehydrate(queryClient);
};
