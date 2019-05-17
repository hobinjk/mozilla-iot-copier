/**
 * Where the translator should look for your data. If you visit this page you
 * should see the main things list of the Gateway. If running locally, this may
 * be https://gateway.local, http://gateway.local, https://localhost:4443, or
 * http://localhost:8080 instead.
 */
const gatewayUrlTrellis = 'https://webthings.local';
const gatewayUrlLight = 'https://webthings.local';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

/**
 * A JSON Web Token used by the translator to authenticate with the gateway.
 * Can be issued using the gateway's local token service, accessible from the
 * Authorizations section of the Settings page.
 */
const jwtTrellis = '';
const jwtLight = '';

const WebSocket = require('ws');

const _headers = {
  Accept: 'application/json',
  Authorization: `Bearer jwt`,
};

const wsUrlTrellis = gatewayUrlTrellis.replace('http', 'ws');
const hrefTrellis = '/things/neotrellis-0';
const wsTrellis =
  new WebSocket(`${wsUrlTrellis}${hrefTrellis}?jwt=${jwtTrellis}`);

const wsUrlLight = gatewayUrlLight.replace('http', 'ws');
const hrefLight = '/things/blinkt-led-1';
const wsLight = new WebSocket(`${wsUrlLight}${hrefLight}?jwt=${jwtLight}`);

function sendColor(color) {
  console.log('sendColor', color);
  wsLight.send(JSON.stringify({
    messageType: 'setProperty',
    data: {
      color: color,
    },
  }));
}

wsTrellis.addEventListener('message', function(event) {
  try {
    const msg = JSON.parse(event.data);
    if (msg.messageType === 'propertyStatus') {
      if (msg.data.hasOwnProperty('color')) {
        sendColor(msg.data.color);
      }
    }
  } catch (e) {
    console.warn(e);
  }
});
