// Hide history on click function
const history = document.querySelector(".history")
const H = history.querySelector("h2")
H.addEventListener("click", () => history.querySelector(".details").classList.toggle("noDisplay"))

// Request for country data from an API
const REST = "https://restcountries.eu/rest/v2/name/"
const getData = async (country) => {
    try {
        const result = await fetch(`${REST}${country}`)
        const data = await result.json()
        return data[0]
    } catch(error) {
       alert(error) 
    }
}

// create empty history Array
let historyArr = []

// function to update history array
const updateHistory = (country) => {
    historyArr.unshift(country.toLowerCase())
    historyArr = [...new Set(historyArr)]    
    showHistory()
}

// function to display history 
const showHistory = () => {
    const element = document.querySelector(".details")
    element.innerHTML = ""

    historyArr.forEach(cur => {
        newEl = document.createElement("div")
        newEl.innerHTML = 
        `${cur}<svg onclick=delHistory("${cur.split(" ").join("")}") class="del" xmlns="http://www.w3.org/2000/svg" width="14.451" height="14.451" viewBox="0 0 14.451 14.451"><g class="Group_11" data-name="Group 11" transform="translate(-816.774 -375.774)"><path id="Path_2" data-name="Path 2" d="M0,0,11.623,11.623" transform="translate(818.189 377.189)" fill="none" stroke="red" stroke-linecap="round" stroke-width="2"/><path id="Path_3" data-name="Path 3" d="M11.623,0,0,11.623" transform="translate(818.189 377.189)" fill="none" stroke="red" stroke-linecap="round" stroke-width="2"/></g></svg>`
        element.appendChild(newEl)
    })
} 

// Render selected history when click
const historyEl = document.querySelector(".details")
historyEl.addEventListener("click", (e) => {
    if (e.target.localName === "div") {
        const country = e.target.textContent
        displayLoading()
        ultimateGetData(country)
    }
})

// function to delete history
const delHistory = id => {
    let newArr =  historyArr.filter(cur => cur.split(" ").join("") !== id)
    historyArr = newArr
    showHistory()
}


// function to render result on the page
const inputDOM = document.querySelector(".search").querySelector("input")
const render = () => {
    const input = inputDOM.value
    document.querySelector(".main").classList.add("noDisplay")

    if(input.toLowerCase().trim() !== "") {
        displayLoading()
        ultimateGetData(input)
    } else {
        alert("input country name")
    }
    inputDOM.value = ""
}


const loading = document.querySelector(".loading")
const picture = document.querySelector(".picture")
const container = document.querySelector(".image")

// get basic data about country and pictures
const ultimateGetData = (country) => {
    getData(country)
    .then(result => {
        loading.classList.add("noDisplay")      

        if (result === undefined) {
            message = "No result found"
            const element = document.querySelector(".error")
            element.textContent = message
            element.classList.remove("noDisplay")
        } else {
            result ? updateHistory(country) : null
            display(result)
            getPhotos(country)
            .then(result => {
                displayPhotos(result.results)
            })
        } 
    })
}

// function to display loading
const displayLoading = () => {
    loading.classList.remove("noDisplay")

    const element = document.querySelector(".error")
    element.classList.add("noDisplay")
    picture.classList.add("noDisplay")
}

// function to display data after result is gotten
const display = (data) => {
    const main = document.querySelector(".main")
    main.querySelector("h1").textContent = data.name
    main.querySelector(".flag").src = data.flag
    // main.querySelector(".short__note").textContent = 
    document.getElementById("capital").textContent = data.capital
    // document.getElementById("president").textContent = 
    document.getElementById("population").textContent = data.population
    document.getElementById("call").textContent = data.callingCodes[0]
    document.getElementById("language").textContent = disLanguage(data.languages)
    document.getElementById("time").textContent = data.timezones[0]
    document.getElementById("continent").textContent = data.region
    document.getElementById("currency").textContent = disCurrency(data.currencies)
    
    main.classList.remove("noDisplay")
}

// function to display currency
const disCurrency = obj => `${obj[0].name} (${obj[0].symbol})`
// function to display language
const disLanguage = (arr) => {
    let str
    arr.forEach(cur => str ? str = `${str}, ${cur.name}` : str = `${cur.name}`)
    return str
}

// function to get photos data
const getPhotos = async (country) => {
    const id = "AyKu9MWP4KRrsYBDn1q96I96mHyKG0m0F9O_fKoBonc"
    const url = `https://api.unsplash.com/search/photos?query=${country}&client_id=${id}`

    const result = await fetch(url)
    const data = await result.json()
    return data
}

// function to display photos on the page
const displayPhotos = (data) => {
    container.innerHTML = ""
    picture.classList.remove("noDisplay")
    data.forEach(cur => {
        const figure = document.createElement("figure")
        figure.innerHTML = `<img src="${cur.urls.regular}" alt="${cur.alt_description}">`

        container.appendChild(figure)
    })
}

// add event listener to search button and enter key
const button = document.querySelector(".search").querySelector("button")
button.addEventListener("click", render)
inputDOM.addEventListener("keydown", (e) => e.key === "Enter" ? render() : null)

