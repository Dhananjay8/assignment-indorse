const Sequelize = require('sequelize'),
  urlParser = require('url');

const rootPrefix = '../..',
  ServicesBase = require(rootPrefix + '/app/services/Base'),
  coreConstants = require(rootPrefix + '/coreConstants'),
  UrlModel = require(rootPrefix + '/app/models/Url'),
  mysqlProvider = require(rootPrefix + '/lib/providers/mysql');

const mysqlInstance = mysqlProvider.getInstance();

const currentDomain = coreConstants.API_DOMAIN;

class GetOriginalUrl extends ServicesBase {
  constructor(params) {
    super(params);

    const oThis = this;
    oThis.shortUrl = params.short_url.toLowerCase().replace(/&amp;/g, '&');

    oThis.originalUrl = null;
    oThis.parsedUrl = {};
    oThis.shortId = null;
  }

  async _asyncPerform() {
    const oThis = this;

    await oThis._validateUrl();

    return oThis._fetchFromDb();
  }

  async _validateUrl() {
    const oThis = this;

    oThis.parsedUrl = urlParser.parse(oThis.shortUrl, true);
    if (
      typeof(oThis.parsedUrl) !== 'object' ||
      // !['http:', 'https:'].includes(oThis.parsedUrl.protocol) ||
      !currentDomain.match(oThis.parsedUrl.host)
    ) {
      return Promise.reject({
        success: false,
        code: 422,
        internal_error_identifier: 'a_s_gou_1',
        api_error_identifier: 'url_validation_failed',
        debug_options: {
          url: oThis.shortUrl,
          a: typeof(oThis.parsedUrl) !== 'object',

        }
      });
    }

    const pathName = oThis.parsedUrl.pathname,
      pathArray = pathName.split('/');

    oThis.shortId = pathArray[1];
  }

  async _fetchFromDb() {
    const oThis = this,
      Url = UrlModel(mysqlInstance, Sequelize);

    const urlQueryResponse = await Url.findAll({
      where: {
        short_id: oThis.shortId
      }
    });

    if(urlQueryResponse && urlQueryResponse.length > 0 && urlQueryResponse[0].dataValues) {
      oThis.originalUrl = urlQueryResponse[0].dataValues.url;
      return {
        success: true,
        url: oThis.originalUrl
      }
    } else {
      return {
        success: true,
        msg: 'Not found in database'
      }
    }


  }
}

module.exports = GetOriginalUrl;

