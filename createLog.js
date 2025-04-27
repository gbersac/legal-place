export function createLog(pharmacy) {
  const log = [];
  for (let elapsedDays = 0; elapsedDays < 30; elapsedDays++) {
    log.push(JSON.parse(JSON.stringify(pharmacy.updateBenefitValue())));
  }
  return log;
}
