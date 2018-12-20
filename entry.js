// NoService/services/NoMailer/entry.js
// Description:
// "NoMailer/entry.js" description.
// Copyright 2018 NOOXY. All Rights Reserved.
'use strict';
const NodeMailer = require('nodemailer');

function Service(Me, API) {
  // Initialize your service here synchronous. Do not use async here!

  // Get the service socket of your service
  let ss = API.Service.ServiceSocket;
  // BEWARE! To prevent callback error crash the system.
  // If you call an callback function which is not API provided. Such as setTimeout(callback, timeout).
  // You need to wrap the callback funciton by API.SafeCallback.
  // E.g. setTimeout(API.SafeCallback(callback), timeout)
  let safec = API.SafeCallback;
  let transporter = NodeMailer.createTransport(Me.Settings.transporter_settings);
  // Your settings in manifest file.
  // transporter.sendMail({
  //   from: Me.Settings.transporter_settings.auth.user,
  //   to: "unicoco12345@gmail.com",
  //   subject: 'Sending Email using Node.js',
  //   text: 'That was easy!'
  // }, (error, info)=> {
  //   console.log(error, info);
  // })
  // Safe define a JSONfunction.


  // ServiceSocket.onData, in case client send data to this Service.
  // You will need entityID to Authorize remote user. And identify remote.
  ss.on('data', (entityID, data) => {
    // Get Username and process your work.
    API.Service.Entity.getEntityOwner(entityID, (err, username)=> {
      // To store your data and associated with userid INSEAD OF USERNAME!!!
      // Since userid can be promised as a unique identifer!!!
      let userid = null;
      // Get userid from API
      API.Authenticity.getUserID(username, (err, id) => {
        userid = id;
      });
      // process you operation here
      console.log('recieved a data');
      console.log(data);
    });
  });
  // ServiceSocket.onConnect, in case on new connection.
  ss.on('connect', (entityID, callback) => {
    // Do something.
    // report error;
    callback(false);
  });
  // ServiceSocket.onClose, in case connection close.
  ss.on('close', (entityID, callback) => {
    // Get Username and process your work.
    API.Service.Entity.getEntityOwner(entityID, (err, username)=> {
      // To store your data and associated with userid INSEAD OF USERNAME!!!
      // Since userid can be promised as a unique identifer!!!
      let userid = null;
      // Get userid from API
      API.Authenticity.getUserID(username, (err, id) => {
        userid = id;
      });
      // process you operation here
      // console.log('ServiceSocket closed');
      // report error;
      callback(false);
    });
  });

  // Here is where your service start
  this.start = ()=> {
    // Access another service on this daemon
    // API.Service.ActivitySocket.createDefaultAdminDeamonSocket('Another Service', (err, activitysocket)=> {
      // accessing other service
    // });
    API.Daemon.getSettings((err, DaemonSettings)=>{
      ss.sdef('sendMail', (json, entityID, returnJSON)=> {
        json.from = DaemonSettings.company_name+' <'+Me.Settings.transporter_settings.auth.user+'>';
        transporter.sendMail(json, (error, info)=> {
          if (error) {
            returnJSON(false, {s: JSON.stringify(error, null, 2)});

            // console.log(error);
          } else {
            returnJSON(false, {s: JSON.stringify(info, null, 2)});

            // console.log('Email sent: ' + info.response);
          }
        })
        // First parameter for error, next is JSON to be returned.

      },
      // In case fail.
      ()=>{
        console.log('Auth Failed.');
      });
    });
  }

  // If the daemon stop, your service recieve close signal here.
  this.close = ()=> {
    // Close your service here synchronous. Do not use async here!
    // Saving state of you service.
    // Please save and manipulate your files in this directory
  }
}

// Export your work for system here.
module.exports = Service;
