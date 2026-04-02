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
            case "https://sis9.rpi.edu/StudentRegistrationSsb/ssb/term/termSelection?mode=registration":
                setInterval(() => {
                    if (!stopSubscript) {
                        var activateDropdown = document.getElementById("s2id_txt_term");
                        if (activateDropdown) {
                            if (!activateDropdown.children[0].innerText.includes('...')) {
                                var button = document.getElementById("term-go");
                                if (button) {
                                    window.clearInterval(this);
                                    stopSubscript = true;
                                    button.click();
                                    setTimeout(() => {
                                        document.querySelector(".notification-center-shim")?.remove();
                                    }, 100);
                                };
                            } else {
                                activateDropdown.style.border = "10px transparent inset";
                                setTimeout(() => {
                                    activateDropdown.style.border = "10px red inset";
                                }, 1000);
                                setInterval(() => {
                                    activateDropdown.style.border = "10px transparent inset";
                                    setTimeout(() => {
                                        activateDropdown.style.border = "10px red inset";
                                    }, 1000);
                                }, 2000);
                            };
                        };
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
                        button.click();
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
                        setTimeout(() => {
                            tab.click();
                            setInterval(() => {
                                if (stopSubscript2) return;
                                var button = document.querySelector('[data-crns]');
                                if (button) {
                                    window.clearInterval(this);
                                    stopSubscript2 = true;
                                    button.click();
                                    setTimeout(() => {
                                        document.querySelector(".notification-center-shim")?.remove();
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
                            const planCourses = preferredPlan.planCourses.map(course => course.courseReferenceNumber);
                            useFields(planCourses);
                        });
                    };
                }, 1000);
            } else if ((typeof fields !== "undefined") && (fields.find(field => String(field).trim() !== "") !== undefined)) {
                useFields(fields);
            };
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
                                    setInterval(() => {
                                        var saveButton = document.getElementById("saveButton");
                                        if (saveButton) {
                                            window.clearInterval(this);
                                            saveButton.click();
                                            setTimeout(() => {
                                                document.querySelector(".notification-center-shim")?.remove();
                                            }, 100);
                                        };
                                    }, 100);
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
        return;
    }
};
