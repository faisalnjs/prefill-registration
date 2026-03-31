export default {
    "id": "prefill-registration",
    "version": "1.0.0",
    "name": "Prefill Registration",
    "description": "Automatically pre-fill course section CRNs or select a template for instant RPI class registration when your time ticket is activated.",
    "author": "faisalnjs",
    "source": "https://faisaln.com/scripts/prefill-registration",
    "urls": [
        "https://sis9.rpi.edu/StudentRegistrationSsb/ssb/registration",
        "https://sis9.rpi.edu/StudentRegistrationSsb/ssb/term/termSelection?mode=registration",
        "https://sis9.rpi.edu/StudentRegistrationSsb/ssb/personaSelection/continuePersonaChange",
        "https://sis9.rpi.edu/StudentRegistrationSsb/ssb/classRegistration/classRegistration"
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
        switch (window.location.href) {
            case "https://sis9.rpi.edu/StudentRegistrationSsb/ssb/registration":
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
                break;
            case "https://sis9.rpi.edu/StudentRegistrationSsb/ssb/term/termSelection?mode=registration":
                setInterval(() => {
                    if (!stopSubscript) {
                        var activateDropdown = document.getElementById("s2id_txt_term");
                        if (activateDropdown && !activateDropdown.children[0].innerText.includes('...')) {
                            var button = document.getElementById("term-go");
                            if (button) {
                                window.clearInterval(this);
                                setTimeout(() => {
                                    button.click();
                                    setTimeout(() => {
                                        document.querySelector(".notification-center-shim")?.remove();
                                    }, 100);
                                }, 100);
                            };
                        };
                    };
                }, 100);
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
                if (fields.find(field => String(field).trim() !== "") !== undefined) {
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
                                        if (i === fields.length - 1) {
                                            document.getElementById("addCRNbutton")?.click();
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
                } else {
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
                                        }, 100);
                                    };
                                }, 100);
                            }, 100);
                        };
                    }, 100);
                };
                break;
            default:
                break;
        };
        return;
    }
};
