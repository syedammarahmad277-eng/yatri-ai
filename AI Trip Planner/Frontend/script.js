/* =========================================================
   YATRA AI
   COMPLETE FRONTEND JAVASCRIPT
   Connected to Flask Backend
========================================================= */

"use strict";


/* =========================================================
   GLOBAL VARIABLES
========================================================= */

let selectedStyle = "adventure";
let currentTripData = null;


/* =========================================================
   START APPLICATION
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("🇮🇳 Yatra AI started");

    initializeNavigation();
    initializeMobileMenu();
    initializePreferences();
    initializePlanner();
    initializeDestinationCards();

});


/* =========================================================
   HELPER
========================================================= */

function getElement(id) {
    return document.getElementById(id);
}


/* =========================================================
   NAVIGATION
========================================================= */

function scrollToPlanner() {

    const planner = getElement("planner");

    if (!planner) {
        console.error("Planner section not found.");
        return;
    }

    planner.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* Make function available to HTML onclick="" */
window.scrollToPlanner = scrollToPlanner;


/* =========================================================
   NAVIGATION LINKS
========================================================= */

function initializeNavigation() {

    document.querySelectorAll(
        '.nav-links a, .mobile-menu a'
    ).forEach(function (link) {

        link.addEventListener(
            "click",
            function (event) {

                const href =
                    link.getAttribute("href");

                if (
                    href &&
                    href.startsWith("#")
                ) {

                    const target =
                        document.querySelector(
                            href
                        );

                    if (target) {

                        event.preventDefault();

                        target.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                    }

                }

            }
        );

    });


    /* Explore India buttons */

    document.querySelectorAll(
        "a, button"
    ).forEach(function (element) {

        const text =
            element.textContent
                .trim()
                .toLowerCase();

        if (
            text === "explore india" ||
            text.includes("explore india")
        ) {

            element.addEventListener(
                "click",
                function (event) {

                    const explore =
                        getElement("explore");

                    if (explore) {

                        event.preventDefault();

                        explore.scrollIntoView({
                            behavior: "smooth"
                        });

                    }

                }
            );

        }

    });

}


/* =========================================================
   MOBILE MENU
========================================================= */

function initializeMobileMenu() {

    const menuButton =
        getElement("mobileMenuBtn");

    const menu =
        getElement("mobileMenu");


    if (
        !menuButton ||
        !menu
    ) {
        return;
    }


    menuButton.addEventListener(
        "click",
        function () {

            menu.classList.toggle(
                "active"
            );

        }
    );


    menu.querySelectorAll("a")
        .forEach(function (link) {

            link.addEventListener(
                "click",
                function () {

                    menu.classList.remove(
                        "active"
                    );

                }
            );

        });

}


/* =========================================================
   TRAVEL STYLE
========================================================= */

function initializePreferences() {

    const buttons =
        document.querySelectorAll(
            ".preference-btn"
        );


    buttons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    buttons.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    selectedStyle =
                        button.dataset.style ||
                        "balanced";


                    console.log(
                        "Travel style:",
                        selectedStyle
                    );

                }
            );

        }
    );

}


/* =========================================================
   PRIORITY
========================================================= */

function getPriority() {

    const selected =
        document.querySelector(
            'input[name="priority"]:checked'
        );


    if (selected) {
        return selected.value;
    }


    return "cheapest";

}


/* =========================================================
   TRIP PLANNER
========================================================= */

function initializePlanner() {

    const analyzeButton =
        getElement("analyzeTripBtn");


    if (!analyzeButton) {

        console.error(
            "Analyze button not found."
        );

        return;
    }


    analyzeButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            analyzeTrip();

        }
    );

}


/* =========================================================
   ANALYZE TRIP
========================================================= */

