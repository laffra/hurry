(function Hurry() {
    const settings = {
        time: 45,
        normal: "green",
        warning: "orange",
        hurry: "red",
        label: "grey",
        top: 20,
        right: 20,
        width: 200,
        height: 5,
        border: "1px solid grey",
        start: Date.now(),
    };
    const urlParts = document.location.pathname.split("/");
    const docId = urlParts[urlParts.length - 2];

    function run() {
        if ($("#punch-start-presentation-left").is(":visible")) {
            loadNotes();
        } else {
            showTimer();
        }
    }

    function update() {
        const startMillis = settings["start"];
        const nowMillis = Date.now();
        const elapsedSeconds = (nowMillis - startMillis) / 1000;
        const totalSeconds = (settings["time"] * 60);
        const ratio = elapsedSeconds / totalSeconds;
        const width = Math.min(settings["width"], settings["width"] * ratio);
        const color = ratio > 0.5 ? ratio > 0.75 ? settings["hurry"] : settings["warning"] : settings["normal"];
        $("#hurry-bar")
            .css("background", color)
            .css("width", width + "px");
        const secondsLeft = Math.round(Math.max(0, totalSeconds - elapsedSeconds));
        const minutesLeft = Math.round(secondsLeft / 60);
        $("#hurry-label")
            .text(minutesLeft > 0 ? minutesLeft + "m" : secondsLeft + "s");
    }

    function showTimer() {
        if (!$("#hurry-timer").length) {
            for (const key in settings) {
                settings[key] = localStorage.getItem("hurry-" + docId + "-" + key) || settings[key];
            }
            $("<div>")
                .attr("id", "hurry-timer")
                .css("position", "absolute")
                .css("top", settings["top"] + "px")
                .css("right", settings["right"] + "px")
                .css("width", settings["width"] + "px")
                .css("height", settings["height"] + "px")
                .css("border", settings["border"])
                .appendTo($("body"))
                .append($("<div>")
                    .attr("id", "hurry-label")
                    .css("font-family", "Arial")
                    .css("font-size", (settings["height"] * 2) + "px")
                    .css("position", "absolute")
                    .css("top", "-14px")
                    .css("right", "0px")
                    .css("color", settings["label"]))
                .append($("<div>")
                    .attr("id", "hurry-bar")
                    .css("background", settings["normal"])
                    .css("width", "0px")
                    .css("height", settings["height"] + "px"));
            settings["start"] = Date.now();
            setInterval(update, 1000);
        }
    }

    function loadNotes() {
        var notes = $("#speakernotes").text();
        if (!notes) return;
        const pageNumber = parseInt($(".punch-filmstrip-selected-thumbnail-pagenumber").text());
        if (pageNumber != 1) return;
        const assignments = notes.split("#");
        for (const key in settings) {
            localStorage.removeItem("hurry-" + docId + "-" + key);
        }
        for (const assignment of assignments) {
            const parts = assignment.split("=");
            const name = parts[0];
            if (!name) continue;
            const value = isNaN(parseInt(parts[1])) ? parts[1] : parseInt(parts[1]);
            if (settings[name]) {
                localStorage.setItem("hurry-" + docId + "-" + name, value);
            }
        }
    }

    var timer = setTimeout(run, 1);
    document.body.addEventListener('DOMSubtreeModified', function() {
        clearTimeout(timer);
        timer = setTimeout(run, 1);
    });
})();
