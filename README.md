# Pooki-Bank

Pre Reqs:
  Node JS v15
  10.4.18-MariaDB Server

A png of the DB schema is uploaded in the repo root "Capture.png"

Running the project:
  Clone repo into directory.
  Run "npm install" to install all necessary packages
  Run "npm start" to start server
  You can access the main page (Query Balance) on the url "localhost:8484/views/index.html"
  You can access the transfer page  on the url "localhost:8484/views/transfer.html"
  
  The validated user is Haziq Mumtaz with the user id 1
  The account the amount is being transferred through is account id 1 with a balance of 50000
  Valid account id's that can be transferred to are 2 through 5
  
Improvements:
  A major feature missing from this current application is checking account status and balance etc. and error/update messages on a transfer action. Not very complex features but i am
  not very proficient in JS myself hence a slight hurdle in the implementation. This is my first time working hands on with JS.
  There are several security features than can be implemented in such an application. 
    1. The first and foremost being moving all statistic checks to the api from the main views. This can help prevent bypassing checks by having them hidden.
    2. Maintaining active sessions using cookies being stored in both the server and the browser. However, to minimize risk of cookie highjacking, the time limit
       for cookie expiring should be kept to a minimum
    3. Including source url in the header of verified pages to avoid CSRF and man in the middle attacks.
    4. Obfuscate all JS implementations to make understanding code slightly difficult for attackers trying to find a way into the system
  Scaling under load:
    1. Adding a controller/handler in between the user and the server to schedule requsts and manage the load being put on the server itself.
    2. Splitting the server into multiple modules with a controller/handler in between the user and server nodes to manage which node each request is to be forwarded to.
    3. Multiple instances of the same server with one central database
    4. Indexing the database to speed up queries