async function analyzeTrip() {

    /* -----------------------------------------
       GET EXACT HTML INPUTS
    ----------------------------------------- */

    const fromInput =
        getElement("fromLocation");

    const destinationInput =
        getElement("destination");

    const daysInput =
        getElement("days");

    const budgetInput =
        getElement("budget");

    const analyzeButton =
        getElement("analyzeTripBtn");


    /* -----------------------------------------
       SAFETY CHECK
    ----------------------------------------- */

    if (
        !fromInput ||
        !destinationInput ||
        !daysInput ||
        !budgetInput ||
        !analyzeButton
    ) {

        console.error(
            "One or more planner inputs were not found."
        );

        alert(
            "There is a problem with the planner fields. Please check the HTML IDs."
        );

        return;

    }


    /* -----------------------------------------
       READ VALUES
    ----------------------------------------- */

    const from =
        fromInput.value.trim();


    const destination =
        destinationInput.value.trim();


    const daysValue =
        daysInput.value.trim();


    const budgetValue =
        budgetInput.value.trim();


    const days =
        Number(daysValue);


    const budget =
        Number(
            budgetValue.replace(
                /,/g,
                ""
            )
        );


    const priority =
        getPriority();


    /* -----------------------------------------
       VALIDATION
    ----------------------------------------- */

    if (!from) {

        showError(
            "Please enter your starting city."
        );

        fromInput.focus();

        return;

    }


    if (!destination) {

        showError(
            "Please enter your destination."
        );

        destinationInput.focus();

        return;

    }


    if (
        daysValue === "" ||
        !Number.isFinite(days) ||
        days < 1 ||
        days > 60
    ) {

        showError(
            "Please enter a trip duration between 1 and 60 days."
        );

        daysInput.focus();

        return;

    }


    if (
        budgetValue === "" ||
        !Number.isFinite(budget) ||
        budget <= 0
    ) {

        showError(
            "Please enter a valid travel budget."
        );

        budgetInput.focus();

        return;

    }


    console.log(
        "Trip input:",
        {
            from,
            destination,
            days,
            budget,
            style: selectedStyle,
            priority
        }
    );


    /* -----------------------------------------
       SAVE BUTTON CONTENT
    ----------------------------------------- */

    const originalHTML =
        analyzeButton.innerHTML;


    /* -----------------------------------------
       LOADING
    ----------------------------------------- */

    analyzeButton.disabled = true;

    analyzeButton.innerHTML =
        `
        <span>
            Analyzing your journey...
        </span>

        <i class="fa-solid fa-spinner fa-spin"></i>
        `;


    try {

        /* =====================================
           SEND TO FLASK
        ===================================== */

        const response =
            await fetch(
                "http://127.0.0.1:5000/api/plan-trip",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        destination:
                            destination,

                        days:
                            days,

                        budget:
                            budget,

                        travelers:
                            1,

                        preference:
                            selectedStyle,

                        priority:
                            priority,

                        from:
                            from

                    })

                }
            );


        console.log(
            "Backend response status:",
            response.status
        );


        /* -------------------------------------
           CHECK SERVER RESPONSE
        ------------------------------------- */

        if (!response.ok) {

            throw new Error(
                "Backend error: HTTP " +
                response.status
            );

        }


        /* -------------------------------------
           GET JSON
        ------------------------------------- */

        const result =
            await response.json();


        console.log(
            "Backend result:",
            result
        );


        if (
            result.success === false
        ) {

            throw new Error(
                result.message ||
                "Trip analysis failed."
            );

        }


        /* -------------------------------------
           SAVE RESULT
        ------------------------------------- */

        currentTripData =
            result;


        /* -------------------------------------
           DISPLAY RESULT
        ------------------------------------- */

        displayAnalysis(
            result,
            from,
            destination,
            days,
            budget
        );


    } catch (error) {

        console.error(
            "Trip planning error:",
            error
        );


        showError(
            "Unable to connect to Yatra AI. Please make sure your Flask backend is running on port 5000."
        );


    } finally {

        analyzeButton.disabled =
            false;

        analyzeButton.innerHTML =
            originalHTML;

    }

}


/* =========================================================
   DISPLAY ANALYSIS
========================================================= */

