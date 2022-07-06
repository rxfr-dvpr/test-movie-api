



months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

// menu burger

const searchLink = document.querySelector('.search__link .icon-reg'),
    mainContent = document.querySelector('.main__content'),
    mainClose = document.querySelectorAll('.main__close'),
    mainBlock = document.querySelector('.main__block'),
    mainSolo = document.querySelector('.main__solo'),
    moviesLink = document.querySelectorAll('.movies__link'),
    formMain = document.querySelector('.form__main'),
    formInput = document.querySelector('.input'),
    anime = document.querySelector('.anime'),
    pagination = document.querySelector('.pagination'),
    headerBtn = document.querySelector('.header__btn'),
    headerAbs = document.querySelector('.header__abs'),
    headerItems = document.querySelector('.header__items');
    
headerBtn.addEventListener('click', function (e) {
    e.preventDefault()
    this.classList.toggle('active')
    headerItems.classList.toggle('active')
    headerAbs.classList.toggle('active')
    body.classList.toggle('active')
})
    
// menu burger

const host = "https://kinopoiskapiunofficial.tech",
    hostName = "X-API-KEY",
    hostValue = "99e4d2e2-3695-4c92-a624-c6d9d2f0066c"

class Kino {
    constructor() {
        this.data = new Date().getMonth()
        this.curYear = new Date().getFullYear()
        this.months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
        // console.log(this.months[this.data]);
        this.curMonth = this.months[this.data]
    }
    fOpen = async (url) => {
        let response = await fetch(url, {
            headers: {
                [hostName]: hostValue,
            }
        })
        if (response.ok) return response.json()
        else throw new Error(`Cannot access to ${url}`)
    }
    getTopMovies = (page = 1) => this.fOpen(`${host}/api/v2.2/films/top?type=TOP_250_BEST_FILMS&page=${page}`)
    getSoloFilm = (id) => this.fOpen(`${host}/api/v2.1/films/${id}`)
    getMostAwaited = (page = 1, year = this.curYear, month = this.curMonth) => this.fOpen(`${host}/api/v2.1/films/releases?year=${year}&month=${month}&page=${page}`)
    getFrames = (id) => this.fOpen(`${host}/api/v2.2/films/${id}/images?type=STILL&page=1`)
    getReviews = (id) => this.fOpen(`${host}/api/v2.2/films/${id}/reviews?page=1&order=DATE_DESC`)
    getSearch = (page = 1, keyword) => this.fOpen(`${host}/api/v2.1/films/search-by-keyword?keyword=${keyword}&page=${page}`)
}

const kino = new Kino()

// kino.getTopMovies().then(res => {
//     console.log(res);
// })

// kino.getSoloFilm(5273).then(res => {
//     console.log(res);
// })

// kino.getMostAwaited().then(res => {
//     console.log(res);
// })

// kino.getFrames(5273).then(res => {
//     console.log(res);
// })

// kino.getReviews(5273).then(res => {
//     console.log(res);
// })

// kino.getSearch(1, "Shrek").then(res => {
//     console.log(res);
// })

function randMovies(num) {
    return Math.floor(Math.random() * num + 1)
}

// render Trend Movies

function renderTrendMovies(elem = [], fn = [], films = [], params = []) {
    anime.classList.add('active')
    elem.forEach((item, i) => {
        let parent = document.querySelector(`${item} .swiper-wrapper`)
        kino[fn[i]](params[i]).then(data => {
            // console.log(data[films[i]]);
            data[films[i]].forEach(el => {
                let slide = document.createElement('div')
                slide.classList.add('swiper-slide')
                slide.innerHTML = `
                    <div class="movie__item" data-id="${el.filmId}">
                        <img src="${el.posterUrlPreview}" alt="${el.nameRu || el.nameEn}" loading="lazy">
                    </div>
                `
                parent.append(slide)
            });
            anime.classList.remove('active')
        })
        .then(() => {
            elem.forEach(item => {
                new Swiper(`${item}`, {
                    slidesPerView: 1,
                    spaceBetween: 27,
                    // slidesPerGroup: 3,
                    // loop: true,
                    // loopFillGroupWithBlank: true,
                    navigation: {
                        nextEl: `${item} .swiper-button-next`,
                        prevEl: `${item} .swiper-button-prev`,
                    },
                    breakpoints: {
                        1440: {
                            slidesPerView: 6,
                        },
                        1200: {
                            slidesPerView: 5,
                        },
                        960: {
                            slidesPerView: 4,
                        },
                        720: {
                            slidesPerView: 3,
                        },
                        500: {
                            slidesPerView: 2,
                        },
                    }
                });      
            })
        })
        .catch(e => {
            anime.classList.remove('active')
            console.error(e);
        })
    });
}

