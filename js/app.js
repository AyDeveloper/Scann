
let addr;
const serverUrl = "https://8jiwp8kh5sdo.usemoralis.com:2053/server";
const appId = "fMVxsbUgqQFbhqSyzRbNYxpaNlWAeqJDrhM6RiGE";
Moralis.start({
    serverUrl,
    appId
});

let homepage = "https://scann.netlify.app/index.html";
if (Moralis.User.current() == null && window.location.href != homepage) {
    document.body.style.display = "none";
    window.location.href = "index.html";
}


login = async () => {
    await Moralis.authenticate({
        signingMessage: "Multipurpose Dapp"
    }).then(async function (user) {
        console.log(user.get('ethAddress'), "logged in");
        addr = user.get('ethAddress');
        user.set("username", document.querySelector('#user-username').value);
        user.set("email", document.querySelector('#user-email').value);
        await user.save();
        window.location.href = "dashboard.html";
    })
}


logout = async () => {
    await Moralis.User.logOut();
    console.log("User logged out");
    window.location.href = "index.html"
}

// window.addEventListener('load', e => {
//     const loader = document.querySelector('.loader');
//     loader.classList.add('displayLoader');
//     if (getUser() == null) {
//         console.log("Cannot get user");
//     } else {
//         const loader = document.querySelector('.loader');
//         getUser().then(user => {
//             setUserProfile(user);
//             getTransaction(user);
//             getNFTS1(user);

//         })
//         setTimeout(() => {
//             loader.classList.remove('displayLoader');
//         }, 5000);
//     }

// })

getUser = async () => {
    const user = await Moralis.User.current();
    return user.get("ethAddress");
}


setUserProfile = async (user) => {
    // get Rinkeby native balance for a given address
    const options = {
        chain: "mainnet",
        address: user,
    };
    const options1 = {
        chain: "rinkeby",
        address: user,
    };
    // get ropsten native balance for a given address
    const options2 = {
        chain: "ropsten",
        address: user,
    };
    // get mainnet native balance for the current user
    const balance = await Moralis.Web3API.account.getNativeBalance(options);
    const balanceRinkeby = await Moralis.Web3API.account.getNativeBalance(options1);
    const balanceRospsten = await Moralis.Web3API.account.getNativeBalance(options2);

    let content = `
    <div class="addr">
    <p>${user}</p>
    </div>

  <div class="userBalance">
      <div>
        <h3>Mainnet</h3>
        <p>${(balance.balance / 1e18).toFixed(5)} ETH</p>
      </div>
      <div>
        <h3>Ropsten</h3>
        <p>${(balanceRospsten.balance / 1e18).toFixed(5)} ETH</p>
      </div>
      <div>
        <h3>Rinkeby</h3>
        <p>${(balanceRinkeby.balance / 1e18).toFixed(5)} ETH</p>
      </div> 
  </div>
    `
    document.querySelector('.addUserBalance').innerHTML = content;
}

getTransaction = async () => {
    console.log('transaction');
    const options = {
        chain: "rinkeby",
        address: addr,
    };
    const transactions = await Moralis.Web3API.account.getTransactions(options);

    if (transactions.total > 0) {

        let table = `
    <table class="table table-striped table-sm">
    <thead>
      <tr>
        <th scope="col">Hash</th>
        <th scope="col">Block Number</th>
        <th scope="col">Block Timestamp</th>
        <th scope="col">From Address</th>
        <th scope="col">Gas Fee</th>
        <th scope="col">Value</th>
      </tr>
    </thead>
    <tbody id="theTransaction">
    </tbody>
    </table>
    `
        document.getElementById('tableTransaction').innerHTML = table;

        console.log(transactions)
        transactions.result.forEach(async transaction => {
            let content = `
        <tr>
            <td scope="col"><a class ="scanLink" href="https://rinkeby.etherscan.io/tx/${transaction.hash}" target="_blank">${transaction.hash}</a></td>
            <td scope="col"><a class ="scanLink" href="https://rinkeby.etherscan.io/block/${transaction.block_number}" target="_blank">${transaction.block_number}</a></td>
            <td scope="col">${millisecondsToTime(Date.parse(new Date()) - Date.parse(transaction.block_timestamp))}</td>
            <td scope="col">${transaction.from_address == Moralis.User.current().get('ethAddress') ? "Outgoing" : "Incoming"}</td>
            <td scope="col">${((transaction.gas * transaction.gas_price) / 10e18).toFixed(5)} ETH</td>
            <td scope="col">${((transaction.value) / 10e18).toFixed(5)} ETH</td>
          </tr>
            `

            document.getElementById("theTransaction").innerHTML += content;
        });



    } else {
        console.log("No transactions");
        document.getElementById('tableTransaction').innerHTML = "<p>No transactions</p>"
    }

}

