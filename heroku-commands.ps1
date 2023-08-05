param (
    [switch] $up = $false,
    [switch] $down = $false
)

if($up){
    & heroku ps:scale web=1 --app empower-gnec-app
    & heroku ps:scale web=1 --app empower-gnec-api
    $heroku_info = & heroku info -s --app empower-gnec-app
    Write-Output "Done! The dynos are back online"
    $heroku_web_url = $heroku_info | Select-String -Pattern "web_url=*." 
    Write-Output $heroku_web_url
}
if($down){
    . heroku ps:scale web=0 --app empower-gnec-app
    . heroku ps:scale web=0 --app empower-gnec-api
    Write-Output "Done! The dynos are offline"
}