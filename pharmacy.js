export class Drug {
  constructor(name, expiresIn, benefit) {
    this.name = name;
    this.expiresIn = expiresIn;
    this.benefit = benefit;
  }

  isExpired() {
    return this.expiresIn < 0;
  }

  fixBenefit() {
    if (this.benefit < 0) {
      this.benefit = 0;
    }
    if (this.benefit > 50) {
      this.benefit = 50;
    }
  }

  passOneDay() {
    this.expiresIn -= 1;
    this.benefit -= this.expiresIn < 0 ? 2 : 1;
    this.fixBenefit();
  }
}

export class Pharmacy {
  constructor(drugs = []) {
    this.drugs = drugs;
  }
  updateBenefitValue() {
    for (var i = 0; i < this.drugs.length; i++) {
      if (
        this.drugs[i].name != "Herbal Tea" &&
        this.drugs[i].name != "Fervex"
      ) {
        if (this.drugs[i].benefit > 0) {
          if (this.drugs[i].name === "Dafalgan") {
            this.drugs[i].benefit = this.drugs[i].benefit - 2;
          } else if (this.drugs[i].name != "Magic Pill") {
            this.drugs[i].benefit = this.drugs[i].benefit - 1;
          }
        }
      } else {
        if (this.drugs[i].benefit < 50) {
          this.drugs[i].benefit = this.drugs[i].benefit + 1;
          if (this.drugs[i].name == "Fervex") {
            if (this.drugs[i].expiresIn < 11) {
              if (this.drugs[i].benefit < 50) {
                this.drugs[i].benefit = this.drugs[i].benefit + 1;
              }
            }
            if (this.drugs[i].expiresIn < 6) {
              if (this.drugs[i].benefit < 50) {
                this.drugs[i].benefit = this.drugs[i].benefit + 1;
              }
            }
          }
        }
      }

      if (this.drugs[i].name != "Magic Pill") {
        this.drugs[i].expiresIn = this.drugs[i].expiresIn - 1;
      }

      if (this.drugs[i].expiresIn < 0) {
        if (this.drugs[i].name != "Herbal Tea") {
          if (this.drugs[i].name != "Fervex") {
            if (this.drugs[i].benefit > 0) {
              if (this.drugs[i].name === "Dafalgan") {
                this.drugs[i].benefit = this.drugs[i].benefit - 2;
                if (this.drugs[i].benefit < 0) {
                  this.drugs[i].benefit = 0;
                }
              } else if (this.drugs[i].name != "Magic Pill") {
                this.drugs[i].benefit = this.drugs[i].benefit - 1;
              }
            }
          } else {
            this.drugs[i].benefit =
              this.drugs[i].benefit - this.drugs[i].benefit;
          }
        } else {
          if (this.drugs[i].benefit < 50) {
            this.drugs[i].benefit = this.drugs[i].benefit + 1;
          }
        }
      }

      if (this.drugs[i].benefit < 0) {
        this.drugs[i].benefit = 0;
      }
    }

    return this.drugs;
  }
}

export class PharmacyRefactored extends Pharmacy {
  constructor(drugs) {
    super(drugs);
  }

  updateBenefitValue() {
    this.drugs = this.drugs.map((drug) => {
      if (drug.name === "Magic Pill") {
        return drug;
      }

      drug.expiresIn -= 1;
      const isExpired = drug.expiresIn < 0;
      if (drug.name === "Herbal Tea") {
        drug.benefit += isExpired ? 2 : 1;
      } else if (drug.name === "Fervex") {
        if (isExpired) {
          drug.benefit = 0;
        } else if (drug.expiresIn < 5) {
          drug.benefit += 3;
        } else if (drug.expiresIn < 10) {
          drug.benefit += 2;
        } else {
          drug.benefit += 1;
        }
      } else if (drug.name === "Dafalgan") {
        drug.benefit -= isExpired ? 4 : 2;
      } else {
        drug.benefit -= isExpired ? 2 : 1;
      }

      // guard checks
      if (drug.benefit < 0) {
        drug.benefit = 0;
      }
      if (drug.benefit > 50) {
        drug.benefit = 50;
      }

      return drug;
    });

    return this.drugs;
  }
}

export class HerbalTea extends Drug {
  constructor(expiresIn, benefit) {
    super("Herbal Tea", expiresIn, benefit);
  }

  passOneDay() {
    this.expiresIn -= 1;
    this.benefit += this.isExpired() ? 2 : 1;
    super.fixBenefit();
  }
}

export class MagicPill extends Drug {
  constructor(expiresIn, benefit) {
    super("Magic Pill", expiresIn, benefit);
  }

  passOneDay() {
    super.fixBenefit();
  }
}

export class Fervex extends Drug {
  constructor(expiresIn, benefit) {
    super("Fervex", expiresIn, benefit);
  }

  passOneDay() {
    this.expiresIn -= 1;
    if (this.isExpired()) {
      this.benefit = 0;
    } else if (this.expiresIn < 5) {
      this.benefit += 3;
    } else if (this.expiresIn < 10) {
      this.benefit += 2;
    } else {
      this.benefit += 1;
    }
    super.fixBenefit();
  }
}

export class Dafalgan extends Drug {
  constructor(expiresIn, benefit) {
    super("Magic Pill", expiresIn, benefit);
  }

  passOneDay() {
    this.expiresIn -= 1;
    this.benefit -= this.isExpired() ? 4 : 2;
    super.fixBenefit();
  }
}

/** Oop stands for Object Oriented Programming */
export class PharmacyOop extends Pharmacy {
  constructor(drugs) {
    super(drugs);
  }

  updateBenefitValue() {
    this.drugs = this.drugs.map((drug) => {
      drug.passOneDay();
      return drug;
    });
    return this.drugs;
  }
}
