(function Hurry() {
    const settings = {
        time: 0,
        normal: "green",
        warning: "orange",
        hurry: "red",
        label: "grey",
        top: 20,
        right: 20,
        bottom: "",
        left: "",
        width: 200,
        height: 5,
        border: "grey",
    };
    const data = {
        slideNumber: 0,
        slides: {},
    };
    const opposites = {
        left: "right",
        right: "left",
        top: "bottom",
        bottom: "top",
    }
    const urlParts = document.location.pathname.split("/");
    const docId = urlParts[urlParts.length - 2];

    function run() {
        if (inPresentationMode()) {
            showTimer();
        } else {
            checkReport();
            loadNotes();
        }
    }

    function inPresentationMode() {
        return !$("#punch-start-presentation-left").is(":visible");
    }

    function syncSettings() {
        for (const name in settings) {
            const value = localStorage.getItem("hurry-" + docId + "-" + name);
            settings[name] = (value === null) ? settings[name] : value;
        }
    }

    function clearSettings() {
        for (const name in settings) {
            localStorage.removeItem("hurry-" + docId + "-" + name);
        }
    }

    function update() {
        if (settings.time < 1) return;
        updateProgressBar();
        updateTimeOnSlide();
    }

    function updateProgressBar() {
        const startMillis = data.start;
        const nowMillis = Date.now();
        const elapsedSeconds = Math.round((nowMillis - startMillis) / 1000);
        const totalSeconds = (settings.time * 60);
        const ratio = elapsedSeconds / totalSeconds;
        const mainWidth = $("#hurry-progressbar").width();
        const mainHeight = $("#hurry-progressbar").height();
        if (mainWidth > mainHeight) {
            const width = Math.min(mainWidth, mainWidth * ratio);
            $("#hurry-innerbar")
                .css("width", width);
        } else {
            const height = Math.min(mainHeight, mainHeight * ratio);
            $("#hurry-innerbar")
                .css("height", height);
        }
        const color = ratio > 0.5 ? ratio > 0.75 ? settings.hurry : settings.warning : settings.normal;
        $("#hurry-innerbar")
            .css("background", color);
        const secondsLeft = Math.round(Math.max(0, totalSeconds - elapsedSeconds));
        const minutesLeft = Math.round(secondsLeft / 60);
        $("#hurry-label")
            .text(minutesLeft > 0 ? minutesLeft + "m" : secondsLeft + "s");
        var visibility = "visible";
        if (ratio > 0.9 && (elapsedSeconds % 2)) visibility = "hidden";
        $("#hurry-progressbar")
            .css("visibility", visibility);
    }

    function updateTimeOnSlide() {
        const slideNumber = getSlideNumber();
        var slideInfo = data.slides[slideNumber];
        if (!slideInfo) {
            slideInfo = data.slides[slideNumber] = {
                number: slideNumber,
                secondsOnSlide: 0,
            }
        }
        slideInfo.secondsOnSlide += 1;
    }

    function showTimer() {
        if (!$("#hurry-progressbar").length) {
            syncSettings();
            $("<div>")
                .attr("id", "hurry-progressbar")
                .css("visibility", "hidden")
                .css("position", "absolute")
                .css("bottom", settings.bottom + "px")
                .css("left", settings.left + "px")
                .css("top", settings.top + "px")
                .css("right", settings.right + "px")
                .css("width", settings.width)
                .css("height", settings.height)
                .css("border", "1px solid " + settings.border)
                .appendTo($("body"))
                .append($("<div>")
                    .attr("id", "hurry-label")
                    .css("font-family", "Arial")
                    .css("font-size", Math.max(9, settings.height * 2) + "px")
                    .css("margin", "2px")
                    .css("position", "absolute")
                    .css("top", "-14px")
                    .css("right", "0px")
                    .css("color", settings.label))
                .append($("<div>")
                    .attr("id", "hurry-innerbar")
                    .css("background", settings.normal)
                    .css("width", settings.width)
                    .css("height", settings.height));
            data.start = Date.now();
            setInterval(update, 1000);
            printSettings();
        }
    }

    function printSettings() {
        var text = "Hurry: Presenting with these settings:\n";
        for (const name in settings) {
            text += "  - " + name + ": " + settings[name] + "\n";
        }
        console.log(text)
    }

    function getSlideNumber() {
        const edit = $(".punch-filmstrip-selected-thumbnail-pagenumber").text();
        const present = $("div[aria-posinset]").attr("aria-posinset");
        return parseInt(edit || present);
    }

    function loadNotes() {
        const slideNumber = getSlideNumber();
        if (slideNumber != 1) return;
        const assignments = [];
        $("#speakernotes .sketchy-text-content").each((_, lineElement) => {
            const line = $(lineElement).text();
            if (!line.startsWith("#")) return;
            $(lineElement).find("text").each((_, textElement) => {
                text = $(textElement).text();
                if (text.indexOf("=") != -1) {
                    assignments.push(text);
                }
            });
        });
        if (!assignments.length) return;
        clearSettings();
        for (const assignment of assignments) {
            const parts = assignment.split("=");
            const name = parts[0];
            if (!name) continue;
            const value = parts[1];
            localStorage.setItem(getStorageKey(name), value);
            clearOpposite(name);
        }
    }

    function getStorageKey(name) {
        return "hurry-" + docId + "-" + name;
    }

    function clearOpposite(name) {
        if (opposites[name]) {
            localStorage.setItem(getStorageKey(opposites[name]), "");
        }
    }

    syncSettings();
    $(window).unload(saveReport);
    
    function saveReport() {
        if (inPresentationMode()) {
            localStorage.setItem(getStorageKey("report"), JSON.stringify(data.slides));
        }
    }

    function checkReport() {
        if ($("#hurry-report-link").length) return;
        const report = localStorage.getItem(getStorageKey("report"));
        if (!report) return;
        const reportNode = $("a")
            .attr("id", "hurry-report-link")
            .addClass("hurry-report-link")
            .attr("data-tooltip", "Show Hurry Report")
            .attr("aria-label", "Show Hurry Report")
            .attr("href", "#")
            .css("display", "block")
            .css("position", "absolute")
            .css("text-decoration", "underline")
            .css("top", "5px")
            .css("cursor", "pointer")
            .css("right", "5px")
            .css("color", "#777")
            .text("Hurry report is available")
            .click(showReport)
            .appendTo($("#speakernotes-workspace"));
        setTimeout(removeAllCopiesAddedByGoogleSlides, 100);
        console.log("Hurry: Added report link to speaker notes");
    }

    function removeAllCopiesAddedByGoogleSlides() {
        $(".hurry-report-link").each((index, element) => {
            const node = $(element);
            if (node.attr("target") == "_blank" || node.attr("class") != "hurry-report-link") {
                node.remove();
            }
        });
    }

    function showReport() {
        const report = JSON.parse(localStorage.getItem(getStorageKey("report")));
        var message = "Hurry: Latest presentation report:\n";
        for (const slideNumber in report) {
            const seconds = report[slideNumber].secondsOnSlide;
            var duration = seconds + " seconds";
            if (seconds > 60) {
                duration = Math.floor(seconds / 60) + " minute";
                if (Math.floor(seconds / 60) > 1) duration += "s";
                if (seconds % 60) duration += " and " + seconds % 60 + " seconds";
            }
            message += "  slide " + slideNumber + ":  " + duration + "\n";
        }
        console.log(message);
        alert(message);
    }

    var timer = setTimeout(run, 1);
    document.body.addEventListener('DOMSubtreeModified', function() {
        clearTimeout(timer);
        timer = setTimeout(run, 1);
    });

})();

