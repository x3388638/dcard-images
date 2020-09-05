Feature('dcard-images')

const el = {
  root: { css: '#dcard-images-root' },
  BrowseBtn: { css: '[class*=BrowseBtn_]' },
  CloseBtn: { css: '[class*=Gallery__CloseBtn]' },
  Grid: { css: '[class*=ImageItem__Item]' },
  Carousel: { css: '[class*=Carousel_]' }
}

Scenario('Inject userscript and render the BrowseBtn', I => {
  I.amOnSamplePageAndInjectJS()
  I.seeElement(locate(el.root).find(el.BrowseBtn))
  I.saveScreenshot('BrowseBtn.png')
})

Scenario('Click the BrowseBtn to open Gallery', I => {
  I.amOnSamplePageAndInjectJS()
  I.click(locate(el.root).find(el.BrowseBtn))
  I.wait(2)
  I.seeElement(el.CloseBtn)
  I.seeElement(el.Grid)
  I.saveScreenshot('Gallery.png')
})

Scenario('Click Gallery image to open Carousel', I => {
  I.amOnSamplePageAndInjectJS()
  I.click(locate(el.root).find(el.BrowseBtn))
  I.wait(2)
  I.click(el.Grid)
  I.seeElement(locate(el.Carousel).find('img'))
})
