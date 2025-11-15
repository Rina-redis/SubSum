import { useState } from "react";

function Resolver() {
  const [text, setText] = useState("");
  const [floats, setFloats] = useState([]);

  const [single, setSingle] = useState(""); // ONE float number
  const [singleFloat, setSingleFloat] = useState(null);

  const [results, setPossibleComponents] = useState([]);

  function parseNumbers() {
    const parsed = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line !== "")
      .map((line) => parseFloat(line.replace(",", ".")))
      .filter((n) => !Number.isNaN(n));

    setFloats(parsed);
    return parsed;
  }

  function parseSingle() {
    const num = parseFloat(single.replace(",", "."));
    if (!Number.isNaN(num)) {
      setSingleFloat(num);
      return num;
    } else {
      setSingleFloat(null);
      return null;
    }
  }

  function getPossibleComponents() {
    const parsedFloats = parseNumbers();
    const parsedSingle = parseSingle();

    if (parsedSingle == null || parsedFloats.length === 0) return;

    const nums = parsedFloats
      .filter((n) => n <= parsedSingle)
      .slice()
      .sort((a, b) => b - a);

    const combos = [];

    function helper(difference, index, current) {
      if (Math.abs(difference) < 0.0001) {
        combos.push([...current]);
        return;
      }
      if (difference < 0) return;

      for (let i = index; i < nums.length; i++) {
        const element = nums[i];
        const newDiff = difference - element;

        if (newDiff < 0) continue;

        current.push(element);
        helper(newDiff, i + 1, current);
        current.pop();
      }
    }

    helper(parsedSingle, 0, []);
    setPossibleComponents(combos);
  }

  const canResolve = text.trim() !== "" && single.trim() !== "";

  return (
    <div className="h-max-9/12 w-full bg-slate-900 text-slate-100 flex">
      {/* Почти фуллскрин: 96vw x 94dvh. Не шире 2xl, но если экран меньше — подстроится. */}
      <div className="w-[96vw] max-w-screen-2xl h-[94dvh] p-3 sm:p-5">
        {/* Карточка занимает всю доступную высоту и ширину, без выхода за экран */}
        <div className="h-full w-full bg-slate-800 rounded-2xl shadow-xl p-5 sm:p-8 flex flex-col overflow-hidden">
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-center md:text-left">
              <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight">
                Float Resolver
              </h1>
              <p className="text-sm text-slate-400">
                Enter a list of numbers and a target value to find possible combinations.
              </p>
            
            </div>
            <button
              onClick={getPossibleComponents}
              disabled={!canResolve}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition
                ${
                  canResolve
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                    : "bg-slate-600 text-slate-300 cursor-not-allowed"
                }`}
            >
              Resolve combinations
            </button>
          </header>

          {/* Основной контент — получает доступное место и может сжиматься */}
          <div className="grid gap-6 md:grid-cols-2 mt-6 min-h-0">
            {/* Multiline input */}
            <div className="bg-slate-900/40 border border-slate-700 rounded-xl p-4 space-y-3 min-h-0">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-medium">Multiline numbers</h2>
              </div>

              <textarea
                rows={8}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full max-w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500 resize-y"
                placeholder={`Type numbers, one per line, e.g.:
34,5
34,6
37,7`}
              />

              <div>
                <p className="text-xs font-semibold text-slate-400 mb-1">
                  Parsed numbers:
                </p>
                <pre className="text-xs bg-slate-900/70 border border-slate-700 rounded-lg px-3 py-2 overflow-x-auto break-words whitespace-pre-wrap">
                  {floats.length > 0 ? JSON.stringify(floats) : "No numbers parsed yet."}
                </pre>
              </div>
            </div>

            {/* Single input */}
            <div className="bg-slate-900/40 border border-slate-700 rounded-xl p-4 space-y-4 min-h-0">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-medium">Single number</h2>
              </div>

              <input
                type="text"
                value={single}
                onChange={(e) => setSingle(e.target.value)}
                className="w-full max-w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500"
                placeholder="Type one float like 34,5"
              />

              <p className="text-sm">
                Parsed single float:{" "}
                <span className="font-mono text-emerald-400">
                  {singleFloat !== null ? singleFloat : "Invalid"}
                </span>
              </p>

              <p className="text-xs text-slate-400">
                Tip: use comma or dot, e.g. <span className="font-mono">34,5</span> or{" "}
                <span className="font-mono">34.5</span>.
              </p>
            </div>
          </div>

          {/* Результаты — занимает весь остаток высоты карточки, скроллится внутри */}
          <section className="bg-slate-900/40 border border-slate-700 rounded-xl p-4 space-y-4 mt-6 flex-1 min-h-0 overflow-hidden">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-medium">Results</h2>
              <span className="text-xs text-slate-400">
                {results.length} combination{results.length === 1 ? "" : "s"} found
              </span>
            </div>

            {results.length === 0 ? (
              <p className="text-sm text-slate-400">
                No combinations yet. Fill in the fields and click{" "}
                <span className="font-semibold text-emerald-400">Resolve combinations</span>.
              </p>
            ) : (
              <div className="h-full overflow-y-auto space-y-2 pr-1">
                {results.map((combo, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm bg-slate-900 border border-slate-700 rounded-lg px-3 py-2"
                  >
                    <span className="text-xs text-slate-400">#{index + 1}</span>
                    <span className="font-mono text-slate-100 break-words">
                      {combo.join(" + ")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default Resolver;
