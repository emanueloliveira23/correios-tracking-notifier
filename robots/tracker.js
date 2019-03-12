const axios = require('axios').default;
const { parse } = require('node-html-parser');

async function tracker(content) {
  
  const apiResponse = await fetchApiResponse(content);
  const track = buildTrack(apiResponse);
  content.track = track;

  async function fetchApiResponse(content) {
    const url = `https://www.websro.com.br/detalhes.php?P_COD_UNI=${content.trackingObject}`;
    const response = await axios.get(url, { responseType: 'html' });
    return response.data;
  }

  function buildTrack(apiResponse) {

    const html = parse(apiResponse);
    const track = findTrack(html);
    return track;

    function findTrack(html) {
      const rows = Array.from(html.querySelectorAll(".table tbody tr"));
      const items = rows.map(row => ({
        text: Array.from(row.querySelectorAll("td")).map(column => column.removeWhitespace().text).join(' ')
      }));
      return items;
    }

  }

}

module.exports = tracker;
