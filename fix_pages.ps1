$loginResponse = Invoke-RestMethod -Uri "http://localhost:8055/auth/login" -Method Post -Body '{"email":"admin@zimrugby.co.zw","password":"ZimRugbyUnion2027!"}' -ContentType "application/json"
$token = $loginResponse.data.access_token
$headers = @{Authorization = "Bearer $token"; "Content-Type" = "application/json"}

# Delete clubs via REST
Write-Output "Deleting existing clubs page..."
try {
    $r = Invoke-RestMethod -Uri "http://localhost:8055/items/pages/a1b2c3d4-e5f6-7890-abcd-ef1234567890" -Headers $headers -Method Delete
    Write-Output "Deleted clubs page"
}
catch {
    Write-Output "Clubs delete failed (might not exist): $($_.Exception.Message)"
}

# Delete schools via REST
Write-Output "Deleting existing schools page..."
try {
    $r = Invoke-RestMethod -Uri "http://localhost:8055/items/pages/b2c3d4e5-f6a7-8901-bcde-f12345678901" -Headers $headers -Method Delete
    Write-Output "Deleted schools page"
}
catch {
    Write-Output "Schools delete failed (might not exist): $($_.Exception.Message)"
}

# Create clubs page
$createClubs = @{
    id = "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
    title = "Clubs"
    slug = "clubs"
    route = "/clubs"
    page_type = "content"
    hero_kicker = "Club Directory"
    hero_title = "Clubs"
    hero_intro = "Explore the competitive heartbeat of Zimbabwe Rugby. Browse registered clubs and join the league."
    status = "published"
}
$json3 = ConvertTo-Json $createClubs -Depth 5 -Compress
try {
    $r = Invoke-RestMethod -Uri "http://localhost:8055/items/pages" -Headers $headers -Method Post -Body $json3
    Write-Output "Created clubs: $($r.id)"
}
catch {
    Write-Output "Error creating clubs: $($_.Exception.Message)"
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    Write-Output "Body: $($reader.ReadToEnd())"
}

# Create schools page
$createSchools = @{
    id = "b2c3d4e5-f6a7-8901-bcde-f12345678901"
    title = "Schools"
    slug = "schools"
    route = "/schools"
    page_type = "content"
    hero_kicker = "Youth Development"
    hero_title = "School Rugby"
    hero_intro = "The historic breeding ground of Zimbabwe Sables champions. Discover school leagues and development structures."
    status = "published"
}
$json4 = ConvertTo-Json $createSchools -Depth 5 -Compress
try {
    $r = Invoke-RestMethod -Uri "http://localhost:8055/items/pages" -Headers $headers -Method Post -Body $json4
    Write-Output "Created schools: $($r.id)"
}
catch {
    Write-Output "Error creating schools: $($_.Exception.Message)"
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    Write-Output "Body: $($reader.ReadToEnd())"
}

