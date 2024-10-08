
package core.tests.experimental;

import org.testng.Assert;
import org.testng.annotations.Test;

public class Experimental {

  @Test(testName = "FIRST EXPERIMENTAL TEST - NAME", description = "FIRST EXPERIMENTAL TEST - DESC")
  public void experimentalTest1() {
    System.out.println("KLASTERS FIRST EXPERIMENTAL TEST!");
  }

  @Test(testName = "FIRST EXPERIMENTAL TEST - NAME", description = "FIRST EXPERIMENTAL TEST - DESC")
  public void experimentalTest2() {
    System.out.println("KLASTERS SECOND EXPERIMENTAL TEST!");
    Assert.fail("ON PURPOSE!");
  }

  @Test(testName = "FIRST EXPERIMENTAL TEST - NAME", description = "FIRST EXPERIMENTAL TEST - DESC")
  public void experimentalTest3() {
    System.out.println("KLASTERS SECOND EXPERIMENTAL TEST!")
  }
}
