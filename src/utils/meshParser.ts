export function parseMeshData(input: string): number[][] {
  // Split input into lines and filter out empty lines and example labels
  const lines = input.split('\n').filter(line => {
    const trimmed = line.trim();
    return trimmed && !trimmed.endsWith(':') && /^[+-]/.test(trimmed);
  });

  // Parse lines that start with +/- into numbers
  const grid = lines.map(line => {
    const numbers = line.trim().split(/\s+/).map(Number);
    
    if (numbers.some(isNaN)) {
      throw new Error('Invalid format. Each value must start with + or - sign (e.g., +1.234 or -0.567)');
    }
    
    return numbers;
  });

  // Validate the grid
  if (grid.length === 0) {
    throw new Error('No valid data found. Please input values in the format shown in the example.');
  }

  const width = grid[0].length;
  if (!grid.every(row => row.length === width)) {
    throw new Error('Each row must have the same number of values.');
  }

  return grid;
}