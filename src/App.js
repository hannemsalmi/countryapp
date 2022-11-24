import { useState, useEffect } from 'react'
import axios from 'axios'

const Country = ({ country,showhandler, showcountryinfo, temperature, wind, handlewatherchange } ) => {
  return (
    <li>{country.name.common} <button onClick={(e)=>{e.stopPropagation();showhandler(country.name.common);}}>show</button>
    {(country.name.common === showcountryinfo) && <CountryInfo key={country.name.official} country={country}
    temperature={temperature} wind={wind} handlewatherchange={handlewatherchange}/>}
    </li>
  )
}

const CountryInfo = ({country, temperature, wind, handlewatherchange}) => {

  let languageArray = Object.values(country.languages);

  handlewatherchange(country.capital);
  return (
    <>
    <h1>{country.name.common} </h1>
    <p>capital {country.capital}<br/>
    area {country.area}</p>
    <h2>languages:</h2>
    <ul>{languageArray.map((language) => <li key={language}>{language}</li>)}</ul><br/>
    <img src={country.flags.png} alt="flag of the country"/>
    <h2>Weather in {country.capital}</h2>
    <p>Temperature: {temperature} celsius<br/>Wind: {wind} m/s</p>
    </>
  )
}

const Countries = (props) => {

  if (props.countriestoshow.length > 10) {
    return(
      <p>Too many matches, specify another filter.</p>
    )
  }
  else if (props.countriestoshow.length === 1) {
    return(
      <>
      {props.countriestoshow.map(country => <CountryInfo key={country.name.official} country={country} temperature={props.temperature}
      wind={props.wind} handlewatherchange={props.handlewatherchange} showhandler={props.showhandler}/>
      )}
      </>
    )
  }

else {
  return(
  <ul>
      {props.countriestoshow.map(country => <Country key={country.name.official} country={country} temperature={props.temperature}
      wind={props.wind} handlewatherchange={props.handlewatherchange} showhandler={props.showhandler} 
      showcountryinfo={props.showcountryinfo}/>
      )}
      </ul>
      )
    }
  }

const Filter = (props) => {
return (
<div>
filter shown with <input
value={props.filter}
onChange={props.handle} />
</div>
)
}


const App = () => {
  const [countries, setCountries] = useState([
  ])
  const [newFilter, setNewFilter] = useState('')
  const [showCountryInfo, setShowCountryInfo] = useState('')
  const [temperature, setTemperature] = useState('')
  const [wind, setWind] = useState('')


  useEffect(() => {
    console.log('effect')
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        console.log('promise fulfilled')
        setCountries(response.data)
      })
  }, [])

  const countriesToShow = countries.filter(country => country.name.common.toUpperCase().includes(newFilter.toUpperCase()))

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setNewFilter(event.target.value)
  }

  const handleWeatherChange = (capital) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=283ceebfe4e85c65eff91264b4e0411f&units=metric`;
        axios.get(url)
          .then(res => {
              console.log(res);
              setTemperature(res.data.main.temp);
              setWind(res.data.wind.speed);
        })
      }

   const handleShowCountryInfo = (country) => {
    setShowCountryInfo(country)
  }


  return (
    <div>
      <Filter filter={newFilter} handle={handleFilterChange}/>
      <Countries countriestoshow={countriesToShow} showcountryinfo={showCountryInfo} showhandler={handleShowCountryInfo} handlewatherchange={handleWeatherChange}
      temperature={temperature} wind={wind}/>
    </div>
  )
}

export default App