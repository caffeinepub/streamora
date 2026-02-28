import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Blob "mo:core/Blob";
import Principal "mo:core/Principal";
import Array "mo:core/Array";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  // Initialize persistent access control and storage states first
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // ── User Profile ────────────────────────────────────────────────────────────

  public type UserProfile = {
    name : Text;
    secretUsername : Text;
    displayName : Text;
    isMonetized : Bool;
    isPremium : Bool;
    subscriberCount : Nat;
    strikes : Nat;
    adPin : ?Text;
    paypalEmail : ?Text;
    monetizationPlan : ?Text; // "standard" or "premium"
    cpmRank : ?Text; // "bronze" | "silver" | "gold" | "premium"
    totalEarnings : Float;
    estimatedEarnings : Float;
    isTrusted : Bool;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  /// CRUD interface for user profiles (REQUIRED)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    let role = AccessControl.getUserRole(accessControlState, caller);
    switch (role) {
      case (#guest) { Runtime.trap("Unauthorized: Only registered users can view their profile") };
      case (_) { userProfiles.get(caller) };
    };
  };

  /// Users can access their own or admin profiles only
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  /// Any registered user can save their own profile (user or admin)
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    let role = AccessControl.getUserRole(accessControlState, caller);
    switch (role) {
      case (#guest) { Runtime.trap("Unauthorized: Only registered users can save their profile") };
      case (_) { userProfiles.add(caller, profile) };
    };
  };

  // Additional business-logic functions (for completeness)
  private func requireUser(caller : Principal) {
    let role = AccessControl.getUserRole(accessControlState, caller);
    switch (role) {
      case (#guest) { Runtime.trap("Unauthorized: Only registered users can do this.") };
      case (#user or #admin) {};
    };
  };

  public query ({ caller }) func getAccessLevel() : async Text {
    let role = AccessControl.getUserRole(accessControlState, caller);
    switch (role) {
      case (#guest) { "Guest" };
      case (#user) { "User" };
      case (#admin) { "Admin" };
    };
  };

  public type VideoContent = {
    id : Nat;
    title : Text;
    description : Text;
    code : Blob;
    price : Nat;
    availability : Bool;
    owner : Principal;
  };

  let videoList = List.empty<VideoContent>();
  let userPurchases = Map.empty<Text, List.List<Nat>>();
  var nextVideoId = 0;

  public shared ({ caller }) func uploadVideo(
    title : Text,
    description : Text,
    code : Blob,
    price : Nat,
  ) : async () {
    requireUser(caller);
    let id = nextVideoId;
    nextVideoId += 1;
    let video : VideoContent = {
      id;
      title;
      description;
      code;
      price;
      availability = true;
      owner = caller;
    };
    videoList.add(video);
  };

  public query func getAllVideos() : async [VideoContent] {
    videoList.toArray().filter(func(video) { video.availability });
  };

  public query func getVideosByPriceRange(minPrice : Nat, maxPrice : Nat) : async [VideoContent] {
    videoList.toArray().filter(
      func(video) {
        video.price >= minPrice and video.price <= maxPrice and video.availability
      }
    );
  };

  public shared ({ caller }) func changeAvailability(id : Nat, available : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update availability");
    };
    let updatedVideos = videoList.toArray().map(
      func(video) {
        if (video.id == id) {
          { video with availability = available };
        } else { video };
      }
    );
    videoList.clear();
    videoList.addAll(updatedVideos.values());
  };

  public shared ({ caller }) func purchaseVideos(videoIds : [Nat]) : async () {
    requireUser(caller);
    let purchasedList = List.fromArray<Nat>(videoIds);
    switch (userPurchases.get(caller.toText())) {
      case (null) {
        userPurchases.add(caller.toText(), purchasedList);
      };
      case (?allVideos) {
        allVideos.addAll(videoIds.values());
        userPurchases.add(caller.toText(), allVideos);
      };
    };
  };

  public query ({ caller }) func getUserPurchasedVideos(user : Principal) : async [VideoContent] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own purchased videos");
    };
    switch (userPurchases.get(user.toText())) {
      case (null) { [] };
      case (?purchased) {
        purchased.toArray().map(
          func(id) {
            switch (videoList.toArray().find(func(video) { video.id == id })) {
              case (null) { Runtime.trap("Video not found") };
              case (?video) { video };
            };
          }
        );
      };
    };
  };
};
