import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Trip {
    id: TripId;
    destination: string;
    kilometers: number;
    date: string;
    purpose: string;
}
export interface TripStats {
    tripCount: bigint;
    totalKilometers: number;
}
export interface UserProfile {
    name: string;
}
export type TripId = bigint;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addTrip(date: string, purpose: string, destination: string, kilometers: number): Promise<TripId>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteTrip(id: TripId): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getTripStats(): Promise<TripStats>;
    getTripsByUser(user: Principal): Promise<Array<Trip>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateTrip(trip: Trip): Promise<void>;
}
