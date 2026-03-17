import { CalculatorMatrix, CalculatorMatrixUF, CustomerProfile, ICalculateHiringCostsParams, ICalculateHiringCostsResult, ICalculateRecurringSalesPriceResul, ICalculatorMatrixData, IValidedSingleCircuitResult, ValueInProposalType } from "./CalculatorMatrix";

//#region Interfaces
interface ICalculateHiringCostsParamsExtend extends Omit<ICalculateHiringCostsParams, 'linkQtd'> {
  linkQtd?: number
}
interface ICalculateHiringCostsResultExtend extends Omit<ICalculateHiringCostsResult, 'monthlyGrossWithTax'> {}
interface ICalcAverageEventualParams {
  grossPriceTotal: number;
  linkQtd:          number;
  eventualMargin:   number;
  eventualOH:       number;
};
interface ICalcAverageValueParams {
  customerProfile?: CustomerProfile;
  grossPriceTotal: number;
  recurringMargin: number;          
  icmsArion: number;                
  linkQtd: number;                  
  monthlyCostCancellationPenalty: number;
  icms: number;
  recurringOH: number;
};
export interface IHeaderParams{
  cnpj: string;
  ohAppellantProperty: number;
  ohEventualProperty: number;
  recurringMarginProperty: number;
  eventualMarginProperty: number;
  hasCotepeActProperty: string;
  contractTermProperty: number;
  customerProfile: string;
}
//#endregion

//#region Constants
export const returnErrorValidedSingleCircuit: IValidedSingleCircuitResult = {
  hiringCosts: {
    monthlyRecoveryICMS: 0,
    monthlyCostsWithOverhead: 0,
    possibleOverheadCosts: 0,
    monthlyGrossWithTax: 0
  },
  recurringSalesPrice: {
    grossPriceTotal: 0,
    grossPriceTotalCotepe: 0,
    grossPriceUnit: 0,
    grossPriceUnitCotepe: 0,
    netPriceTotal: 0,
    netPriceTotalCotepe: 0,
    netPriceUnit: 0,
    netPriceUnitCotepe: 0,
    marginOfError: 0
  },
  eventualSalePriceOrInstallationFee: {
    grossPriceTotal: 0,
    grossPriceUnit: 0,
    netPriceTotal: 0,
    netPriceUnit: 0,
    marginOfError: 0
  },
  margin: {
    eventual: 0,
    recurring: 0
  },
  marginRecurring: 0,
  marginEventual: 0,
  linkQtd: 0,
  monthly_fee_margin_of_error: 0,
  installation_fee_margin_of_error: 0,
};
//#endregion

