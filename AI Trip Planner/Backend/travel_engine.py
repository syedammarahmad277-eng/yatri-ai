# ==========================================
# INDIA TRAVEL AI - TRAVEL ENGINE
# ==========================================


def get_budget_category(budget_per_person):

    if budget_per_person <= 10000:
        return "budget"

    elif budget_per_person <= 30000:
        return "medium"

    else:
        return "luxury"


def get_transport_options(destination, travelers):

    # These are starter estimates.
    # We will later connect this with destination-specific data.

    transport = {

        "road": {
            "name": "Road",
            "cost_per_person": 2000,
            "duration": "8–14 hours",
            "comfort": "Good",
            "best_for": "Scenic journeys and flexible travel"
        },

        "train": {
            "name": "Train",
            "cost_per_person": 1500,
            "duration": "6–12 hours",
            "comfort": "Very Good",
            "best_for": "Budget-friendly long-distance travel"
        },

        "flight": {
            "name": "Flight",
            "cost_per_person": 5000,
            "duration": "2–5 hours",
            "comfort": "Excellent",
            "best_for": "Fast and convenient travel"
        }
    }

    for mode in transport:

        transport[mode]["estimated_cost"] = (
            transport[mode]["cost_per_person"] * travelers
        )

    return transport


def get_best_season(destination):

    destination = destination.lower()

    hill_destinations = [
        "manali",
        "shimla",
        "spiti",
        "kasol",
        "jibhi",
        "auli",
        "mussoorie",
        "chopta",
        "darjeeling",
        "gangtok"
    ]

    beach_destinations = [
        "goa",
        "kerala",
        "pondicherry",
        "andaman",
        "lakshadweep",
        "gokarna",
        "alleppey"
    ]

    desert_destinations = [
        "jaisalmer",
        "jodhpur",
        "bikaner",
        "pushkar"
    ]

    spiritual_destinations = [
        "varanasi",
        "rishikesh",
        "haridwar",
        "ayodhya",
        "mathura",
        "vrindavan"
    ]

    if destination in hill_destinations:

        return {
            "season": "March to June & September to November",
            "type": "Hill",
            "reason": "Pleasant weather and better conditions for sightseeing."
        }

    elif destination in beach_destinations:

        return {
            "season": "October to March",
            "type": "Beach",
            "reason": "Generally pleasant weather for beaches and outdoor activities."
        }

    elif destination in desert_destinations:

        return {
            "season": "October to March",
            "type": "Desert",
            "reason": "Cooler temperatures make desert exploration more comfortable."
        }

    elif destination in spiritual_destinations:

        return {
            "season": "October to March",
            "type": "Spiritual",
            "reason": "Generally comfortable weather for sightseeing and outdoor exploration."
        }

    else:

        return {
            "season": "October to March",
            "type": "Mixed / City",
            "reason": "Generally comfortable period for exploring many Indian destinations."
        }


def calculate_expenses(
    days,
    travelers,
    budget_category,
    transport_cost
):

    hotel_prices = {
        "budget": 1000,
        "medium": 2500,
        "luxury": 6000
    }

    food_prices = {
        "budget": 500,
        "medium": 1200,
        "luxury": 3000
    }

    local_transport_prices = {
        "budget": 300,
        "medium": 700,
        "luxury": 1500
    }

    activity_prices = {
        "budget": 300,
        "medium": 800,
        "luxury": 2000
    }

    hotel = (
        hotel_prices[budget_category]
        * days
        * travelers
    )

    food = (
        food_prices[budget_category]
        * days
        * travelers
    )

    local_transport = (
        local_transport_prices[budget_category]
        * days
        * travelers
    )

    activities = (
        activity_prices[budget_category]
        * days
        * travelers
    )

    total = (
        transport_cost
        + hotel
        + food
        + local_transport
        + activities
    )

    return {
        "transport": transport_cost,
        "hotel": hotel,
        "food": food,
        "local_transport": local_transport,
        "activities": activities,
        "total": total
    }


def recommend_transport(
    transport_options,
    budget,
    travelers,
    preference
):

    preference = preference.lower()

    # Calculate total approximate cost
    # for every transportation option.

    recommendations = {}

    for mode, data in transport_options.items():

        recommendations[mode] = data["estimated_cost"]

    # Budget traveller
    if preference in [
        "budget",
        "cheap",
        "backpacker"
    ]:

        return min(
            recommendations,
            key=recommendations.get
        )

    # Fast travel
    if preference in [
        "fast",
        "comfort",
        "luxury"
    ]:

        return "flight"

    # Balanced travel
    return min(
        recommendations,
        key=recommendations.get
    )


def generate_itinerary(
    destination,
    days,
    destination_type
):

    itinerary = []

    for day in range(1, days + 1):

        if day == 1:

            activities = [
                "Arrive at destination",
                "Check-in to accommodation",
                "Explore the nearby area",
                "Try local food"
            ]

        elif day == days:

            activities = [
                "Visit a final local attraction",
                "Buy local souvenirs",
                "Enjoy a relaxed local meal",
                "Prepare for departure"
            ]

        else:

            if destination_type == "Hill":

                activities = [
                    "Explore scenic viewpoints",
                    "Visit a nearby natural attraction",
                    "Try local cuisine",
                    "Relax and enjoy the surroundings"
                ]

            elif destination_type == "Beach":

                activities = [
                    "Explore a local beach",
                    "Enjoy coastal activities",
                    "Explore local markets",
                    "Try regional cuisine"
                ]

            elif destination_type == "Spiritual":

                activities = [
                    "Visit an important cultural site",
                    "Experience local traditions",
                    "Explore the local market",
                    "Enjoy regional food"
                ]

            else:

                activities = [
                    "Visit major local attractions",
                    "Explore the city",
                    "Try local cuisine",
                    "Discover a hidden local spot"
                ]

        itinerary.append({
            "day": day,
            "activities": activities
        })

    return itinerary


def analyze_trip(
    destination,
    days,
    budget,
    travelers,
    preference
):

    days = int(days)

    travelers = int(travelers)

    budget = float(budget)

    budget_per_person = budget / travelers

    budget_category = get_budget_category(
        budget_per_person
    )

    season = get_best_season(destination)

    transport_options = get_transport_options(
        destination,
        travelers
    )

    recommended_mode = recommend_transport(
        transport_options,
        budget,
        travelers,
        preference
    )

    selected_transport_cost = transport_options[
        recommended_mode
    ]["estimated_cost"]

    expenses = calculate_expenses(
        days,
        travelers,
        budget_category,
        selected_transport_cost
    )

    itinerary = generate_itinerary(
        destination,
        days,
        season["type"]
    )

    return {

        "destination": destination,

        "travel_type": season["type"],

        "best_season": season,

        "budget_category": budget_category,

        "recommended_mode": recommended_mode,

        "transport_options": transport_options,

        "estimated_expenses": expenses,

        "itinerary": itinerary
    }