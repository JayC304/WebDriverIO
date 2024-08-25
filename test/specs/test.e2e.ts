import { expect } from 'chai';
import { Browser, ChainablePromiseElement } from 'webdriverio';

async function findDateElement(
    browser: Browser,
    day: number,
    month: number,
    year: number
  ): Promise<ChainablePromiseElement> {
    const xpath = `//td[@data-handler='selectDay' and @data-event='click' and @data-month='${month}' and @data-year='${year}']/a[.//span[@class='ui-datepicker-day ' and text()='${day}']]`;
    const dateElement = await browser.$(xpath);
    await dateElement.waitForExist({ timeout: 60000 });
    await dateElement.waitForDisplayed({ timeout: 60000 });
    return dateElement;
  }

  async function setFullScreen(browser: Browser) {
    const width = 1920;
    const height = 1080;
    await browser.setWindowRect(0, 0, width, height);
  }

  async function setNumberOfAdults(browser: Browser, numberOfAdults: number) {
    const increaseButtonXPath = "(//div[@data-type='plus' and @data-field='nb_adults'])[3]";
    const increaseButton = await browser.$(increaseButtonXPath);
    let currentNumberOfAdults = 1;
    while (currentNumberOfAdults < numberOfAdults) {
      await increaseButton.click();
      currentNumberOfAdults++;
      await browser.pause(500); 
    }
  }

describe('Flight Search Automation', () => {
    it('should search for a flight from Hanoi to Ho Chi Minh', async () => {
        // Bước 1: Truy cập vào trang BestPrice.vn
        await setFullScreen(browser);
        await browser.url('https://www.bestprice.vn/');

        // Bước 2: Chọn điểm đi 
        const departureInput = await $("//label[@class='btn_flight_icon']");
        await departureInput.click();
        const Input = await $("//span/input[@data-id='flight_from']");
        await Input.setValue('HA NOI');
        const firstSuggestionParagraph = await $('.tt-dataset-0 .tt-suggestions .tt-suggestion:nth-child(1) p');
        await browser.execute((element) => {
            element.click();
        }, firstSuggestionParagraph);
        
        // Bước 3: Chọn điểm đến
        const destinationInput = await $("//span/input[@data-id='flight_to']");
        await destinationInput.click();
        await destinationInput.setValue('SGN');
        const firstSuggestionDestination = await $('.tt-dataset-1 .tt-suggestions .tt-suggestion:nth-child(1) p');
        await browser.execute((element) => {
            element.click();
        }, firstSuggestionDestination);

        // Bước 4: Chọn ngày bay
        const departureDateInput = await $("//i[@data-class='#departure_date_flight']");
        await departureDateInput.click();
        const departureDate = await findDateElement(browser, 28, 7, 2024);
        await departureDate.click();

        // Bước 5: Chọn ngày về 
        const returnDateInput = await $("//i[@data-class='#returning_date_flight']");
        await returnDateInput.click();
        const returnDate = await findDateElement(browser, 1, 8, 2024);
        await returnDate.click();

        // Bước 6: Chọn số người
        const passengerInput = await $("//label[@data-class='.flight-passenger']");
        await passengerInput.click();
        await setNumberOfAdults(browser, 3);
        await passengerInput.click();

        // Bước 7: Bấm tìm chuyến bay
        const searchButton = await $("//button[@id='search_button']");
        await searchButton.click();
        await browser.pause(3000);

        // Bước 8: Kiểm tra kết quả tìm chuyến bay thành công
        const searchResult = await $("//div[@class='title-route']");
        await searchResult.waitForDisplayed();
        const resultText = await searchResult.getText();
        console.log('Search result:', resultText);
        expect(resultText).to.include('Hà Nội Hồ Chí Minh');
    });
});

