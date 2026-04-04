export default {
    "id": "prefill-registration",
    "version": "1.0.0",
    "name": "Prefill Registration",
    "description": "Automatically pre-fill course section CRNs or select a template for instant RPI class registration when your time ticket is activated.",
    "author": "faisalnjs",
    "source": "https://faisaln.com/scripts/prefill-registration",
    "urls": [
        "https://sis9.rpi.edu/StudentRegistrationSsb/ssb/registration",
        "https://sis9.rpi.edu/StudentRegistrationSsb/ssb/registration/registration",
        "https://sis9.rpi.edu/StudentRegistrationSsb/ssb/plan/selectPlan",
        "https://sis9.rpi.edu/StudentRegistrationSsb/ssb/term/termSelection?mode=registration",
        "https://sis9.rpi.edu/StudentRegistrationSsb/ssb/personaSelection/continuePersonaChange",
        "https://sis9.rpi.edu/StudentRegistrationSsb/ssb/classRegistration/classRegistration",
        "https://sis9.rpi.edu/StudentRegistrationSsb/ssb/classRegistration/classRegistration#"
    ],
    "timers": [],
    "fields": [
        "CRN 1",
        "CRN 2",
        "CRN 3",
        "CRN 4",
        "CRN 5",
        "CRN 6"
    ],
    "script": () => {
        var stopSubscript = false;
        var stopSubscript2 = false;
        document.addEventListener('keydown', (event) => {
            if (event.key === "Escape") {
                stopSubscript = true;
                stopSubscript2 = true;
                setTimeout(() => {
                    document.querySelector(".notification-center-shim")?.remove();
                }, 100);
            };
        });
        switch (window.location.href) {
            case "https://sis9.rpi.edu/StudentRegistrationSsb/ssb/registration":
                registration();
                break;
            case "https://sis9.rpi.edu/StudentRegistrationSsb/ssb/registration/registration":
                registration();
                break;
            case "https://sis9.rpi.edu/StudentRegistrationSsb/ssb/plan/selectPlan":
                setTimeout(() => {
                    document.querySelectorAll('.strong').forEach(createdBy => createdBy.innerHTML = createdBy.innerHTML.replaceAll("Preferred", "Prefill Preferred"));
                }, 1000);
                break;
            case "https://sis9.rpi.edu/StudentRegistrationSsb/ssb/term/termSelection?mode=registration":
                var findingTimeTicket = false;
                var timeTicket = null;
                var failedToFindTimeTicket = false;
                var timeTicketCountdown = null;
                setInterval(() => {
                    if (!stopSubscript && (failedToFindTimeTicket || (!findingTimeTicket && (!timeTicket || (new Date() >= (timeTicket - 10000)))))) {
                        if (timeTicketCountdown) timeTicketCountdown.innerText = `Time ticket will be active in ${Math.max(0, Math.ceil((timeTicket - new Date()) / 1000))}s at ${timeTicket.toLocaleTimeString()}. Attempting registration...`;
                        var activateDropdown = document.getElementById("s2id_txt_term");
                        if (activateDropdown) {
                            if (!activateDropdown.children[0].innerText.includes('...')) {
                                var button = document.getElementById("term-go");
                                if (button) {
                                    window.clearInterval(this);
                                    setTimeout(() => {
                                        button.click();
                                        setTimeout(() => {
                                            document.querySelector(".notification-center-shim")?.remove();
                                        }, 100);
                                        if (!timeTicket) {
                                            findingTimeTicket = true;
                                            setTimeout(() => {
                                                var notification = Array.from(document.querySelectorAll(".notification-flyout-item.notification-message")).find(notification => notification.innerText.includes("You can register from "));
                                                if (notification) {
                                                    timeTicket = new Date(notification.innerText.split("from ")[1].split(" to")[0]);
                                                    if (timeTicket) {
                                                        console.log(`Time ticket found: ${timeTicket}.`);
                                                        findingTimeTicket = false;
                                                        failedToFindTimeTicket = false;
                                                        timeTicketCountdown = document.createElement("div");
                                                        timeTicketCountdown.style.position = "fixed";
                                                        timeTicketCountdown.style.bottom = "50px";
                                                        timeTicketCountdown.style.left = "25%";
                                                        timeTicketCountdown.style.padding = "10px";
                                                        timeTicketCountdown.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
                                                        timeTicketCountdown.style.color = "white";
                                                        timeTicketCountdown.style.fontSize = "16px";
                                                        timeTicketCountdown.style.borderRadius = "5px";
                                                        timeTicketCountdown.style.width = "50%";
                                                        timeTicketCountdown.style.textAlign = "center";
                                                        timeTicketCountdown.innerText = `Time ticket will be active in ${Math.max(0, Math.floor((timeTicket - new Date()) / 3600000))}h ${String(Math.max(0, Math.floor((timeTicket - new Date()) % 3600000 / 60000))).padStart(2, '0')}m ${String(Math.max(0, Math.ceil((timeTicket - new Date()) / 1000) % 60)).padStart(2, '0')}s at ${timeTicket.toLocaleTimeString()}.`;
                                                        document.body.appendChild(timeTicketCountdown);
                                                    };
                                                } else {
                                                    findingTimeTicket = false;
                                                    failedToFindTimeTicket = true;
                                                };
                                            }, 5000);
                                        };
                                    }, 100);
                                };
                            } else {
                                activateDropdown.style.border = "10px transparent inset";
                                setTimeout(() => {
                                    activateDropdown.style.border = "10px red inset";
                                }, 1000);
                            };
                        };
                    } else if (timeTicket && (new Date() < (timeTicket - 10000))) {
                        console.log(`Time ticket will be active at ${timeTicket}.`);
                        if (timeTicketCountdown) timeTicketCountdown.innerText = `Time ticket will be active in ${Math.max(0, Math.floor((timeTicket - new Date()) / 3600000))}h ${String(Math.max(0, Math.floor((timeTicket - new Date()) % 3600000 / 60000))).padStart(2, '0')}m ${String(Math.max(0, Math.ceil((timeTicket - new Date()) / 1000) % 60)).padStart(2, '0')}s at ${timeTicket.toLocaleTimeString()}.`;
                    };
                }, 500);
                break;
            case "https://sis9.rpi.edu/StudentRegistrationSsb/ssb/personaSelection/continuePersonaChange":
                setInterval(() => {
                    if (stopSubscript) return;
                    var button = document.getElementById("continue-button");
                    if (button) {
                        window.clearInterval(this);
                        stopSubscript = true;
                        setTimeout(() => {
                            button.click();
                        }, 100);
                    };
                }, 100);
                break;
            case "https://sis9.rpi.edu/StudentRegistrationSsb/ssb/classRegistration/classRegistration":
                classRegistration();
                break;
            case "https://sis9.rpi.edu/StudentRegistrationSsb/ssb/classRegistration/classRegistration#":
                classRegistration();
                break;
            default:
                break;
        };
        function registration() {
            document.getElementById('registerLink').style.border = "10px transparent inset";
            setTimeout(() => {
                document.getElementById('registerLink').style.border = "10px red inset";
            }, 1000);
            setInterval(() => {
                document.getElementById('registerLink').style.border = "10px transparent inset";
                setTimeout(() => {
                    document.getElementById('registerLink').style.border = "10px red inset";
                }, 1000);
            }, 2000);
        };
        function classRegistration() {
            if (typeof fields === "undefined") {
                setInterval(() => {
                    if (stopSubscript) return;
                    var tab = document.getElementById("loadPlans-tab");
                    if (tab) {
                        window.clearInterval(this);
                        stopSubscript = true;
                        setTimeout(() => {
                            tab.click();
                            setInterval(() => {
                                if (stopSubscript2) return;
                                var button = document.querySelector('[data-crns]');
                                if (button) {
                                    window.clearInterval(this);
                                    stopSubscript2 = true;
                                    setTimeout(() => {
                                        button.click();
                                        setTimeout(() => {
                                            document.querySelector(".notification-center-shim")?.remove();
                                        }, 100);
                                        setInterval(() => {
                                            var saveButton = document.getElementById("saveButton");
                                            if (saveButton) {
                                                window.clearInterval(this);
                                                setTimeout(() => {
                                                    saveButton.click();
                                                    setTimeout(() => {
                                                        document.querySelector(".notification-center-shim")?.remove();
                                                    }, 100);
                                                    afterCRNsAdded();
                                                }, 100);
                                            };
                                        }, 100);
                                    }, 100);
                                };
                            }, 100);
                        }, 100);
                    };
                }, 100);
                setTimeout(() => {
                    if (!document.getElementById("loadPlans-tab")) {
                        stopSubscript = true;
                        fetch('https://sis9.rpi.edu/StudentRegistrationSsb/ssb/plan/selectPlan').then(async selectPlan => {
                            const text = await selectPlan.text();
                            const plans = (text.split('window.bootstraps = ')[1].split('];')[0] + ']').split('plans:')[1].split('selectPlanConfig')[0].trim().slice(0, -1);
                            const plansJSON = JSON.parse(plans);
                            const preferredPlan = plansJSON.find(plan => plan.preferredIndicator);
                            const planCourses = preferredPlan.planCourses.filter(course => course.courseReferenceNumber !== null).map(course => Number(course.courseReferenceNumber));
                            useFields(planCourses);
                        });
                    };
                }, 2500);
            } else if ((typeof fields !== "undefined") && (fields.find(field => String(field).trim() !== "") !== undefined)) {
                useFields(fields);
            };
            setTimeout(() => {
                document.querySelectorAll('.created-by').forEach(createdBy => createdBy.innerHTML = createdBy.innerHTML.replaceAll("Preferred", "Prefill Preferred"));
            }, 1000);
        };
        function useFields(fields) {
            if (!fields.length) return;
            stopSubscript = false;
            setInterval(() => {
                if (stopSubscript) return;
                var tab = document.getElementById("enterCRNs-tab");
                if (tab) {
                    window.clearInterval(this);
                    stopSubscript = true;
                    setTimeout(() => {
                        tab.click();
                        for (let i = 0; i < fields.length; i++) {
                            setTimeout(() => {
                                var CRN = String(fields[i]).trim();
                                document.getElementById(`txt_crn${i + 1}`).value = CRN;
                                if (i === (fields.length - 1)) {
                                    document.getElementById("addCRNbutton")?.click();
                                    afterCRNsAdded();
                                } else {
                                    document.getElementById("addAnotherCRN")?.click();
                                };
                                setTimeout(() => {
                                    document.querySelector(".notification-center-shim")?.remove();
                                }, 100);
                            }, 100);
                        };
                    }, 100);
                };
            }, 100);
        };
        if (typeof inactivityTimer !== "undefined") setInterval(() => {
            inactivityTimer.reset();
        }, 60000);
        var alreadyRegistered = false;
        var alreadyWaitlisted = false;
        function afterCRNsAdded() {
            var saveButton = document.getElementById("saveButton");
            if (saveButton) {
                window.clearInterval(this);
                saveButton.click();
                setTimeout(() => {
                    document.querySelector(".notification-center-shim")?.remove();
                }, 100);
                if (!alreadyRegistered || !alreadyWaitlisted) setTimeout(() => {
                    if (!alreadyRegistered && Array.from(document.querySelectorAll(".notification-flyout-item.notification-message")).find(notification => notification.innerText.includes("Section is a duplicate of an existing registration."))) {
                        alreadyRegistered = true;
                        afterCRNsAdded();
                        return;
                    };
                    if (!alreadyWaitlisted) setTimeout(() => {
                        var notifications = Array.from(document.querySelectorAll(".notification-flyout-item.notification-message")).filter(notification => notification.innerText.includes(" Waitlisted"));
                        if (notifications.length) {
                            var CRNsToWaitlist = notifications.map(notification => notification.innerText.split("CRN ")[1].split(":")[0]);
                            if (CRNsToWaitlist.length) {
                                console.log("Attempting to waitlist CRNs: ", CRNsToWaitlist);
                                for (let i = 0; i < CRNsToWaitlist.length; i++) {
                                    var CRN = CRNsToWaitlist[i];
                                    var internalCourseID = Array.from(document.querySelectorAll("#summaryBody [data-property='courseReferenceNumber']")).find(course => course.innerText == CRN).getAttribute("data-id");
                                    collectionToCheckForDirty[0].models.find(m => m.id == internalCourseID)._dirty = true;
                                    collectionToCheckForDirty[0].models.find(m => m.id == internalCourseID).attributes.selectedAction = "WL";
                                };
                                alreadyWaitlisted = true;
                                saveButton.disabled = false;
                                afterCRNsAdded();
                            };
                        };
                    }, 100);
                }, 500);
            };
        };
        return;
    }
};
