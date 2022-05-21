import React, {useState} from 'react';
import {IoIosArrowForward} from "react-icons/io";
import {ImLoop2} from "react-icons/im";
import {PlatformContext} from "./PlatformContext";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";

async function geocode({platform, address}) {
    var geocoder = platform.getSearchService(),
        geocodingParameters = {
            q: address,
        };
    const result = await geocoder.geocode(
        geocodingParameters,
    );
    return result
}

function first(array, n=1){
    if(n==1) return array[0]
    return array.filter((_,index) => index < n)
}

function Sidebar(props) {
    const {H, Platform: platform} = React.useContext(PlatformContext);
    const [open, setOpen] = useState(false);
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [searches, setSearches] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const handleOpen = () => {
        setOpen(!open)
    }

    const reversePlaces = () => {
        const helperOrigin = origin;
        setOrigin(destination);
        setDestination(helperOrigin);
    }

    const handleSubmit = async (e) => {
        setLoading(true)
        if(origin === "" || destination === "") {
            alert("Wrong input")
            setLoading(false)
            return
        }
        var error = false;
        const originInfo = await geocode({
            platform: platform,
            address: origin,
        }).then(res => {
            if(Object.keys(res.items).length === 0){
                error = true
                alert("No matching origin")
            }
            else return res.items[0]
        })

        const destinationInfo = await geocode({
            platform: platform,
            address: destination,
        }).then(res => {
            console.log(res)
            if(Object.keys(res.items).length === 0){
                error = true;
                alert("No matching destination");
            }
            else return res.items[0]
        })

        if(!error){

            setSearches(first([{
                origin: originInfo.address.label,
                originGeo: originInfo.position,
                destination: destinationInfo.address.label,
                destinationGeo: destinationInfo.position
            }, ...searches], 10))
            navigate(`/map?originLat=${originInfo.position.lat}&originLng=${originInfo.position.lng}&destinationLat=${destinationInfo.position.lat}&destinationLng=${destinationInfo.position.lng}`)
        }
        setLoading(false)
    }

    return (
        <>
            <div
                style={{
                    "backgroundColor": "#c73e1d",
                    "backgroundImage": "linear-gradient(315deg, #c73e1d 0%, #a23b72 37%, #2e86ab 100%)",
                }}
                className={`flex flex-col h-screen w-96 transform z-50 absolute duration-300 border-r border-black ${open ? "translate-x-0" : "-translate-x-full"}`}>
                <form action="" className={"relative flex flex-col"}>
                <span
                    className={"relative after:absolute after:top-1/2 after:right-0.5 after:translate-y-1/2 after:bg-black after:block "}>
                    <input type="text" placeholder={"Origin"} className={"input"} value={origin} onChange={event => {
                        setOrigin(event.target.value)
                    }}/>
                </span>
                    <span
                        className={"relative after:absolute after:top-1/2 after:right-0.5 after:translate-y-1/2 after:bg-black :after:block"}>
                    <input type="text" placeholder={"Destination"} className={"input"} value={destination}
                           onChange={event => {
                               setDestination(event.target.value)
                           }}/>
                </span>
                </form>
                <div className={"flex flex-row justify-center"}>
                    <button onClick={reversePlaces}>
                        <ImLoop2 className={"icon"}/>
                    </button>

                    <button onClick={handleSubmit}
                            className={"btn m-4"}>
                        SearchRoute
                    </button>
                </div>
                <div className={"flex flex-col items-center relative"}>
                    <p className={"border-b-2 border-white w-max text-white text-xl"}>Previous Searches</p>
                    {searches.map((obj, i) => {
                        return (
                            <Link
                                className={"text-white hover:text-blue-900 duration-300"}
                                onClick={() => {
                                    setSearches(first([{
                                        origin: obj.origin,
                                        originGeo: obj.originGeo,
                                        destination: obj.destination,
                                        destinationGeo: obj.destinationGeo
                                    }, ...searches], 10))
                                    setOrigin(obj.origin)
                                    setDestination(obj.destination)
                                }}
                                key={i}
                                to={{
                                    pathname: "/map",
                                    search: `?originLat=${obj.originGeo.lat}&originLng=${obj.originGeo.lng}&destinationLat=${obj.destinationGeo.lat}&destinationLng=${obj.destinationGeo.lng}`,
                                }}> {obj.origin} <IoIosArrowForward className={"icon"}/> {obj.destination}</Link>
                        )
                    })}

                </div>


                <button onClick={handleOpen} className={"absolute top-1/2 -right-[calc(0%+2rem)]"}>
                    <IoIosArrowForward className={`icon ${open ? "rotate-180" : ""} duration-300`}/>
                </button>
            </div>
            {loading ? <div
                className={"z-10 absolute h-screen w-screen flex flex-col justify-center items-center bg-black bg-opacity-60"}>
                <p className={"animate-pulse text-xl"}>LOADING</p>
                <svg className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                     viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"/>
                    <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"/>
                </svg>
            </div> : ""}
        </>

    );
}

export default Sidebar;