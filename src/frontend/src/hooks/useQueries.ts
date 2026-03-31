import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Trip, UserProfile } from "../backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

export function useGetTrips() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<Trip[]>({
    queryKey: ["trips", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getTripsByUser(identity.getPrincipal());
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

export function useGetTripStats() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery({
    queryKey: ["tripStats", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return { tripCount: BigInt(0), totalKilometers: 0 };
      return actor.getTripStats();
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

export function useAddTrip() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      date: string;
      purpose: string;
      destination: string;
      kilometers: number;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addTrip(
        data.date,
        data.purpose,
        data.destination,
        data.kilometers,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["trips", identity?.getPrincipal().toString()],
      });
      queryClient.invalidateQueries({
        queryKey: ["tripStats", identity?.getPrincipal().toString()],
      });
    },
  });
}

export function useUpdateTrip() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (trip: Trip) => {
      if (!actor) throw new Error("Actor not available");
      await actor.updateTrip(trip);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["trips", identity?.getPrincipal().toString()],
      });
      queryClient.invalidateQueries({
        queryKey: ["tripStats", identity?.getPrincipal().toString()],
      });
    },
  });
}

export function useDeleteTrip() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      await actor.deleteTrip(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["trips", identity?.getPrincipal().toString()],
      });
      queryClient.invalidateQueries({
        queryKey: ["tripStats", identity?.getPrincipal().toString()],
      });
    },
  });
}
