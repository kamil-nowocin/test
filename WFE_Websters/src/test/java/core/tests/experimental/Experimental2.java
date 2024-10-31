package core.tests.experimental;

import static org.openqa.selenium.OutputType.BYTES;
import io.github.bonigarcia.wdm.WebDriverManager;
import io.qameta.allure.Allure;
import io.qameta.allure.Step;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import org.apache.commons.io.FileUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.ITestResult;
import org.testng.annotations.AfterClass;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class Experimental2 {

  private final Path sourceDir = createAllureResultsPath("WFE_Websters", "build");
  private final Path destinationDir = createAllureResultsPath("build");

  private WebDriver driver;
  private WebDriverWait wait;

  @BeforeClass
  public void setup() {
    WebDriverManager.chromedriver().setup();
    ChromeOptions options = new ChromeOptions();
    options.addArguments("--headless");
    options.addArguments("---disable-search-engine-choice-screen");
    options.addArguments("--disable-gpu");
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-dev-shm-usage");
    options.addArguments("--incognito");//ok
    options.addArguments("--start-maximized");
    options.addArguments("--lang=en");

    driver = new ChromeDriver(options);
    driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
    wait = new WebDriverWait(driver, Duration.ofSeconds(10));
  }

  @Test(testName = "FIRST EXPERIMENTAL TEST - NAME", description = "FIRST EXPERIMENTAL TEST - DESC")
  public void experimentalTest2() {
    System.out.println("WEBSTER SECOND EXPERIMENTAL TEST!");
    Assert.fail("ON PURPOSE!");
  }

  @Test(testName = "Google Search Test in Incognito", description = "Test that navigates to Google, dismisses the search engine prompt, performs a search, and verifies results.")
  public void googleSearchTestInIncognito() {
    openGoogleHomePage();
    dismissSearchEnginePromptIfPresent();
    performSearch("Selenium WebDriver");
    verifySearchResults();
  }

  @Step("Opening Google homepage")
  public void openGoogleHomePage() {
    driver.get("https://www.google.com");
    Assert.assertTrue(driver.getTitle().contains("Google"),
        "Google homepage title should contain 'Google'");
  }

  @Step("Dismissing 'Skip Search Engine' prompt if present")
  public void dismissSearchEnginePromptIfPresent() {
    try {
      WebElement skipSearchEnginePrompt = wait.until(
          ExpectedConditions.elementToBeClickable(By.id("L2AGLb"))); // Explicit Wait na przycisk
      skipSearchEnginePrompt.click();
    } catch (Exception e) {
      System.out.println("Skip Search Engine prompt not present, continuing test.");
    }
  }

  @Step("Performing search for {query}")
  public void performSearch(String query) {
    WebElement searchBox = driver.findElement(By.name("q"));
    searchBox.sendKeys(query);
    searchBox.submit();
  }

  @Step("Verifying search results are displayed")
  public void verifySearchResults() {
    var results = wait.until(
        ExpectedConditions.visibilityOfAllElementsLocatedBy(By.cssSelector("h3")));
    Assert.assertFalse(results.isEmpty(), "Search results should be displayed");
  }

  private void takeScreenshot() {
    Allure.addAttachment("TEST", "image/jpg",
        new ByteArrayInputStream(((TakesScreenshot) driver).getScreenshotAs(BYTES)), "jpg");
  }

  private Path createAllureResultsPath(String... paths) {
    Path projectRoot = Path.of("").toAbsolutePath();
    return Paths.get(projectRoot.toString(), Paths.get("", paths).toString(), "allure-results");
  }

  @AfterMethod
  public void captureScreenshotIfTestFails(ITestResult result) {
    if (ITestResult.FAILURE == result.getStatus()) {
      System.out.println("LOL");
      takeScreenshot();
    }
  }

  @AfterClass
  public void tearDown() {
    if (driver != null) {
      driver.quit();
    }
  }

  @AfterSuite
  public void moveAllureResultsContent() {
    File source = sourceDir.toFile();
    File destination = destinationDir.toFile();

    try {
      FileUtils.copyDirectory(source, destination);
      System.out.printf("Przeniesiono zawartość katalogu Allure z %s do %s%n", source.getPath(),
          destination.getPath());

      FileUtils.cleanDirectory(source);
    } catch (IOException e) {
      e.printStackTrace();
      System.err.printf("Wystąpił błąd podczas przenoszenia zawartości katalogu Allure: %s%n",
          e.getMessage());
    }
  }
}
