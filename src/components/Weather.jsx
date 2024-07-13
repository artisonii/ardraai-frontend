import React, { useEffect, useRef, useState } from 'react'
import { CiSearch } from "react-icons/ci";
import axios from "axios"
import { WiSunrise } from "react-icons/wi";
import { TiThMenu } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";

const cities = ["Delhi", "Bengaluru", "Lucknow", "Bhopal", "Jaipur"]
const appId = "2bed4a01f425570dcaeaefd450d39bef"
const weatherApi = "https://api.openweathermap.org/data/2.5/weather";

const Weather = () => {
    const [city, setCity] = useState(cities[0])
    const [weather, setWeather] = useState({})
    const [inputCity, setInputCity] = useState("")
    const [weatherSet, setWeatherSet] = useState("")
    const [weatherArr, setWeatherArr] = useState([])
    const [found, setFound] = useState(false)
    const [popUpOpen, SetPopUpOpen] = useState(false)
    const popupRef = useRef(null);
    const [hourlyData, setHourlyData] = useState([])
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const fetchData = async (url) => {
        try {
            const data = await axios.get(url);
            if (inputCity) {
                setWeatherSet(data.data)
                SetPopUpOpen(true)
                setFound(true)
            } else {
                setWeather(data.data)
                setWeatherArr(data.data.weather[0])
            }

            console.log(data.data)
        } catch (error) {
            if (inputCity) {
                SetPopUpOpen(true)
                setFound(false)
            }
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData(weatherApi + "?q=" + city + "&units=metric&appid=" + appId)
    }, [city])

    useEffect(() => {
        let timeout;
        if (inputCity == "") {
            clearTimeout(timeout)
            SetPopUpOpen(false)
        }
        if (inputCity & timeout) {
            clearTimeout(timeout)

        } else if (inputCity) {
            timeout = setTimeout(() => {
                setCity(inputCity)
            }, 1000)
        }

        return () => clearTimeout(timeout)
    }, [inputCity])

    var date1 = new Date(weather.dt * 1000);
    let day = date1.toLocaleString('en-IN', { weekday: 'short' })
    var month = date1.toLocaleString('en-IN', { month: 'short' });
    var day1 = date1.getDate();
    var year = date1.getFullYear();
    var hours = date1.getHours();
    var minutes = date1.getMinutes();
    let date = `${month} ${day1} ${year}`
    let time = date1.toTimeString().substring(0, 5)
    let sunset1 = new Date(weather?.sys?.sunset * 1000)
    let sunset = sunset1.toTimeString().substring(0, 5)
    let sunrise1 = new Date(weather?.sys?.sunrise * 1000)
    let sunrise = sunrise1.toTimeString().substring(0, 5)
    const handleSearch = () => {
        setWeather(weatherSet)
        SetPopUpOpen(false)
        setInputCity("")
        setWeatherArr(weatherSet?.weather[0])
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setInputCity("")
                SetPopUpOpen(false)
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggle = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div className="w-full min-h-screen text-center bg-gradient-to-b from-blue-400 to-blue-700 font-roboto">
            <div className="max-w-screen-xl p-2 mx-auto">
                <div className="justify-evenly mb-2 text-white cursor-pointer py-4 text-2xl 
                hidden
                sm:flex">
                    {cities.map((ele) => {
                        return <p onClick={() => setCity(ele)} className={city === ele ? "text-blue-800" : ""}>{ele} </p>
                    })}
                </div>

                <div className='fixed p-2 left-0 right-0 top-0 z-10 sm:hidden'>
                    {
                        isMenuOpen ? <RxCross2 color='white' size="25px" onClick={() => setIsMenuOpen(false)} /> : <TiThMenu color='white' size="25px" onClick={() => setIsMenuOpen(true)} />
                    }
                </div>

                <div>
                    {isMenuOpen && <div className="text-white cursor-pointer text-2xl bg-blue-600 py-2 fixed top-10 z-20 left-0 right-0 sm:hidden">
                        {cities.map((ele) => {
                            return <p onClick={() => setCity(ele)} className={city === ele ? "text-blue-800" : ""}>{ele} </p>
                        })}
                    </div>}
                </div>

                <div className="relative w-3/5 sm:w-3/5 max-w-md mx-auto mb-0 pt-10 sm:pt-0">
                    <div className="flex justify-center gap-2 p-5 bg-white rounded-2xl mb-0">
                        <input type="text" placeholder="Search for city..." value={inputCity} onChange={(e) => { setInputCity(e.target.value) }} className="w-4/5 border-none outline-none" />
                        <CiSearch color="blue" size={"25px"} />
                    </div>
                    {popUpOpen ? (
                        <div className="absolute w-full bg-white mt-1 cursor-pointer hover:bg-gray-300 bp" ref={popupRef}>
                            <p onClick={handleSearch} className="m-0 text-left p-2">{found ? `${weatherSet?.name}, ${weatherSet?.sys?.country}` : "Not Found.."}</p>
                        </div>
                    ) : ""}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5" >
                    <div className='flex items-center'>
                        <div className='h-fit w-full'>
                            <div className="text-white">
                                <h1 className="text-4xl font-bold" >{weather?.name}, {weather?.sys?.country}</h1>
                            </div>
                            <div className="flex justify-evenly items-center text-white">
                                <div className='w-5/12'>
                                    <img src={`https://openweathermap.org/img/wn/${weatherArr?.icon}@2x.png`} alt="" className='w-full' />
                                </div>
                                <div>
                                    <div className="text-4xl font-light">
                                        <p>{Math.round(weather?.main?.temp)} ℃</p>
                                    </div>
                                    <p className='text-2xl'>{weatherArr?.main}</p>
                                </div>
                            </div>
                            <div className="text-white text-2xl" >
                                <p>{`${day}, ${date} | ${time}`}</p>
                            </div>
                        </div>

                    </div>

                    <div className="flex flex-col gap-3 max-w-sm mx-auto p-2 justify-evenly w-full">
                        <div className="bg-blue-800 text-white p-2 rounded flex justify-between"><span>Humidity</span><span>{weather?.main?.humidity} %</span></div>
                        <div className="bg-blue-800 text-white p-2 rounded flex justify-between"><span>Feels Like</span><span>{Math.round(weather?.main?.feels_like)} ℃</span></div>
                        <div className="bg-blue-800 text-white p-2 rounded flex justify-between"><span>Wind</span><span>{weather?.wind?.speed} km/h</span></div>
                        <div className="bg-blue-800 text-white p-2 rounded flex justify-between"><span>Sunrise</span><span>{sunrise}</span></div>
                        <div className="bg-blue-800 text-white p-2 rounded flex justify-between"><span>Sunset</span><span>{sunset}</span></div>
                        <div className="bg-blue-800 text-white p-2 rounded flex justify-between"><span>High</span><span>{weather?.main?.temp_max} ℃</span></div>
                        <div className="bg-blue-800 text-white p-2 rounded flex justify-between"><span>Low</span><span>{weather?.main?.temp_min} ℃</span></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Weather;
