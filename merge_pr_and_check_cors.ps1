$token = $env:GITHUB_TOKEN
if (-not $token) {
  Write-Error "GITHUB_TOKEN is not set in environment. Aborting."
  exit 2
}
$owner = 'shogosakihama'
$repo = 'word-register'
$pr = 2
$mergeUrl = "https://api.github.com/repos/$owner/$repo/pulls/$pr/merge"
$headers = @{
  Authorization = "token $token"
  Accept = 'application/vnd.github+json'
}
$body = @{ commit_title = 'fix(cors): allow frontend origins for Nuxt preview/production'; merge_method = 'merge' } | ConvertTo-Json
try {
  $resp = Invoke-RestMethod -Uri $mergeUrl -Method Put -Headers $headers -Body $body -ContentType 'application/json' -ErrorAction Stop
  Write-Output "Merge API response: merged=$($resp.merged) message=$($resp.message)"
} catch {
  Write-Error "Failed to merge PR: $($_.Exception.Message)"
  exit 3
}

# If merged, poll production backend for CORS header
$prodUrl = 'https://word-register-production.up.railway.app/api/words'
$origin = 'https://nuxt-app-liard-nu.vercel.app'
Write-Output "Polling $prodUrl for Access-Control-Allow-Origin header (Origin: $origin)"
for ($i=0; $i -lt 30; $i++) {
  Start-Sleep -Seconds 5
  try {
    $r = Invoke-WebRequest -Uri $prodUrl -Method GET -Headers @{ Origin = $origin } -UseBasicParsing -ErrorAction Stop
    $cors = $null
    if ($r.Headers.ContainsKey('Access-Control-Allow-Origin')) { $cors = $r.Headers['Access-Control-Allow-Origin'] }
    if ($cors) {
      Write-Output "CORS header found: $cors"
      exit 0
    } else {
      Write-Output "Attempt $($i+1): No CORS header yet"
    }
  } catch {
    Write-Output "Attempt $($i+1): Request failed: $($_.Exception.Message)"
  }
}
Write-Error "Timed out waiting for CORS header after merge."
exit 4
