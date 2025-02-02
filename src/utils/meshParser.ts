export function parseMeshData(input: string): number[][] {
  // Split input into lines and remove empty lines
  const lines = input.split('\n').filter(line => line.trim());

  // Extract the grid data (skip header row if present)
  const dataLines = lines.filter(line => {
    const parts = line.trim().split(/\s+/);
    return !isNaN(Number(parts[1])); // Check if second element is a number
  });

  // Parse each line into numbers, skipping the row index
  const grid = dataLines.map(line => {
    const parts = line.trim().split(/\s+/);
    return parts.slice(1).map(Number); // Skip first column (row index)
  });

  // Validate the grid
  if (grid.length === 0) {
    throw new Error('No valid data found');
  }

  const width = grid[0].length;
  if (!grid.every(row => row.length === width)) {
    throw new Error('Inconsistent row lengths');
  }

  return grid;
}