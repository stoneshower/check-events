const puppeteer = require('puppeteer');
const fs = require('fs')
const path = require('path');

const obj = {
  items: []
}

try {
  (async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    const addMovieData = async (siteUrl, movieNameSelector, movieRateSelector) => {
      // Rotten Tomatoes
      await page.goto(siteUrl)
      // Get Site Name
      siteName = await page.evaluate(() => window.location.href);
      // Get Movie Name
      targetElement = movieNameSelector
      await page.waitFor(targetElement)
      movieName = await page.$eval(targetElement, el => el.innerText)
      // Get Movie Rate
      targetElement = movieRateSelector
      await page.waitFor(targetElement)
      movieRate = await page.$eval(targetElement, el => el.innerText)

      // Add Data to Object
      obj.items.push({
        site_name: siteName,
        movie_name: movieName,
        movie_rate: movieRate,
      })
    }

    let siteName = ''
    let movieName = ''
    let taregetElement = ''
    let movieRate = ''

    await addMovieData(
      'https://www.rottentomatoes.com/m/forrest_gump',
      '#topSection > div.col-sm-17.col-xs-24.score-panel-wrap > div.mop-ratings-wrap.score_panel.js-mop-ratings-wrap > h1',
      '.mop-ratings-wrap__percentage'
    )

    await addMovieData(
      'https://www.imdb.com/title/tt0109830/',
      '#title-overview-widget > div.vital > div.title_block > div > div.titleBar > div.title_wrapper > h1',
      '#title-overview-widget > div.vital > div.title_block > div > div.ratings_wrapper > div.imdbRating > div.ratingValue > strong > span'
    )

    await addMovieData(
      'https://www.metacritic.com/movie/forrest-gump',
      '#main_content > div.movie.product.summary > div.content_under_header > div > table > tbody > tr > td.maskedcenter > div > table > tbody > tr > td.gu5.maskedbg > div > div > div.pad_btm1 > div > h1',
      '#nav_to_metascore > div:nth-child(2) > div.distribution > div.score.fl > a > div'
    )

    const json  = JSON.stringify(obj)
    fs.writeFile('jsonfile.json', json, 'utf8', function (err) {
      if (err) throw err
      console.log('complete')
    })




    await browser.close()
  })()
} catch(err) {
  console.error(err)
}