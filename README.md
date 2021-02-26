# Chainsaw_Detection_APP
This is the repo for Research Project Chainsaw Sounds Detection Using Mobile Application of COMP90055 Research Project(25 points)

For Server,
If want to test Server locally, using command line to
1. create python virtual environment
2. install all dependcies in the server/requirement.txt
3. cd into server folder
4. python3 managy.py runserver
The main page(under default setting) is http://127.0.0.1:8000/
The api under http://127.0.0.1:8000/api
predict page http://127.0.0.1:8000/app/perdict

For app
1.Install IONIC
2.cd to the app folder
3.Ionic serve
The recording function of Ionic can only used when test on real mobile phone, for test in android mobile phone using
ionic open android to open android studio and run on vm/real mobile phone

For testing server and app locally,
1. Change firewall setting for port 8000 to public accessable
2. comment out the "const infoPage = 'http://149.28.186.14/app/perdict'" line under Chainsaw_Detection_APP/app/src/pages/Tab1.tsx
3. delete the "//" from "//const infoPage = 'http://127.0.0.1:8000/app/perdict' " in the same file
4. comment out the "const infoPage = 'http://149.28.186.14/api/chainsaw-api/'" line under Chainsaw_Detection_APP/app/src/pages/Tab2.tsx
5. delete the "//" from "//const infoPage = 'http://127.0.0.1:8000/api/chainsaw-api/' " in the same file
6. Following the two "For app" and "For server" sections to run server and app

This app based on Meyda https://meyda.js.org/getting-started
                  Google Map React  https://github.com/google-map-react/google-map-react#readme
