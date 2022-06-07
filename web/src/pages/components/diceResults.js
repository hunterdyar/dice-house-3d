import React from "react";

const DiceResults = ({results}) => {
    return results.map((result, index) => {
        return <div key={`${result}-${index}`}>{result}</div>
    });
}
export default DiceResults;