import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface VideoContent {
    id: bigint;
    title: string;
    owner: Principal;
    code: Uint8Array;
    description: string;
    availability: boolean;
    price: bigint;
}
export interface UserProfile {
    isTrusted: boolean;
    adPin?: string;
    estimatedEarnings: number;
    displayName: string;
    secretUsername: string;
    isPremium: boolean;
    name: string;
    monetizationPlan?: string;
    totalEarnings: number;
    isMonetized: boolean;
    cpmRank?: string;
    subscriberCount: bigint;
    paypalEmail?: string;
    strikes: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    changeAvailability(id: bigint, available: boolean): Promise<void>;
    getAccessLevel(): Promise<string>;
    getAllVideos(): Promise<Array<VideoContent>>;
    /**
     * / CRUD interface for user profiles (REQUIRED)
     */
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    /**
     * / Users can access their own or admin profiles only
     */
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserPurchasedVideos(user: Principal): Promise<Array<VideoContent>>;
    getVideosByPriceRange(minPrice: bigint, maxPrice: bigint): Promise<Array<VideoContent>>;
    isCallerAdmin(): Promise<boolean>;
    purchaseVideos(videoIds: Array<bigint>): Promise<void>;
    /**
     * / Any registered user can save their own profile (user or admin)
     */
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    uploadVideo(title: string, description: string, code: Uint8Array, price: bigint): Promise<void>;
}