//#region Functions
export function convertDecimals(value: number) {
  return parseFloat(value.toFixed(2))
}
export function calculateHiringCosts({ linkQtd, recurringUnitCostWithTax, unitCostInstallationWithTax, monthlyCostCancellationPenalty, icms, recurringOH, eventualOH  }: ICalculateHiringCostsParamsExtend): ICalculateHiringCostsResultExtend {
  /** Recuperação mensal de ICMS */
  let monthlyRecoveryICMS = 0;
  /** Mensal bruto com impostos */
  let monthlyGrossWithTax = 0;
  /** Custo mensal com overhead */
  let monthlyCostsWithOverhead = 0;
  /** Custo eventual com everhead */
  const possibleOverheadCosts = unitCostInstallationWithTax * (1 + eventualOH);

  if (recurringUnitCostWithTax) {
    monthlyGrossWithTax = recurringUnitCostWithTax * (linkQtd ?? 1) + (monthlyCostCancellationPenalty * (linkQtd ?? 1));
    monthlyRecoveryICMS = (monthlyGrossWithTax - monthlyCostCancellationPenalty) * icms;
    monthlyCostsWithOverhead = (monthlyGrossWithTax - monthlyRecoveryICMS) * (1 + recurringOH);
  }

  return {
    monthlyRecoveryICMS: convertDecimals(monthlyRecoveryICMS),
    monthlyCostsWithOverhead: convertDecimals(monthlyCostsWithOverhead),
    possibleOverheadCosts: convertDecimals(possibleOverheadCosts)
  }
}
export function calculateGrossPriceFromNetPrice({ customerProfile, netPriceTotal, icmsArion }: {
  netPriceTotal: number,
  icmsArion: number,
  customerProfile: string
}): number {
  if (icmsArion < 0 || icmsArion >= 1) {
    throw new Error('icmsArion deve ser uma fração entre 0 (inclusive) e 1 (ex.: 18% -> 0.18).');
  }

  if (customerProfile === 'Corporativo') {
    const coef = 0.5698785 * (1 - icmsArion) + 0.343;
    if (coef === 0) throw new Error('Coeficiente zero para Corporativo. Verifique icmsArion.');
    return netPriceTotal / coef;
  }

  if (customerProfile === 'Operadora') {
    const coef = (1 - icmsArion) * 0.9635;
    if (coef === 0) throw new Error('Coeficiente zero para Operadora. Verifique icmsArion.');
    return netPriceTotal / coef;
  }

  throw new Error('Perfil de cliente inválido.');
}
export function calculatenetPriceFromCotepeNetPriceCotepe({ currentNetPriceUnit, currentNetPriceCotepe, target_monthly_fee }: {
  currentNetPriceUnit: number,
  currentNetPriceCotepe: number,
  target_monthly_fee: number
}): number {
  if(currentNetPriceUnit <= 0 && currentNetPriceCotepe <= 0) return 0;
  // pegar o percentual de diferença entre o valor bruto e o ato cotepe
  const diffGrossPrince = currentNetPriceUnit - currentNetPriceCotepe;
  let percent = currentNetPriceCotepe ? (diffGrossPrince * 100) / currentNetPriceCotepe : 0;
  // a partir do ato cotepe chegar no valor bruto pela margem, ato cotepe + percentual = valor bruto (grossPriceUnit)
  const netPriceUnitCotepe = target_monthly_fee;
  const netPriceUnit = netPriceUnitCotepe + (netPriceUnitCotepe * percent / 100);
  return netPriceUnit;
}
export function getGrossMonthlyFromTarget(params: {
  targetMonthlyFee: number;
  valueInProposal: ValueInProposalType;
  customerProfile: CustomerProfile;
  icmsArion?: number;
  recurringSalesPrice: ICalculateRecurringSalesPriceResul
}) {
  const {
    targetMonthlyFee,
    valueInProposal,
    customerProfile,
    icmsArion,
    recurringSalesPrice,
  } = params;

  if (valueInProposal === 'gross' || valueInProposal === 'gross_cotepe') {
    return targetMonthlyFee ?? 0;
  }
  
  if (valueInProposal === 'net') {
    return calculateGrossPriceFromNetPrice({
      customerProfile,
      netPriceTotal: targetMonthlyFee ?? 0,
      icmsArion: icmsArion ?? 0,
    });
  }

  if (valueInProposal === 'net_cotepe') {
    const netPriceUnitMonthly = calculatenetPriceFromCotepeNetPriceCotepe({
      currentNetPriceCotepe: recurringSalesPrice.netPriceUnitCotepe,
      currentNetPriceUnit: recurringSalesPrice.netPriceUnit,
      target_monthly_fee: targetMonthlyFee ?? 0,
    });
    if (netPriceUnitMonthly <= 0) return targetMonthlyFee;

    return calculateGrossPriceFromNetPrice({
      customerProfile,
      netPriceTotal: netPriceUnitMonthly,
      icmsArion: icmsArion ?? 0,
    });
  }

  return 0;
}
export function getGrossInstallationFromTarget(params: {
  targetInstallationFee: number;
  valueInProposal: ValueInProposalType;
}) {
  const { targetInstallationFee, valueInProposal } = params;
  const netTax = 0.05 + 0.076 + 0.0165;

  if (valueInProposal === 'gross' || valueInProposal === 'gross_cotepe') {
    return targetInstallationFee ?? 0;
  }

  const netPriceUnit = targetInstallationFee ?? 0;
  return netPriceUnit / (1 - netTax);
}
export function calcEventualUnitCostWithTax(params: ICalcAverageEventualParams): number {
  const {
    grossPriceTotal,
    linkQtd,
    eventualMargin,
    eventualOH
  } = params;

  const marginBlock  = eventualMargin + 0.05 + 0.076 + 0.0165;
  const denomMargin  = (1 - marginBlock);
  const denomOH      = 1 + eventualOH;

  return (grossPriceTotal / linkQtd) * (denomMargin / denomOH);
}
export function calcRecurringUnitCostWithTax(params: ICalcAverageValueParams): number {
  const {
    grossPriceTotal,
    recurringMargin,
    icmsArion,
    linkQtd,
    monthlyCostCancellationPenalty,
    icms,
    recurringOH,
    customerProfile,
  } = params;

  let final_denominator = 0;

  /** PIS e COFINS sem ATO COTEPE */
  const pisCofins = 0.0365; // 0.02993;
  if(customerProfile === 'Operadora') final_denominator = (1 - (recurringMargin + icmsArion + pisCofins))
  else if(customerProfile === 'Corporativo') final_denominator = (1 - (recurringMargin + icmsArion + 0.01007))

  const partial = grossPriceTotal * final_denominator;

  const afterOH = partial / (linkQtd * (1 + recurringOH));

  const withoutPenalty = afterOH - monthlyCostCancellationPenalty;

  return withoutPenalty / (1 - icms);
}
export function calculateGrossPriceFromCotepeMonthlyFee({ currentGrossPriceUnit, currentGrossPriceCotepe, target_monthly_fee }: {
  currentGrossPriceUnit: number,
  currentGrossPriceCotepe: number,
  target_monthly_fee: number
}): number {
  if(currentGrossPriceCotepe <= 0 && currentGrossPriceUnit <= 0) return 0;
  // pegar o percentual de diferença entre o valor bruto e o ato cotepe
  const diffGrossPrince = currentGrossPriceUnit - currentGrossPriceCotepe;
  let percent = currentGrossPriceCotepe ? (diffGrossPrince * 100) / currentGrossPriceCotepe : 0;
  // a partir do ato cotepe chegar no valor bruto pela margem, ato cotepe + percentual = valor bruto (grossPriceUnit)
  const grossPriceUnitCotepe = target_monthly_fee;
  const grossPriceUnit = grossPriceUnitCotepe + (grossPriceUnitCotepe * percent / 100);
  return grossPriceUnit;
}
export const roundDecimalFloor = (value: number) => (Math.floor((value) * 100) / 100)
//#endregion