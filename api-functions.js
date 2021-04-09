
/* Get Users Accounts */
function getAccounts(id){
$.ajax({
    url: "/api/get-accounts",
    type: "POST",
    dataType: 'json',
    contentType: "application/json",
    data: JSON.stringify({user_id: id}),
    success: function(data){
        console.log(data);
        addData(data)
    },
    error: function (xhr, status, error) {
        console.log(JSON.stringify(xhr)+" "+status+" "+error);
    }
});
}

/* Get Username */
function getUsername(id){
    $.ajax({
        url: "/api/get-username",
        type: "POST",
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify({user_id: id}),
        success: function(data){
            console.log(data);
            addUsername(data)
        },
        error: function (xhr, status, error) {
            console.log(JSON.stringify(xhr)+" "+status+" "+error);
        }
    });
    }
    
/* Check Balance */
function checkBalance(account,amount){
    $.ajax({
        url: "/api/get-accounts",
        type: "POST",
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify({user_id: 1,}),
        success: function(data){
            console.log(data);
            addData(data)
        },
        error: function (xhr, status, error) {
            console.log(JSON.stringify(xhr)+" "+status+" "+error);
        }
    });
    }

/* Render Accounts Data */

function addData(arr){
    for(let i=0; i<arr.length; i++){
        let parentDiv = document.createElement("div")
        parentDiv.classList.add("dataClass")
        let para = document.createElement("p")
        let acc = document.createElement("h3")
        acc.style = "font-weight: bold;"
        acc.innerHTML = "Account ID: " + arr[i].id
        acc.classList.add("account_id")
        parentDiv.appendChild(acc)
        let status = document.createElement("h4")
        status.innerHTML = "Status: " + arr[i].status
        status.classList.add("account_id")
        parentDiv.appendChild(status)
        let amount = document.createElement("h4")
        amount.innerHTML = "Amount: " + arr[i].amount
        amount.classList.add("account_id")
        parentDiv.appendChild(amount)
        let type = document.createElement("h4")
        type.innerHTML = "Type: " + arr[i].type
        type.classList.add("account_id")
        parentDiv.appendChild(type)
        let button = document.createElement("button")
        button.onclick = navigateTransfer(arr[i].id)
        button.innerHTML = "Transfer Amount"
        button.href = "/transfer.html"
        button.classList.add("transferButton")
        let buttonDiv = document.createElement("div")
        buttonDiv.classList.add("vertical-center")
        buttonDiv.appendChild(button)
        parentDiv.appendChild(buttonDiv)
        document.getElementById("container-div").appendChild(parentDiv)
    } 
}

/* Render Username Div */
function addUsername(data){
    let parentDiv = document.createElement("div")
    let nameElement = document.createElement("h1")
    nameElement.style = "font-weight: bold; align=center;"
    nameElement.innerHTML = "User: " + data[0].name
    parentDiv.appendChild(nameElement)
    document.getElementById("username").appendChild(parentDiv)    
}

/* Add Transfer button functionality */

function navigateTransfer(id){
    document.location.href = "localhost:8484/transfer.html";
}