function displayAnalysis(
    result,
    from,
    destination,
    days,
    budget
) {

    const analysisSection =
        getElement(
            "analysisSection"
        );


    /* -----------------------------------------
       SHOW ANALYSIS
    ----------------------------------------- */

    if (analysisSection) {

        analysisSection.hidden =
            false;

    }


    /* -----------------------------------------
       TRIP SUMMARY
    ----------------------------------------- */

    setText(
        "resultFrom",
        from
    );


    setText(
        "resultDestination",
        destination
    );


    setText(
        "resultDays",
        days + " Days"
    );


    setText(
        "resultBudget",
        formatCurrency(budget)
    );


    /* -----------------------------------------
       RECOMMENDED MODE
    ----------------------------------------- */

    const recommendedMode =
        result.recommended_mode ||
        result.recommendation?.mode ||
        "Train";


    setText(
        "recommendedMode",
        recommendedMode
    );


    /* -----------------------------------------
       RECOMMENDATION REASON
    ----------------------------------------- */

    const reason =
        result.recommendationReason ||
        result.recommendation?.reason ||
        getTransportReason(
            recommendedMode
        );


    setText(
        "recommendationReason",
        reason
    );


    /* -----------------------------------------
       TRAVEL SCORE
    ----------------------------------------- */

    const score =
        result.travel_score ||
        result.travelScore ||
        result.recommendation?.score ||
        "";


    if (score !== "") {

        setText(
            "travelScore",
            score
        );

    }


    /* -----------------------------------------
       SEASON
    ----------------------------------------- */

    displaySeason(
        result
    );


    /* -----------------------------------------
       TRANSPORT
    ----------------------------------------- */

    displayTransport(
        result
    );


    /* -----------------------------------------
       EXPENSES
    ----------------------------------------- */

    displayExpenses(
        result
    );


    /* -----------------------------------------
       SCROLL
    ----------------------------------------- */

    if (analysisSection) {

        setTimeout(
            function () {

                analysisSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            },
            200
        );

    }

}


/* =========================================================
   SEASON
========================================================= */

function displaySeason(
    result
) {

    const season =
        result.best_season ||
        result.season;


    if (!season) {
        return;
    }


    if (
        typeof season ===
        "string"
    ) {

        setText(
            "bestSeason",
            season
        );


        setText(
            "seasonReason",
            "This period is generally recommended for comfortable travel."
        );


        return;

    }


    if (
        typeof season ===
        "object"
    ) {

        setText(
            "bestSeason",
            season.best ||
            season.season ||
            season.name ||
            "October – March"
        );


        setText(
            "seasonReason",
            season.reason ||
            "Generally pleasant conditions for exploring."
        );

    }

}


/* =========================================================
   TRANSPORT
========================================================= */

