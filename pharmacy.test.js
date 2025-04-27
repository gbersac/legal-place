import { Drug, Pharmacy } from "./pharmacy";
import { createLog } from "./index";
import fs from "fs";

describe("Pharmacy", () => {
  it("should decrease the benefit and expiresIn", () => {
    expect(new Pharmacy([new Drug("test", 2, 3)]).updateBenefitValue()).toEqual(
      [new Drug("test", 1, 2)],
    );
  });

  it("should decrease the benefit twice as fast after expiration date", () => {
    const drug = new Drug("test", 0, 10); // the drug just expired
    const pharmacy = new Pharmacy([drug]);
    const updatedDrugs = pharmacy.updateBenefitValue();
    expect(updatedDrugs).toEqual([new Drug("test", -1, 8)]); // the drug lost 2 points of benefit
  });

  it("should never have a negative benefit value", () => {
    const drug = new Drug("test", 0, 0);
    const pharmacy = new Pharmacy([drug]);
    const updatedDrugs = pharmacy.updateBenefitValue();
    expect(updatedDrugs[0].benefit).toBeGreaterThanOrEqual(0);
  });

  it("should never have a benefit value greater than 50", () => {
    const drug = new Drug("test", 100, 50);
    const pharmacy = new Pharmacy([drug]);
    const updatedDrugs = pharmacy.updateBenefitValue();
    expect(updatedDrugs[0].benefit).toBeLessThanOrEqual(50);
  });

  it("should produce the same output as the one stored in output-model.json", () => {
    // Create a new pharmacy with the same initial drugs as in index.js
    const drugs = [
      new Drug("Doliprane", 20, 30),
      new Drug("Herbal Tea", 10, 5),
      new Drug("Fervex", 12, 35),
      new Drug("Magic Pill", 15, 40),
    ];
    const pharmacy = new Pharmacy(drugs);

    // Generate the log using the createLog function
    const generatedLog = createLog(pharmacy);

    // Load the model output from the file
    const fileContent = fs.readFileSync("output-model.json", "utf8");
    const modelOutput = JSON.parse(fileContent);

    // Compare the generated log with the model output
    expect(generatedLog).toEqual(modelOutput.result);
  });

  describe("Herbal Tea", () => {
    it("should increase the benefit of Herbal Tea as it gets older", () => {
      const drug = new Drug("Herbal Tea", 2, 10);
      const pharmacy = new Pharmacy([drug]);
      const updatedDrugs = pharmacy.updateBenefitValue();
      expect(updatedDrugs).toEqual([new Drug("Herbal Tea", 1, 11)]); // benefit increases by 1
    });

    it("should increase the benefit of Herbal Tea twice as fast after expiration date", () => {
      const drug = new Drug("Herbal Tea", 0, 10); // the drug just expired
      const pharmacy = new Pharmacy([drug]);
      const updatedDrugs = pharmacy.updateBenefitValue();
      expect(updatedDrugs).toEqual([new Drug("Herbal Tea", -1, 12)]); // benefit increases by 2
    });

    it("should not increase the benefit of Herbal Tea beyond 50", () => {
      const drug = new Drug("Herbal Tea", 0, 49); // expired with benefit near max
      const pharmacy = new Pharmacy([drug]);
      const updatedDrugs = pharmacy.updateBenefitValue();
      expect(updatedDrugs[0].benefit).toBeLessThanOrEqual(50);
    });
  });

  describe("Magic Pill", () => {
    it("should never decrease the expiresIn and benefit value of Magic Pill", () => {
      const drug = new Drug("Magic Pill", 10, 20);
      const pharmacy = new Pharmacy([drug]);
      const updatedDrugs = pharmacy.updateBenefitValue();
      expect(updatedDrugs[0].expiresIn).toEqual(10);
      expect(updatedDrugs[0].benefit).toEqual(20);
      const updatedDrugs2 = pharmacy.updateBenefitValue();
      expect(updatedDrugs2[0].expiresIn).toEqual(10);
      expect(updatedDrugs2[0].benefit).toEqual(20);
    });
  });

  describe("Fervex", () => {
    it("should increase the benefit of Fervex by 1 when more than 10 days remain", () => {
      const drug = new Drug("Fervex", 11, 20);
      const pharmacy = new Pharmacy([drug]);
      const updatedDrugs = pharmacy.updateBenefitValue();
      expect(updatedDrugs).toEqual([new Drug("Fervex", 10, 21)]);
    });

    it("should increase the benefit of Fervex by 2 when 10 days or less remain", () => {
      const drug = new Drug("Fervex", 10, 20);
      const pharmacy = new Pharmacy([drug]);
      const updatedDrugs = pharmacy.updateBenefitValue();
      expect(updatedDrugs).toEqual([new Drug("Fervex", 9, 22)]);
    });

    it("should increase the benefit of Fervex by 3 when 5 days or less remain", () => {
      const drug = new Drug("Fervex", 5, 20);
      const pharmacy = new Pharmacy([drug]);
      const updatedDrugs = pharmacy.updateBenefitValue();
      expect(updatedDrugs).toEqual([new Drug("Fervex", 4, 23)]); // benefit increases by 3
    });

    it("should drop the benefit of Fervex to 0 after expiration date", () => {
      const drug = new Drug("Fervex", 0, 20);
      const pharmacy = new Pharmacy([drug]);
      const updatedDrugs = pharmacy.updateBenefitValue();
      expect(updatedDrugs).toEqual([new Drug("Fervex", -1, 0)]); // benefit drops to 0
    });

    it("should not increase the benefit of Fervex beyond 50", () => {
      const drug = new Drug("Fervex", 5, 49);
      const pharmacy = new Pharmacy([drug]);
      const updatedDrugs = pharmacy.updateBenefitValue();
      expect(updatedDrugs[0].benefit).toBeLessThanOrEqual(50);
    });
  });

  describe("Dafalgan", () => {
    it("should decrease the benefit of Dafalgan by 2 when not expired", () => {
      const drug = new Drug("Dafalgan", 10, 20);
      const pharmacy = new Pharmacy([drug]);
      const updatedDrugs = pharmacy.updateBenefitValue();
      expect(updatedDrugs).toEqual([new Drug("Dafalgan", 9, 18)]);
    });

    it("should decrease the benefit of Dafalgan by 4 when expired", () => {
      const drug = new Drug("Dafalgan", 0, 20);
      const pharmacy = new Pharmacy([drug]);
      const updatedDrugs = pharmacy.updateBenefitValue();
      expect(updatedDrugs).toEqual([new Drug("Dafalgan", -1, 16)]);
    });

    it("should not decrease the benefit of Dafalgan below 0", () => {
      const drug = new Drug("Dafalgan", 10, 1);
      const pharmacy = new Pharmacy([drug]);
      const updatedDrugs = pharmacy.updateBenefitValue();
      expect(updatedDrugs[0].benefit).toBeGreaterThanOrEqual(0);
    });

    it("should not decrease the benefit of Dafalgan below 0 when expired", () => {
      const drug = new Drug("Dafalgan", 0, 3);
      const pharmacy = new Pharmacy([drug]);
      const updatedDrugs = pharmacy.updateBenefitValue();
      expect(updatedDrugs[0].benefit).toBeGreaterThanOrEqual(0);
    });
  });
});
