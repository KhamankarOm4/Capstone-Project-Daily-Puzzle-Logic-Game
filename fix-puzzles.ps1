$files = @(
    "src/puzzles/PatternSequence.tsx",
    "src/puzzles/DeductionGrid.tsx",
    "src/puzzles/BinaryGrid.tsx",
    "src/puzzles/MiniSudoku.tsx"
)

foreach ($file in $files) {
    $content = Get-Content $file -Raw
    
    # Find getPuzzleComponent method and wrap its content
    $pattern = '(getPuzzleComponent\([^)]+\)\s*\{)\s*(const \[)'
    $replacement = '$1' + "`r`n        return () => {`r`n            " + '$2'
    $content = $content -replace $pattern, $replacement
    
    # Find the closing of getPuzzleComponent and add closing brace
    $pattern = '(\s+\);)\s+(\},\s+validateSolution)'
    $replacement = '$1' + "`r`n        };`r`n    " + '$2'
    $content = $content -replace $pattern, $replacement
    
    Set-Content $file $content -NoNewline
    Write-Host "Updated $file"
}