renderTrendMovies([".trend__tv-slider", ".popular__actors-slider"], ["getTopMovies", "getMostAwaited"], ["films", "releases"], [1, 1])

// render Trend Movies

// render Header movies

function renderHeader(page) {
    kino.getTopMovies(page).then(data => {
        anime.classList.remove('active')
        let max = randMovies(data.films.length)
        let filmId = data.films[max].filmId
        let filmRating = data.films[max].rating
        
        kino.getSoloFilm(filmId).then(response => {
            // console.log(response);
            let info = response.data
            let headerText = document.querySelector('.header__text')
            let url = info.webUrl.split("www.").join("gg")
            headerText.innerHTML = `
                <h1 class="header__title">${info.nameRu || info.nameEn}</h1>
                <div class="header__balls">
                    <span class="header__year">${info.year}</span>
                    <span class="logo__span header__rating  header__year">${info.ratingAgeLimits}+</span>
                    <div class="header__seasons header__year">${info.seasons.length != 0 ? info.seasons[0] : "0+"}</div>
                    <div class="header__stars header__year"><span class="icon-solid"></span><strong>${filmRating}</strong></div>
                </div>
                <p class="header__descr">
                    ${info.description}
                </p>
                <div class="header__buttons">
                    <a href="${url}" target="_blank" class="header__watch"><span class="icon-solid"></span>watch</a>
                    <a href="#" class="header__more header__watch movie__item">More information</a>
                </div>
            
            ` 
            anime.classList.remove('active')
        })
        .then(datas => {
            let headerMore = document.querySelector('.header__more')
            headerMore.addEventListener('click', function () {
                renderSolo(5273)
                mainContent.classList.add('active')
            })
        })
        .catch(e => {
            console.error(e);
            anime.classList.remove('active')
        })
    })
}

let page = 13
let rand = randMovies(13)
renderHeader(rand)

// render Header movies


// current data

const popularTitle = document.querySelector('.popular__actors-title strong'),
    popularPoster = document.querySelector('.coming__soon-block > img'),
    popularYear = document.querySelector('.year')

popularTitle.innerHTML = `${kino.curMonth} ${kino.curYear}` 
popularYear.innerHTML = `${kino.curYear}`

// current data


// posterUrlPreview

kino.getTopMovies(rand).then(data => {
    let dataLength = data.films.length
    popularPoster.setAttribute('src', data.films[randMovies(dataLength)].posterUrlPreview)
})

// posterUrlPreview

// render solo

async function renderSolo(id) {
   mainBlock.innerHTML = "";
   pagination.innerHTML = "";
   anime.classList.add('active');
   
    (async function () {
       const [reviews, frames, solo] = await Promise.all([
        kino.getReviews(id),
        kino.getFrames(id),
        kino.getSoloFilm(id)
       ])  
       return {reviews, frames, solo};
    }())
    .then(res => {
        console.log(res);
        let solo = res.solo.data
        let genres = solo.genres.reduce((acc, item) => acc + `${item.genre}, `, '')
        // console.log(genres);
        let country = solo.countries.reduce((acc, item) => acc + `${item.country} `, '')
        // console.log(country);
        let facts = ""
        let frames = ""
        let reviews = ""
        
        if (solo.facts.length) {
            solo.facts.forEach((item, i) => {
                if (i < 10) facts += `<li class="solo__facts">${i + 1}: ${item}</li>`
            });
        } else { facts += `<li class="solo__facts">Facts not found</li>`}
        
        if (res.frames.items.length) {
            res.frames.items.forEach((item, i) => {
                if (i < 10) frames += `<img src="${item.previewUrl}" alt="" loading="lazy">`
            });
        } else { frames += `Images not found`}
        
        if (res.reviews.items.length) {
            res.reviews.items.forEach((item, i) => {
                if (i < 10) {
                    reviews += `
                        <div class="review__item">
                            <span>${item.author}</span>
                            <p class="review__descr">${item.description}</p>
                        </div>
                    
                    `
                }
            });
        } else {reviews += "Reviews is not found"}
        
        let div = `
        <ul class="solo__facts">
            <h3 class="trend__tv-title">Интересные факты</h3>
            ${facts}
        </ul>
        
        <h3 class="trend__tv-title solo__title2">Кадры из фильма</h3>
        
        <div class="solo__images">${frames}</div>
    
        <div class="solo__reviews">
            <h3 class="trend__tv-title solo__title2">Отзывы</h3>
            ${reviews}
        </div>
        `
        
        mainSolo.innerHTML = div
        anime.classList.remove('active')
    })
    .catch(e => {
        console.log(e);
        anime.classList.remove('active')
    })
};

// render solo