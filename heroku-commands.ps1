param (
    [switch] $up = $false,
    [switch] $down = $false
)
if($up){
    & "C:\Program Files\heroku\bin\heroku.exe ps:scale web=1 --app empower-gnec-app"
    & "C:\Program Files\heroku\bin\heroku.exe ps:scale web=1 --app empower-gnec-api"
}
if($down){
    & "C:\Program Files\heroku\bin\heroku.exe ps:scale web=0 --app empower-gnec-app"
    & "C:\Program Files\heroku\bin\heroku.exe ps:scale web=0 --app empower-gnec-api"
}