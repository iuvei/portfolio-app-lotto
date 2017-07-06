"use strict";

var express = require('express');
var request = require('request-promise');
var config = require('../config');

var router = express.Router();

router.get('/:locale?', (req, response) => {
    let uri = config.localeAPI.getTranslations;
    const options = {
      method: 'GET',
      uri: uri+"&locale_id="+req.params.locale
    };

    request(options)
    .then(function(res) {
      return response.status(200).json(JSON.parse(res))
    })
    .catch(function(err) {
      console.log(err);
      return response.status(500).json(err)
    });
});


//Save and Get Locales
router.route('/cms/locales')
    /**
     * Get list of Locales
     */
    .get(function(req, res){
      let uri = config.localeAPI.getLocales;
      const options = {
        method: 'GET',
        uri: uri
      };

      request(options)
      .then(function(res) {
        return response.status(200).json(JSON.parse(res))
      })
      .catch(function(err) {
        console.log(err);
        return response.status(500).json(err)
      });
     
    })

module.exports = router;
