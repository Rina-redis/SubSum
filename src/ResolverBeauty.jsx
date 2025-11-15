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
    // Всегда парсим актуальные значения из инпутов
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
    // console.log(JSON.stringify(combos, null, 2));
  }

  // Для кнопки достаточно, чтобы поля не были пустыми
  const canResolve = text.trim() !== "" && single.trim() !== "";

  return (
    <div className="min-h-screen w-screen bg-slate-900 text-slate-100 flex items-center justify-center">
      {/* Центрированный контейнер ограниченной ширины */}
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
        <div className="bg-slate-800 rounded-2xl shadow-xl p-6 md:p-8 space-y-8 flex flex-col">
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-center md:text-left">
              <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight">
                Float Resolver
              </h1>
              <p className="text-sm text-slate-400">
                Enter a list of numbers and a target value to find possible combinations.
              </p>
              <p className="mt-3 px-4 py-1.5 inline-block rounded-md bg-red-950 text-red-100 text-sm font-semibold">
                Если нет запятой, ничё работать НЕ БУДЕТ!!!
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

          {/* Основная часть */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Multiline input */}
            <div className="bg-slate-900/40 border border-slate-700 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-medium">Multiline numbers</h2>
              </div>

              <textarea
                rows={6}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500 resize-none"
                placeholder={`Type numbers, one per line, e.g.:
34,5
34,6
37,7`}
              />

              <div>
                <p className="text-xs font-semibold text-slate-400 mb-1">
                  Parsed numbers:
                </p>
                <pre className="text-xs bg-slate-900/70 border border-slate-700 rounded-lg px-3 py-2 overflow-x-auto">
                  {floats.length > 0 ? JSON.stringify(floats) : "No numbers parsed yet."}
                </pre>
              </div>
            </div>

            {/* Single input */}
            <div className="bg-slate-900/40 border border-slate-700 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-medium">Single number</h2>
              </div>

              <input
                type="text"
                value={single}
                onChange={(e) => setSingle(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500"
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

          {/* Results */}
          <section className="bg-slate-900/40 border border-slate-700 rounded-xl p-4 space-y-4">
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
              <div className="max-h-[50vh] overflow-y-auto space-y-2">
                {results.map((combo, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm bg-slate-900 border border-slate-700 rounded-lg px-3 py-2"
                  >
                    <span className="text-xs text-slate-400">#{index + 1}</span>
                    <span className="font-mono text-slate-100">{combo.join(" + ")}</span>
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
