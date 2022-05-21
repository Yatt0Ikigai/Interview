import React from 'react';
import {useState} from "react";

function TravelingInfo({distance, path}) {
    const [fuelConst, setFuelCost] = useState(1);

    return (
        <div className={"absolute top-5 right-10 h-max w-40 bg-opacity-70 bg-white border border-black flex"}>
            <ul className={"flex flex-col"}>
                <li className={"flex flex-col"}>
                    <p className={"self-center"}>Fuel Cost:</p>
                    <input
                        value={fuelConst}
                        onChange={event => {
                            var result = event.target.value.replace(/[^0-9.,]/g, '');
                            result = result.replace(/,/g, ".")
                            if (result.split(".").length <= 2) setFuelCost(result);
                        }}
                        className={"bg-transparent w-full text-center"}/>
                </li>
                <li>
                    <p>Distance: {Math.round(distance * 100) / 100}</p>
                </li>
                <li>
                    <p>Days: {Math.ceil(distance / 800)}</p>
                </li>
                <li>
                    Cost: {Math.round(1.1 * distance * fuelConst + Math.ceil(distance / 800) * 1000)}
                </li>
            </ul>
        </div>)
}

export default TravelingInfo;
