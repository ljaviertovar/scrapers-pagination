const { chromium } = require('playwright');

(async () => {

	const browser = await chromium.launch({
		headless: false // false if you can see the browser
	})
	const page = await browser.newPage()

	// Navigate and wait until network is idle
	await page.goto('https://www.ytravelblog.com/category/travel-planning/travel-tips', { waitUntil: 'networkidle' })


	// get the articles per page
	let articles = []

	let nextBtn = true
	let numPage = 1;
	while (nextBtn) {
		// if (nextBtn) {


		try {

			await page.waitForSelector('.entry-title'); // wait for the element
			// get the title and link of each article
			const articlesPerPage = await page.$$eval('.entry-title', headerArticle => {

				return headerArticle.map((article) => {

					const title = article.getElementsByTagName('a')[0].innerText
					const link = article.getElementsByTagName('a')[0].href

					return JSON.stringify({
						title,
						link
					})

				})

			})

			articles.push({
				page: numPage++,
				articles: articlesPerPage
			})
			// wait 4000ms
			await delay(2000);

			try {
				await page.waitForSelector('.next.page-numbers');
			} catch (err) {
				nextBtn = false
			}



			if (nextBtn) {
				// by clicking the Next button
				await page.click('.next.page-numbers');
			}

		} catch (error) {
			console.log({ error })
		}

		// }


	}

	console.log(articles)

	// close page and browser
	await page.close()
	await browser.close()

})();

// function to wait a while
function delay(time) {
	return new Promise(function (resolve) {
		setTimeout(resolve, time)
	});
}