const $ = document.querySelector.bind(document);

const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER';

const player = $('.player');

const cd = $('.CD');

const heading = $('header h2');

const cdThumb = $('.CD-thumbs');

const audio = $('#audio');

const playBtn = $('.btn-toggle-play');

const progress = $('#progress');

const nextBtn = $('.btn-next');

const prevBtn = $('.btn-prev');

const randomBtn = $('.btn-random');

const repeatBtn = $('.btn-repeat');

const playlist = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

    songs: [
        {
            name: 'Thì Thôi',
            singer: 'TVk, Nal, 93NEW-G',
            path: './assets/music/Thì Thôi.mp3',
            image: './assets/image/Thì Thôi.jpg'
        },

        {
            name: 'Người Lạ Thoáng Qua',
            singer: 'Đinh Tùng Huy, ACV',
            path: './assets/music/Người Lạ Thoáng Qua.mp3',
            image: './assets/image/Người Lạ Thoáng Qua.jpg'
        },

        {
            name: 'Tương Tư Thành Họa',
            singer: 'Trịnh Diệc Thần',
            path: './assets/music/Tương Tư Thành Họa.mp3',
            image: './assets/image/Tương Tư Thành Họa.jpg'
        },

        {
            name: 'Sick Enough To Die',
            singer: 'MC Mong, Jamie',
            path: './assets/music/Sick Enough To Die.mp3',
            image: './assets/image/Sick Enough To Die.jpg'
        },

        {
            name: 'One Thing',
            singer: 'One Direction',
            path: './assets/music/One Thing.mp3',
            image: './assets/image/One Thing.jpg'
        },

        {
            name: 'Là Ai Từ Bỏ, Là Ai Vô Tình',
            singer: 'Hương Ly, Jombie',
            path: './assets/music/Là Ai Từ Bỏ, Là Ai Vô Tình.mp3',
            image: './assets/image/Là Ai Từ Bỏ, Là Ai Vô Tình.jpg'
        },

        {
            name: 'Đây Là Việt Nam',
            singer: 'Rhymastic, Blacka',
            path: './assets/music/Đây Là Việt Nam.mp3',
            image: './assets/image/Đây Là Việt Nam.jpg'
        },

        {
            name: 'Hige Driver',
            singer: 'Uesaka Sumire',
            path: './assets/music/Hige Driver.mp3',
            image: './assets/image/Hige Driver.jpg'
        },

        {
            name: 'Pledge Of Liberation',
            singer: 'Ishikawa Yui',
            path: './assets/music/Pledge Of Liberation.mp3',
            image: './assets/image/Pledge Of Liberation.jpg'
        },

        {
            name: 'Justice',
            singer: 'Hiroyuki Takami',
            path: './assets/music/Justice.mp3',
            image: './assets/image/Justice.jpg'
        }
    ],

    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
            <div class="thumb"
                style="background-image: url('${song.image}');">
            </div>
                
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },

    handleEvents: function () {
        const _this = this;

        const cdWidth = cd.offsetWidth;

        // Handle when CD rotate / stop

        const cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ],
            {
                duration: 10000,
                iterations: Infinity
            })

        cdThumbAnimate.pause();

        // Handle when zoom in / out CD

        document.onscroll = function () {
            const scrollTop = document.documentElement.scrollTop;

            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;

            cd.style.opacity = newCdWidth / cdWidth;
        }

        // Handle when click play

        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        // Handle when song play

        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        // Handle when song pause

        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // Handle when song duration change

        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        // Handle when rewind song

        progress.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        // Handle when click next song

        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            }
            else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // Handle when click previous song

        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            }
            else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
        }

        // Handle when click on / off random song
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        // Handle when repeat song
        repeatBtn.onclick = function (e) {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        // Handle next song when audio ended
        audio.onended = function () {
            if (isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        // Listen behavior click playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)');

            if (songNode || e.target.closest('.option')) {
                // Handle when click song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

                // Handle when click option
                if (e.target.closest('.option')) {

                }
            }
        }

    },

    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        }, 300);

    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;

        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;

        audio.src = this.currentSong.path;
    },

    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }

        this.loadCurrentSong();
    },

    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }

        this.loadCurrentSong();
    },

    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    start: function () {
        // Assign configuration from config to app
        this.loadConfig();

        // Define properties for the object
        this.defineProperties();

        // Listen/handle events (DOM Event)
        this.handleEvents();

        // Load the first song info into the UI when running the app
        this.loadCurrentSong();

        // Render playlist
        this.render();

        // Display original status of btn repeat & random
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    }
}

app.start();