function displayTransport(
    result
) {

    const container =
        getElement(
            "transportResults"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    /*
       Your Flask engine may return:

       transport: {
           road: {...},
           train: {...},
           flight: {...}
       }

       OR

       transport_options: [...]
    */


    let transport =
        result.transport ||
        result.transport_options;


    if (!transport) {

        container.innerHTML =
            `
            <p>
                Transport information is not available.
            </p>
            `;

        return;

    }


    /* -----------------------------------------
       ARRAY FORMAT
    ----------------------------------------- */

    if (
        Array.isArray(transport)
    ) {

        transport.forEach(
            function (option) {

                createTransportCard(
                    container,
                    option.mode ||
                    option.name ||
                    "Transport",
                    option
                );

            }
        );

    }


    /* -----------------------------------------
       OBJECT FORMAT
    ----------------------------------------- */

    else {

        Object.entries(
            transport
        ).forEach(
            function (
                [mode, option]
            ) {

                if (
                    typeof option !==
                    "object"
                ) {
                    return;
                }


                createTransportCard(
                    container,
                    mode,
                    option
                );

            }
        );

    }

}


/* =========================================================
   TRANSPORT CARD
========================================================= */

function createTransportCard(
    container,
    mode,
    option
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "transport-card";


    const modeName =
        option.name ||
        option.label ||
        formatTransportName(
            mode
        );


    const cost =
        option.estimated_cost ??
        option.cost ??
        option.price ??
        0;


    const duration =
        option.duration ||
        "Varies";


    const score =
        option.score ||
        "";


    const recommended =
        option.recommended === true ||
        String(
            currentTripData?.recommended_mode ||
            ""
        ).toLowerCase()
            .includes(
                String(mode)
                    .toLowerCase()
            );


    if (recommended) {

        card.classList.add(
            "recommended"
        );

    }


    card.innerHTML =
        `
        <div class="transport-icon">
            ${getTransportIcon(mode)}
        </div>

        <div class="transport-content">

            <h3>
                ${escapeHTML(modeName)}
            </h3>

            <div class="transport-price">
                ${formatCurrency(cost)}
            </div>

            <div class="transport-duration">
                <i class="fa-regular fa-clock"></i>
                ${escapeHTML(duration)}
            </div>

            ${
                score
                    ? `
                    <div class="transport-score">
                        ⭐ ${score}/5
                    </div>
                    `
                    : ""
            }

            ${
                recommended
                    ? `
                    <div class="recommended-label">
                        AI RECOMMENDED
                    </div>
                    `
                    : ""
            }

        </div>
        `;


    container.appendChild(
        card
    );

}


/* =========================================================
   EXPENSES
========================================================= */

function displayExpenses(
    result
) {

    const expenses =
        result.estimated_expenses ||
        result.expenses;


    if (!expenses) {
        return;
    }


    setText(
        "transportExpense",
        formatCurrency(
            expenses.transport || 0
        )
    );


    setText(
        "hotelExpense",
        formatCurrency(
            expenses.hotel || 0
        )
    );


    setText(
        "foodExpense",
        formatCurrency(
            expenses.food || 0
        )
    );


    setText(
        "activityExpense",
        formatCurrency(
            expenses.activities ||
            expenses.activity ||
            0
        )
    );


    setText(
        "localExpense",
        formatCurrency(
            expenses.local_transport ||
            expenses.localTransport ||
            0
        )
    );


    const total =
        expenses.total ||
        (
            Number(
                expenses.transport || 0
            ) +
            Number(
                expenses.hotel || 0
            ) +
            Number(
                expenses.food || 0
            ) +
            Number(
                expenses.activities ||
                expenses.activity ||
                0
            ) +
            Number(
                expenses.local_transport ||
                expenses.localTransport ||
                0
            )
        );


    setText(
        "totalExpense",
        formatCurrency(total)
    );


    setText(
        "finalExpense",
        formatCurrency(total)
    );


    /* -----------------------------------------
       REMAINING BUDGET
    ----------------------------------------- */

    const budget =
        Number(
            result.budget ||
            result.trip?.budget ||
            0
        );


    if (budget > 0) {

        const remaining =
            budget -
            Number(total);


        if (remaining >= 0) {

            setText(
                "budgetRemaining",
                formatCurrency(
                    remaining
                ) +
                " remaining from your budget"
            );

        } else {

            setText(
                "budgetRemaining",
                formatCurrency(
                    Math.abs(
                        remaining
                    )
                ) +
                " over your budget"
            );

        }


        /* -------------------------------------
           PROGRESS BAR
        ------------------------------------- */

        const progress =
            getElement(
                "budgetProgress"
            );


        if (progress) {

            const percentage =
                Math.min(
                    (
                        Number(total) /
                        budget
                    ) * 100,
                    100
                );


            progress.style.width =
                percentage + "%";

        }

    }

}


/* =========================================================
   DESTINATION CARDS
========================================================= */

function initializeDestinationCards() {

    document.querySelectorAll(
        "[data-destination]"
    ).forEach(
        function (card) {

            card.addEventListener(
                "click",
                function (event) {

                    /*
                       Don't interfere with the
                       existing "Plan this trip"
                       button.
                    */

                    if (
                        event.target.closest(
                            "button"
                        )
                    ) {
                        return;
                    }


                    const destination =
                        card.dataset.destination;


                    if (destination) {

                        selectDestination(
                            destination
                        );

                    }

                }
            );

        }
    );

}


/* =========================================================
   SELECT DESTINATION
========================================================= */

function selectDestination(
    destinationName
) {

    const destinationInput =
        getElement(
            "destination"
        );


    if (destinationInput) {

        destinationInput.value =
            destinationName;

    }


    scrollToPlanner();


    setTimeout(
        function () {

            if (destinationInput) {

                destinationInput.focus();

            }

        },
        600
    );

}


/* Make available to HTML onclick */
window.selectDestination =
    selectDestination;


/* =========================================================
   ERROR
========================================================= */

function showError(
    message
) {

    console.error(
        message
    );


    /*
       Use an existing error element
       if your HTML has one.
    */

    const errorElement =
        getElement(
            "errorMessage"
        );


    if (errorElement) {

        errorElement.textContent =
            message;

        errorElement.hidden =
            false;


        setTimeout(
            function () {

                errorElement.hidden =
                    true;

            },
            5000
        );


        return;

    }


    alert(message);

}


/* =========================================================
   TRANSPORT ICON
========================================================= */

function getTransportIcon(
    mode
) {

    const value =
        String(mode)
            .toLowerCase();


    if (
        value.includes(
            "flight"
        )
    ) {

        return "✈️";

    }


    if (
        value.includes(
            "train"
        )
    ) {

        return "🚆";

    }


    if (
        value.includes(
            "road"
        ) ||
        value.includes(
            "car"
        )
    ) {

        return "🚗";

    }


    return "🧭";

}


/* =========================================================
   TRANSPORT NAME
========================================================= */

function formatTransportName(
    mode
) {

    const value =
        String(mode)
            .toLowerCase();


    if (
        value === "train"
    ) {
        return "Train";
    }


    if (
        value === "road"
    ) {
        return "Road";
    }


    if (
        value === "flight"
    ) {
        return "Flight";
    }


    return capitalize(
        mode
    );

}


/* =========================================================
   TRANSPORT REASON
========================================================= */

function getTransportReason(
    mode
) {

    const value =
        String(mode)
            .toLowerCase();


    if (
        value.includes(
            "flight"
        )
    ) {

        return "Flight saves travel time and is ideal when speed and convenience are your priority.";

    }


    if (
        value.includes(
            "road"
        )
    ) {

        return "Road travel gives you flexibility and allows you to enjoy scenic routes and stops along the way.";

    }


    if (
        value.includes(
            "train"
        )
    ) {

        return "Train offers a strong balance between affordability, comfort and travel time.";

    }


    return "This option provides a balanced way to reach your destination.";

}


/* =========================================================
   SET TEXT
========================================================= */

function setText(
    id,
    value
) {

    const element =
        getElement(id);


    if (element) {

        element.textContent =
            value ?? "";

    }

}


/* =========================================================
   CURRENCY
========================================================= */

function formatCurrency(
    amount
) {

    const number =
        Number(amount);


    if (
        !Number.isFinite(number)
    ) {

        return "₹0";

    }


    return (
        "₹" +
        Math.round(number)
            .toLocaleString(
                "en-IN"
            )
    );

}


/* =========================================================
   CAPITALIZE
========================================================= */

function capitalize(
    value
) {

    if (!value) {
        return "";
    }


    const text =
        String(value);


    return (
        text.charAt(0)
            .toUpperCase() +
        text.slice(1)
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(
    value
) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   RESET / NEW TRIP
========================================================= */

function resetTrip() {

    const from =
        getElement(
            "fromLocation"
        );

    const destination =
        getElement(
            "destination"
        );

    const days =
        getElement(
            "days"
        );

    const budget =
        getElement(
            "budget"
        );


    if (from) {
        from.value = "";
    }


    if (destination) {
        destination.value = "";
    }


    if (days) {
        days.value = "";
    }


    if (budget) {
        budget.value = "";
    }


    const analysis =
        getElement(
            "analysisSection"
        );


    if (analysis) {

        analysis.hidden =
            true;

    }


    currentTripData =
        null;


    scrollToPlanner();

}


window.resetTrip =
    resetTrip;


/* =========================================================
   DEBUG INFORMATION
========================================================= */

console.log(
    "✅ Yatra AI JavaScript loaded successfully."
);

console.log(
    "Planner IDs:",
    {
        from: !!getElement("fromLocation"),
        destination: !!getElement("destination"),
        days: !!getElement("days"),
        budget: !!getElement("budget"),
        analyze: !!getElement("analyzeTripBtn")
    }
);