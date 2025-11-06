// ==UserScript==
// @name         Trade Notifier
// @include      http://www.Pekora.zip/
// @namespace    http://www.Pekora.zip/
// @version      2024-06-10
// @match        *://pekora.zip/*
// @match        *://www.Pekora.zip/*
// @match        *://*.Pekora.zip/*
// @grant        GM_xmlhttpRequest
// @icon         https://files.catbox.moe/cyolc9.png
// @grant        none
// ==/UserScript==



// Trade Notifier

let token = null;
let inboundlen = 0;
let completedlen = 0;
let inactivelen = 0;
let lastnum = 0;
let lastnumtrigger = false

let icon = "https://www.Pekora.zip/img/logo_R.svg";

function getToken() {

  fetch("https://www.Pekora.zip/apisite/catalog/v1/catalog/items/details", {method: "POST",}).then((response) => {

    token = response.headers.get("x-csrf-token");
    console.log('x-csrf Token Fetched! ' + token)
  });

};

function getTrades(type) {
  fetch("https://www.Pekora.zip/apisite/trades/v1/trades/" + type + "?cursor=", {
    "headers": {
      "accept": "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      "priority": "u=1, i",
      "sec-ch-ua": "\"Google Chrome\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Chrome OS\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-csrf-token": token
    },
    "referrer": "https://www.Pekora.zip/My/Trades.aspx",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
  }).then((response) => response.json())
  .then((trades) => {

    if (type == 'inbound') {
      inboundlen = trades.data.length
      if (lastnumtrigger != true) {
        lastnumtrigger = true
        lastnum = inboundlen;
        console.log(lastnum + " <- dess nons")
      }
      console.log(inboundlen + " Trade(s) Inbound")
    }
    if (type == 'completed') {
      completedlen = trades.data.length
      console.log(completedlen + " Trade(s) Completed")
    }
    if (type == 'inactive') {
      inactivelen = trades.data.length
      console.log(inactivelen + " Trade(s) Inactive")
    }

  })
}

getTrades('inbound')

function ScanInbound() {
  fetch("https://www.Pekora.zip/apisite/trades/v1/trades/inbound?cursor=", {
    "headers": {
      "accept": "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      "priority": "u=1, i",
      "sec-ch-ua": "\"Google Chrome\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Chrome OS\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-csrf-token": token
    },
    "referrer": "https://www.Pekora.zip/My/Trades.aspx",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
  }).then((response) => response.json()).then((trades) => {

    let tradedata = trades.data
    getTrades('inbound')

    if (trades.data.length == inboundlen || trades.data.length == lastnum) {

      console.log('No trades found!')

    } else {

      fetch("https://www.Pekora.zip/apisite/thumbnails/v1/users/avatar-headshot?userIds=" + tradedata[0].user.id + "&size=420x420&format=png", {
        "headers": {
          "accept": "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.9",
          "priority": "u=1, i",
          "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Chrome OS\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-csrf-token": "qAKDnNKjcRM="
        },
        "referrer": "https://www.Pekora.zip/users/4/profile",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
      }).then((response) => response.json()).then((stjuff) => {

        let icon2 = 'https://www.Pekora.zip' + stjuff.data[0].imageUrl


        new Notification(tradedata[0].user.name, {
          body: "Sent you a trade!",
          icon: icon2,
        });

      })


    }

  })
}

let loop1 = setInterval(getToken, 1250)
let loop2 = setInterval(ScanInbound, 5000)