getTransaction1 = async (enterAddr) => {
    console.log('transaction');
    const options = {
        chain: "rinkeby",
        address: enterAddr,
    };
    const transactions = await Moralis.Web3API.account.getTransactions(options);

    if (transactions.total > 0) {

        let table = `
    <table class="table table-striped table-sm">
    <thead>
      <tr>
        <th scope="col">Hash</th>
        <th scope="col">Block Number</th>
        <th scope="col">Block Timestamp</th>
        <th scope="col">From Address</th>
        <th scope="col">Gas Fee</th>
        <th scope="col">Value</th>
      </tr>
    </thead>
    <tbody id="theTransaction">
    </tbody>
    </table>
    `
        document.getElementById('tableTransaction').innerHTML = table;

        console.log(transactions)
        transactions.result.forEach(async transaction => {
            let content = `
        <tr>
            <td scope="col"><a class ="scanLink" href="https://rinkeby.etherscan.io/tx/${transaction.hash}" target="_blank">${transaction.hash}</a></td>
            <td scope="col"><a class ="scanLink" href="https://rinkeby.etherscan.io/block/${transaction.block_number}" target="_blank">${transaction.block_number}</a></td>
            <td scope="col">${millisecondsToTime(Date.parse(new Date()) - Date.parse(transaction.block_timestamp))}</td>
            <td scope="col">${transaction.from_address == Moralis.User.current().get('ethAddress') ? "Outgoing" : "Incoming"}</td>
            <td scope="col">${((transaction.gas * transaction.gas_price) / 10e18).toFixed(5)} ETH</td>
            <td scope="col">${((transaction.value) / 10e18).toFixed(5)} ETH</td>
          </tr>
            `

            document.getElementById("theTransaction").innerHTML += content;
        });



    } else {
        document.getElementById('tableTransaction').innerHTML = "<p>No transactions</p>"
    }

}


getNFTS = async () => {
    // get NFTs for current user on Mainnet
    const userEthNFTs = await Moralis.Web3API.account.getNFTs();
    console.log(userEthNFTs);

    if (userEthNFTs.result.length > 0) {
        userEthNFTs.result.forEach(nft => {
         let metadata = JSON.parse(nft.metadata);
         const tablenfts = document.getElementById('tablenfts');
         let content = `
            <div class ="card col-md-3">
                <img class="img-card" height="300">${fixURL(metadata.image_url)}</img>
                <div class="card-body"> 
                    <h5 class="card-title">${metadata.name}</h5>
                    <p class="card-text">${metadata.description}</p>
                </div>
            </div>
         `

         tablenfts.innerHTML += content;
        })
        console.log("yes you have NFTS");

    } else {
        document.getElementById('tablenfts').innerHTML = '<p>You do not have NFTs on Mainnet</p>'
    }
}

getNFTS1 = async (addrConstant) => {
    // get NFTs for current user on Mainnet
    const userEthNFTs = await Moralis.Web3API.account.getNFTs({ chain: 'rinkeby', address: addrConstant});
    console.log(userEthNFTs, "NFTs");
    console.log("yes you have NFTS");

    if (userEthNFTs.result.length > 0) {
        userEthNFTs.result.forEach(nft => {
         let metadata = JSON.parse(nft.metadata);
         const tablenfts = document.getElementById('tablenfts');
         let content = `
            <div class ="card col-md-3">
                <img class="img-card" height="300"  src="${fixURL(metadata.image_url)}" ></img>
                <div class="card-body"> 
                    <h5 class="card-title">${metadata.name}</h5>
                    <p class="card-text">${metadata.description}</p>
                </div>
            </div>
         `

         tablenfts.innerHTML = content;
        })
    
    } else {
        document.getElementById('tablenfts').innerHTML = '<p>You do not have NFTs on Mainnet</p>'
    }
}

fixURL = (url) => {
    if(url.startsWith("ipfs")) {
        return "https://ipfs.moralis.io:2053/ipfs/" + url.split("ipfs://").slice(-1);
    } else {
        return url + "?format=json"; 
    }
}


millisecondsToTime = (ms) => {
    let minutes = Math.floor(ms / (1000 * 60));
    let hours = Math.floor(ms / (1000 * 60 * 60));
    let days = Math.floor(ms / (1000 * 60 * 60 * 24));

    if (days < 1) {
        if (hours < 1) {
            if (minutes < 1) {
                return `less than a minutes ago`
            } else return `${minutes} ago`;
        } else return `${hours} hours ago`
    } else return `${days} days ago`
}

if (document.querySelector('#btnId') != null) {
    document.querySelector('#btnId').onclick = login;
}
if (document.querySelector('#btn-logout') != null) {
    document.querySelector('#btn-logout').onclick = logout;
}
if (document.querySelector('#get_transaction_link') != null) {
    document.querySelector('#get_transaction_link').onclick = getTransaction;
}
document.querySelector('#get_balance_link').addEventListener('click', e => {
    getUser().then(user => {
        setUserProfile(user);
    })
})

if (document.querySelector('#get_Nft_link') != null) {
    document.querySelector('#get_Nft_link').onclick = getNFTS;
}

// working out search to display for all

const searchBtn = document.getElementById('searchBtn');

searchBtn.addEventListener('keyup', e => {
    if(e.keyCode == 13) {
        const loader = document.querySelector('.loader');
        loader.classList.add('displayLoader');
        setTimeout(() => {
            loader.classList.remove('displayLoader')
        }, 6000);
        const addrConstant = e.target.value;
        getTransaction1(addrConstant);
        setUserProfile(addrConstant)
        getNFTS1(addrConstant);
    }
})