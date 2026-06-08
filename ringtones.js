document.addEventListener("DOMContentLoaded", () => {
    const audioPlayer = document.getElementById("global-audio");
    const cards = document.querySelectorAll(".ringtone-card");

    cards.forEach(card => {
        const playBtn = card.querySelector(".btn-play");
        const playIcon = playBtn ? playBtn.querySelector("i") : null;
        const audioSrc = card.getAttribute("data-src");
        const downloadBtn = card.querySelector(".btn-download");

        if (downloadBtn) {
            downloadBtn.href = audioSrc;
        }

        if (playBtn) {
            playBtn.addEventListener("click", () => {
                if (card.classList.contains("playing")) {
                    audioPlayer.pause();
                    resetAllButtons();
                } else {
                    resetAllButtons();
                    audioPlayer.src = audioSrc;
                    audioPlayer.play().catch(err => console.log("خطأ في التشغيل:", err));
                    card.classList.add("playing");
                    if (playIcon) {
                        playIcon.classList.remove("fa-play");
                        playIcon.classList.add("fa-pause");
                    }
                }
            });
        }
    });

    if (audioPlayer) {
        audioPlayer.addEventListener("ended", resetAllButtons);
    }

    function resetAllButtons() {
        cards.forEach(c => {
            c.classList.remove("playing");
            const icon = c.querySelector(".btn-play i");
            if (icon) {
                icon.classList.remove("fa-pause");
                icon.classList.add("fa-play");
            }
        });
    }
});
