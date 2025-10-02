async function processClipboard() {
    try {
        const rawText = await navigator.clipboard.readText();

        // Replace literal '\n' (as a string) with actual newlines
        const cleanedText = rawText.replace(/\\n/g, "\n");

        // Split into lines
        const lines = cleanedText.split("\n");

        const filtered = lines
            .filter((line) => line.includes("%"))
            .map((line) => {
                const match = line.match(/([\d.]+)%\s+(\d+)\s+(.*)/);
                if (match) {
                    return {
                        percent: parseFloat(match[1]),
                        count: parseInt(match[2]),
                        block: match[3].trim(),
                    };
                }
                return null;
            })
            .filter(Boolean)
            .sort((a, b) => {
                // First, sort by count (highest to lowest)
                if (b.count !== a.count) {
                    return b.count - a.count;
                }
                // If counts are equal, sort by block name (A-Z)
                return a.block.localeCompare(b.block);
            });

        const tbody = document.getElementById("tableBody");
        const table = document.getElementById("resultTable");
        tbody.innerHTML = ""; // Clear previous content

        for (const entry of filtered) {
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${entry.block}</td>
            <td>${entry.count}</td>
            <td>${entry.percent.toFixed(3)}%</td>
          `;
            tbody.appendChild(row);
        }

        table.style.display = "table";
    } catch (err) {
        alert("Failed to read clipboard: " + err);
    }
}