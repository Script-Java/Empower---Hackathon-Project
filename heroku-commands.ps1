param (
    [switch] $up = $false,
    [switch] $down = $false
)
if($up){
    & "heroku ps:scale web=1 --app empower-gnec-app"
    & "heroku ps:scale web=1 --app empower-gnec-api"
}
if($down){
    & "heroku ps:scale web=0 --app empower-gnec-app"
    & "heroku ps:scale web=0 --app empower-gnec-api"
}