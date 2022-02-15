
let addr;
const serverUrl = "https://8jiwp8kh5sdo.usemoralis.com:2053/server";
const appId = "fMVxsbUgqQFbhqSyzRbNYxpaNlWAeqJDrhM6RiGE";
Moralis.start({
    serverUrl,
    appId
});

let homepage = "https://scann.netlify.app/index.html";
// let homepage = "http://127.0.0.1:5500/dashboard.html";

// if (Moralis.User.current() == null && window.location.href != homepage) {
//     document.body.style.display = "none";
//     window.location.href = "index.html";
// }


login = async () => {
    await Moralis.authenticate({
        signingMessage: "Scann Dapp"
    }).then(async function (user) {
        console.log(user.get('ethAddress'), "logged in");
        addr = user.get('ethAddress');
        user.set("username", document.querySelector('#user-username').value);
        user.set("email", document.querySelector('#user-email').value);
        await user.save();
        window.location.href = "dashboard.html";
    })
}

if (document.querySelector('#btnId') != null) {
    document.querySelector('#btnId').onclick = login;
}
