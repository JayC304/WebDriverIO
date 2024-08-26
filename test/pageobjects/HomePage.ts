import { ChainablePromiseElement } from 'webdriverio';
import { expect } from 'chai';

export class HomePage {
    private browser: WebdriverIO.Browser;

    constructor(browser: WebdriverIO.Browser) {
        this.browser = browser;
    }

    public get departureInput(): ChainablePromiseElement {
        return this.browser.$("//label[@class='btn_flight_icon']");
    }

    public get inputField(): ChainablePromiseElement {
        return this.browser.$("//span/input[@data-id='flight_from']");
    }

    public get destinationInput(): ChainablePromiseElement {
        return this.browser.$("//span/input[@data-id='flight_to']");
    }


    public get departureDateInput(): ChainablePromiseElement {
        return this.browser.$("//i[@data-class='#departure_date_flight']");
    }

    public get returnDateInput(): ChainablePromiseElement {
        return this.browser.$("//i[@data-class='#returning_date_flight']");
    }

    public get passengerInput(): ChainablePromiseElement {
        return this.browser.$("//label[@data-class='.flight-passenger']");
    }

    public get btnSearchFlight(): ChainablePromiseElement {
        return this.browser.$("//button[@id='search_button']");
    }

    public get searchResult(): ChainablePromiseElement {
        return this.browser.$("//div[@class='title-route']");
    }

    public async selectLocation(departure: string, destination: string): Promise<void> {
        // Chọn điểm đi
        await this.departureInput.click();
        await this.inputField.waitForDisplayed();
        await this.inputField.setValue(departure);
        let listSuggestDeparture = await this.browser.$(`strong.tt-highlight.*=${departure}`);
        await listSuggestDeparture.waitForExist();
        await listSuggestDeparture.click();

        // Chọn điểm đến
        await this.destinationInput.setValue(destination);
        let listSuggestDestination = await this.browser.$(`strong.tt-highlight.*=${destination}`);
        await listSuggestDestination.waitForExist();
        await listSuggestDestination.click();
    }

    public async selectDepartureDate(date: string): Promise<void> {
        const [day, month, year] = date.split('/').map(Number);
        await this.departureDateInput.click();
        const departureDate = await this.findDateElement(day, month, year);
        await departureDate.click();
    }

    public async selectReturnDate(date: string): Promise<void> {
        const [day, month, year] = date.split('/').map(Number);
        await this.returnDateInput.click();
        const returnDate = await this.findDateElement(day, month, year);
        await returnDate.click();
    }

    public async findDateElement(day: number, month: number, year: number): Promise<ChainablePromiseElement> {
        const xpath = `//td[@data-handler='selectDay' and @data-event='click' and @data-month='${month}' and @data-year='${year}']/a[.//span[@class='ui-datepicker-day ' and text()='${day}']]`;
        const dateElement = await this.browser.$(xpath);
        await dateElement.waitForExist();
        await dateElement.waitForDisplayed();
        return dateElement;
    }

    public async selectNumberOfAdults(numberOfAdults: number): Promise<void> {
        await this.passengerInput.click();
        await this.setNumberOfAdults(numberOfAdults);
        await this.passengerInput.click();
    }

    public async setNumberOfAdults(numberOfAdults: number): Promise<void> {
        const increaseButtonXPath = "//div[ancestor::*[contains(@class,'pop-flight-passenger')] and @data-field='nb_adults' and @data-type='plus']//i";
        const increaseButton = await this.browser.$(increaseButtonXPath);
        let currentNumberOfAdults = 1;
        while (currentNumberOfAdults < numberOfAdults) {
            await increaseButton.waitForClickable();
            await increaseButton.click();
            currentNumberOfAdults++;
        }
    }

    public async verifySearchResult(expectedText: string): Promise<void> {
        await this.searchResult.waitForDisplayed();
        const resultText = await this.searchResult.getText();
        console.log('Search result:', resultText);
        expect(resultText).to.include(expectedText);
    }
}
