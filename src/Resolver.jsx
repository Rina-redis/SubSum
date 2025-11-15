import { useState } from "react";

function Resolver() {
    const [text, setText] = useState("");
    const [floats, setFloats] = useState([]);

    const [single, setSingle] = useState("");  // ONE float number
    const [singleFloat, setSingleFloat] = useState(null);

    const [results, setPossibleComponents] = useState([]);


    function parseNumbers() {
        const parsed = text.split(/\r?\n/).map(line => line.trim()).filter(line => line != "").map(line => parseFloat(line.replace(",", ".")));

        setFloats(parsed);
    }

    function parseSingle() {
        const num = parseFloat(single.replace(",", "."));
        if (!Number.isNaN(num)) {
            setSingleFloat(num);
        } else {
            setSingleFloat(null);
        }
    }

    function getPossibleComponents() {
        const nums = floats.filter((n) => n <= singleFloat).slice().sort((a, b) => b - a);
        const results = [];

        function helper(difference, index, current) {

            if (Math.abs(difference) < 0.0001) {
                results.push([...current]);   
                return;                      
            }

            if (difference < 0) return;


            for (let i = index; i < nums.length; i++) {

                const element = nums[i];
                const newDiff = difference - element;

                if (newDiff < 0)
                    continue;

                current.push(element);
                helper(newDiff, i + 1, current);
                current.pop();
            }
        }

        helper(singleFloat, 0, []);
        setPossibleComponents(results);
        console.log(JSON.stringify(results, null, 2))
    }



    return (
        <>
            <h1>Test</h1>

            {/* Multiline input */}
            <h2>Multiline numbers</h2>
            <textarea
                rows={6}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={`Type numbers like:
                            34,5
                            34,6
                            37,7`}
            />

            <button onClick={parseNumbers}>Parse multiline</button>
            <button onClick={getPossibleComponents}>Sort</button>

            <pre>{JSON.stringify(floats, null, 2)}</pre>
            <pre>{JSON.stringify(results, null, 2)}</pre>

            <hr />


            <h2>Single number</h2>
            <input
                type="text"
                value={single}
                onChange={(e) => setSingle(e.target.value)}
                placeholder="Type one float like 34,5"
            />

            <button onClick={parseSingle}>Parse single</button>


            <p>Parsed single float: {singleFloat !== null ? singleFloat : "Invalid"}</p>
        </>
    );
}

export default Resolver