import {
  Drug,
  Pharmacy,
  PharmacyRefactored,
  PharmacyOop,
  HerbalTea,
  MagicPill,
  Fervex,
  Dafalgan,
} from "./pharmacy";
import { createLog } from "./createLog";
import fs from "fs";

function testsForPharmacy(createPharmacy, createDrug) {
  return () => {
    it("should decrease the benefit and expiresIn", () => {
      const drugs = [createDrug("test", 2, 3)];
      const expectedDrugs = [createDrug("test", 1, 2)];
      expect(createPharmacy(drugs).updateBenefitValue()).toEqual(expectedDrugs);
    });

    it("should decrease the benefit twice as fast after expiration date", () => {
      const drug = createDrug("test", 0, 10); // the drug just expired
      const pharmacy = createPharmacy([drug]);
      const updatedDrugs = pharmacy.updateBenefitValue();
      expect(updatedDrugs).toEqual([createDrug("test", -1, 8)]); // the drug lost 2 points of benefit
    });

    it("should never have a negative benefit value", () => {
      const drug = createDrug("test", 0, 0);
      const pharmacy = createPharmacy([drug]);
      const updatedDrugs = pharmacy.updateBenefitValue();
      expect(updatedDrugs[0].benefit).toBeGreaterThanOrEqual(0);
    });

    it("should never have a benefit value greater than 50", () => {
      const drug = createDrug("test", 100, 50);
      const pharmacy = createPharmacy([drug]);
      const updatedDrugs = pharmacy.updateBenefitValue();
      expect(updatedDrugs[0].benefit).toBeLessThanOrEqual(50);
    });

    it("should produce the same output as the one stored in output-model.json", () => {
      // Create a new pharmacy with the same initial drugs as in index.js
      const drugs = [
        createDrug("Doliprane", 20, 30),
        createDrug("Herbal Tea", 10, 5),
        createDrug("Fervex", 12, 35),
        createDrug("Magic Pill", 15, 40),
      ];
      const pharmacy = createPharmacy(drugs);

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
        const drug = createDrug("Herbal Tea", 2, 10);
        const pharmacy = createPharmacy([drug]);
        const updatedDrugs = pharmacy.updateBenefitValue();
        expect(updatedDrugs).toEqual([createDrug("Herbal Tea", 1, 11)]); // benefit increases by 1
      });

      it("should increase the benefit of Herbal Tea twice as fast after expiration date", () => {
        const drug = createDrug("Herbal Tea", 0, 10); // the drug just expired
        const pharmacy = createPharmacy([drug]);
        const updatedDrugs = pharmacy.updateBenefitValue();
        expect(updatedDrugs).toEqual([createDrug("Herbal Tea", -1, 12)]); // benefit increases by 2
      });

      it("should not increase the benefit of Herbal Tea beyond 50", () => {
        const drug = createDrug("Herbal Tea", 0, 49); // expired with benefit near max
        const pharmacy = createPharmacy([drug]);
        const updatedDrugs = pharmacy.updateBenefitValue();
        expect(updatedDrugs[0].benefit).toBeLessThanOrEqual(50);
      });
    });

    describe("Magic Pill", () => {
      it("should never decrease the expiresIn and benefit value of Magic Pill", () => {
        const drug = createDrug("Magic Pill", 10, 20);
        const pharmacy = createPharmacy([drug]);
        const updatedDrugs = pharmacy.updateBenefitValue();
        expect(updatedDrugs[0].expiresIn).toEqual(10);
        expect(updatedDrugs[0].benefit).toEqual(20);
        const updatedDrugs2 = pharmacy.updateBenefitValue();
        expect(updatedDrugs2[0].expiresIn).toEqual(10);
        expect(updatedDrugs2[0].benefit).toEqual(20);
      });

      it("should never decrease the expiresIn and benefit value of Magic Pill even if it is below 0", () => {
        const drug = createDrug("Magic Pill", 10, -1);
        const pharmacy = createPharmacy([drug]);
        const updatedDrugs = pharmacy.updateBenefitValue();
        expect(updatedDrugs[0].expiresIn).toEqual(10);
        expect(updatedDrugs[0].benefit).toEqual(-1);
      });

      it("should never decrease the expiresIn and benefit value of Magic Pill even if it is above 50", () => {
        const drug = createDrug("Magic Pill", 10, 60);
        const pharmacy = createPharmacy([drug]);
        const updatedDrugs = pharmacy.updateBenefitValue();
        expect(updatedDrugs[0].expiresIn).toEqual(10);
        expect(updatedDrugs[0].benefit).toEqual(60);
      });
    });

    describe("Fervex", () => {
      it("should increase the benefit of Fervex by 1 when more than 10 days remain", () => {
        const drug = createDrug("Fervex", 11, 20);
        const pharmacy = createPharmacy([drug]);
        const updatedDrugs = pharmacy.updateBenefitValue();
        expect(updatedDrugs).toEqual([createDrug("Fervex", 10, 21)]);
      });

      it("should increase the benefit of Fervex by 2 when 10 days or less remain", () => {
        const drug = createDrug("Fervex", 10, 20);
        const pharmacy = createPharmacy([drug]);
        const updatedDrugs = pharmacy.updateBenefitValue();
        expect(updatedDrugs).toEqual([createDrug("Fervex", 9, 22)]);
      });

      it("should increase the benefit of Fervex by 3 when 5 days or less remain", () => {
        const drug = createDrug("Fervex", 5, 20);
        const pharmacy = createPharmacy([drug]);
        const updatedDrugs = pharmacy.updateBenefitValue();
        expect(updatedDrugs).toEqual([createDrug("Fervex", 4, 23)]); // benefit increases by 3
      });

      it("should drop the benefit of Fervex to 0 after expiration date", () => {
        const drug = createDrug("Fervex", 0, 20);
        const pharmacy = createPharmacy([drug]);
        const updatedDrugs = pharmacy.updateBenefitValue();
        expect(updatedDrugs).toEqual([createDrug("Fervex", -1, 0)]); // benefit drops to 0
      });

      it("should not increase the benefit of Fervex beyond 50", () => {
        const drug = createDrug("Fervex", 5, 49);
        const pharmacy = createPharmacy([drug]);
        const updatedDrugs = pharmacy.updateBenefitValue();
        expect(updatedDrugs[0].benefit).toBeLessThanOrEqual(50);
      });
    });

    describe("Dafalgan", () => {
      it("should decrease the benefit of Dafalgan by 2 when not expired", () => {
        const drug = createDrug("Dafalgan", 10, 20);
        const pharmacy = createPharmacy([drug]);
        const updatedDrugs = pharmacy.updateBenefitValue();
        expect(updatedDrugs).toEqual([createDrug("Dafalgan", 9, 18)]);
      });

      it("should decrease the benefit of Dafalgan by 4 when expired", () => {
        const drug = createDrug("Dafalgan", 0, 20);
        const pharmacy = createPharmacy([drug]);
        const updatedDrugs = pharmacy.updateBenefitValue();
        expect(updatedDrugs).toEqual([createDrug("Dafalgan", -1, 16)]);
      });

      it("should not decrease the benefit of Dafalgan below 0", () => {
        const drug = createDrug("Dafalgan", 10, 1);
        const pharmacy = createPharmacy([drug]);
        const updatedDrugs = pharmacy.updateBenefitValue();
        expect(updatedDrugs[0].benefit).toBeGreaterThanOrEqual(0);
      });

      it("should not decrease the benefit of Dafalgan below 0 when expired", () => {
        const drug = createDrug("Dafalgan", 0, 3);
        const pharmacy = createPharmacy([drug]);
        const updatedDrugs = pharmacy.updateBenefitValue();
        expect(updatedDrugs[0].benefit).toBeGreaterThanOrEqual(0);
      });
    });
  };
}

describe("All type of pharmacies", () => {
  const createDrugProcedural = (name, expiresIn, benefit) =>
    new Drug(name, expiresIn, benefit);

  const createPharmacyNormal = (drugs) => new Pharmacy(drugs);
  describe(
    "Pharmacy",
    testsForPharmacy(createPharmacyNormal, createDrugProcedural),
  );

  const createPharmacyRefactored = (drugs) => new PharmacyRefactored(drugs);
  describe(
    "PharmacyRefactored",
    testsForPharmacy(createPharmacyRefactored, createDrugProcedural),
  );

  const createDrugOop = (name, expiresIn, benefit) => {
    if (name === "Herbal Tea") return new HerbalTea(expiresIn, benefit);
    if (name === "Magic Pill") return new MagicPill(expiresIn, benefit);
    if (name === "Fervex") return new Fervex(expiresIn, benefit);
    if (name === "Dafalgan") return new Dafalgan(expiresIn, benefit);
    return new Drug(name, expiresIn, benefit);
  };
  const createPharmacyOop = (drugs) => new PharmacyOop(drugs);
  describe("PharmacyOop", testsForPharmacy(createPharmacyOop, createDrugOop));
});
