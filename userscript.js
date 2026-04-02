// ==UserScript==
// @name         Prefill Registration
// @namespace    https://faisaln.com/scripts/prefill-registration
// @version      2.0
// @description  Automatically pre-fill course section CRNs or select a template for instant RPI class registration when your time ticket is activated.
// @author       Faisal N
// @match        https://sis9.rpi.edu/StudentRegistrationSsb*
// @icon         https://faisaln.com/logo.png
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_addStyle
// @updateURL    https://raw.githubusercontent.com/faisalnjs/prefill-registration/refs/heads/main/userscript.js
// @downloadURL  https://raw.githubusercontent.com/faisalnjs/prefill-registration/refs/heads/main/userscript.js
// @supportURL   https://faisaln.com
// @source       https://faisaln.com/scripts/prefill-registration
// ==/UserScript==

(function () {
    'use strict';
    GM_addStyle(`
        #spinner, .loading, .notification-center-shim {
            display: none !important;
        }

        #term-go {
            cursor: pointer !important;
            opacity: 1 !important;
        }
    `);
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
            var findingTimeTicket = false;
            var timeTicket = null;
            var failedToFindTimeTicket = false;
            setInterval(() => {
                if (!stopSubscript && (failedToFindTimeTicket || (!findingTimeTicket && (!timeTicket || (new Date() >= (timeTicket - 10000)))))) {
                    var activateDropdown = document.getElementById("s2id_txt_term");
                    if (activateDropdown) {
                        GM_addStyle(`
                            #notification-center {
                                display: none !important;
                            }
                        `);
                        if (!activateDropdown.children[0].innerText.includes('...')) {
                            var button = document.getElementById("term-go");
                            if (button) {
                                window.clearInterval(this);
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
                                            };
                                        } else {
                                            findingTimeTicket = false;
                                            failedToFindTimeTicket = true;
                                        };
                                    }, 100);
                                };
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
                    stopSubscript = true;
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
                        const planCourses = preferredPlan.planCourses.filter(course => course.courseReferenceNumber !== null).map(course => Number(course.courseReferenceNumber));
                        useFields(planCourses);
                    });
                };
            }, 1000);
        } else if ((typeof fields !== "undefined") && (fields.find(field => String(field).trim() !== "") !== undefined)) {
            useFields(fields);
        };
    };
    function useFields(fields) {
        console.log(fields)
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
})();