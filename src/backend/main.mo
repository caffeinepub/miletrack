import Map "mo:core/Map";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Nat64 "mo:core/Nat64";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Trip Types and Functions
  type TripId = Nat64;

  type Trip = {
    id : TripId;
    date : Text;
    purpose : Text;
    destination : Text;
    kilometers : Float;
  };

  module Trip {
    public func compare(trip1 : Trip, trip2 : Trip) : Order.Order {
      Nat64.compare(trip1.id, trip2.id);
    };

    public func compareByDate(trip1 : Trip, trip2 : Trip) : Order.Order {
      Text.compare(trip1.date, trip2.date);
    };

    public func compareByKilometers(trip1 : Trip, trip2 : Trip) : Order.Order {
      if (trip1.kilometers < trip2.kilometers) { #less }
      else if (trip1.kilometers > trip2.kilometers) { #greater } else { #equal };
    };
  };

  var nextTripId : TripId = 1;

  func getNextTripId() : TripId {
    let id = nextTripId;
    nextTripId += 1;
    id;
  };

  let trips = Map.empty<Principal, Map.Map<TripId, Trip>>();

  func getUserTrips(owner : Principal) : Map.Map<TripId, Trip> {
    switch (trips.get(owner)) {
      case (null) {
        Runtime.trap("User has no recorded trips");
      };
      case (?userTrips) { userTrips };
    };
  };

  public query ({ caller }) func getTripsByUser(user : Principal) : async [Trip] {
    // Admins can view any user's trips, regular users can only view their own
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own trips");
    };

    switch (trips.get(user)) {
      case (null) { [] };
      case (?userTrips) {
        userTrips.values().toArray().sort();
      };
    };
  };

  public shared ({ caller }) func addTrip(date : Text, purpose : Text, destination : Text, kilometers : Float) : async TripId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add trips");
    };

    let tripId = getNextTripId();
    let newTrip : Trip = {
      id = tripId;
      date;
      purpose;
      destination;
      kilometers;
    };
    switch (trips.get(caller)) {
      case (null) {
        let userTrips = Map.singleton<TripId, Trip>(tripId, newTrip);
        trips.add(caller, userTrips);
      };
      case (?userTrips) {
        userTrips.add(tripId, newTrip);
      };
    };
    tripId;
  };

  public shared ({ caller }) func updateTrip(trip : Trip) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update trips");
    };

    let userTrips = getUserTrips(caller);
    if (not userTrips.containsKey(trip.id)) {
      Runtime.trap("Trip not found");
    };
    userTrips.add(trip.id, trip);
  };

  public shared ({ caller }) func deleteTrip(id : TripId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete trips");
    };

    let userTrips = getUserTrips(caller);
    if (not userTrips.containsKey(id)) {
      Runtime.trap("Trip not found");
    };
    userTrips.remove(id);
  };

  type TripStats = {
    tripCount : Nat;
    totalKilometers : Float;
  };

  public query ({ caller }) func getTripStats() : async TripStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view trip stats");
    };

    switch (trips.get(caller)) {
      case (null) { { tripCount = 0; totalKilometers = 0.0 } };
      case (?userTrips) {
        var sum = 0.0;
        for (trip in userTrips.values()) {
          sum += trip.kilometers;
        };
        {
          tripCount = userTrips.size();
          totalKilometers = sum;
        };
      };
    };
  };
};
