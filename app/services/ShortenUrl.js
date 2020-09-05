const Sequelize = require('sequelize');

const shortid = require('shortid');

const rootPrefix = '../..',
  ServicesBase = require(rootPrefix + '/app/services/Base'),
  coreConstants = require(rootPrefix + '/coreConstants'),
  UrlModel = require(rootPrefix + '/app/models/Url'),
  ValidatorLib = require(rootPrefix + '/lib/Validator'),
  mysqlProvider = require(rootPrefix + '/lib/providers/mysql');

const mysqlInstance = mysqlProvider.getInstance();

class ShortenUrl extends ServicesBase {
  constructor(params) {
    super(params);

    const oThis = this;

    oThis.url = params.url;

    oThis.shortId = null;
  }

  async _asyncPerform() {
    const oThis = this;

    await oThis._performValidations();

    oThis._generateShortUrl();

    await  oThis._insertIntoUrls();

    return {
      success: true,
      data: {
        short_url: oThis.shortUrl
      }
    }
  }

  async _performValidations() {
    const oThis = this;

    if(!ValidatorLib.validateGenericUrl(oThis.url)) {
      return Promise.reject({
        success: false,
        code: 422,
        internal_error_identifier: 'a_s_shurl_1',
        api_error_identifier: 'url_validation_failed',
        debug_options: {
          url: oThis.url
        }
      })
    }
  }


  async _generateShortUrl() {
    const oThis = this;

    oThis.shortId = shortid.generate();

    oThis.shortUrl = `${coreConstants.API_DOMAIN}/${oThis.shortId}`;
  }

  async _insertIntoUrls() {
    const oThis = this;

    const Url = UrlModel(mysqlInstance, Sequelize);

    await Url.create({
      url: oThis.url,
      short_id: oThis.shortId,
      short_url: oThis.shortUrl
    }).catch(function(err) {
      console.error(err);
    });

  }
}

module.exports = ShortenUrl;
