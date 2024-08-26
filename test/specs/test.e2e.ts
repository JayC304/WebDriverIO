import { HomePage } from '../pageobjects/HomePage';

describe('Flight Search Automation', () => {
    let homePage: HomePage;

    before(async () => {
        await browser.setWindowRect(0, 0, 1920, 1080);
        await browser.url('https://www.bestprice.vn/');
        homePage = new HomePage(browser);
    });

    it('should search for a flight from Hanoi to Ho Chi Minh', async () => {
        // Bước 1: Chọn điểm đi và đến
        await homePage.selectLocation('HAN', 'SGN');
        // Bước 2: Chọn ngày bay
        await homePage.selectDepartureDate('28/7/2024');

        // Bước 3: Chọn ngày về
        await homePage.selectReturnDate('1/8/2024');

        // Bước 4: Chọn số người
        await homePage.selectNumberOfAdults(3);

        // Bước 5: Bấm tìm chuyến bay
        await homePage.btnSearchFlight.click();

        // Bước 6: Kiểm tra kết quả tìm chuyến bay thành công
        await homePage.verifySearchResult('Hà Nội Hồ Chí Minh');
    });
});
