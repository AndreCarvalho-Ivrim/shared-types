//#region TYPES
interface ValidateDataParams {
  circuits: Record<string, any>[];
}
export interface ICircuit {
  code: string;
  speed: string;
  address_a: string;
  municipality_a: string;
  uf_a: string;
  cnl: string;
  latitude_a: string;
  longitude_a: string;
  installation_fee: number;
  monthly_fee: number;
  own_network: string;
  product: string;
  cep_a: string;
  uf_b: string;
  municipality_b: string;
  address_b: string;
  cep_b: string;
  latitude_b: string;
  longitude_B: string;
  term: number;
  unit_of_measure: string;
  sla: string;
  interface: string;
  connector_type: string;
  type_of_protection: string;
  activation_deadline?: string;
  twelve_months_net?: number;
  twelve_months_net_rate?: number;
  twenty_four_months_net?: number;
  twenty_four_months_net_rate?: number;
  thirty_six_months_net?: number;
  thirty_six_months_net_rate?: number;
  forty_eight_months_net?: number;
  forty_eight_months_net_rate?: number;
  sixty_months_net?: number;
  sixty_months_net_rate?: number;
  observations?: string;
  margin_recurring?: number;
  margin_eventual?: number;
}
export type ContractDeadline = 12 | 24 | 36 | 48 | 60 | 72;
export type CustomerProfile = 'Operadora' | 'Corporativo';
export type CalculatorMatrixUF = 'AC' | 'AL' | 'AP' | 'AM' | 'BA' | 'CE' | 'DF' | 'ES' | 'GO' | 'MA' | 'MT' | 'MS' | 'MG' | 'PA' | 'PB' | 'PR' | 'PE' | 'PI' | 'RJ' | 'RN' | 'RS' | 'RO' | 'RR' | 'SC' | 'SP' | 'SE' | 'TO';
export type CalculatorMatrixICMSByUF = Record<CalculatorMatrixUF, any>;
export type CalculatorMatrixUFLinkQtdByUF = Record<CalculatorMatrixUF, any>;
export interface ICalculatorMatrixData {
  /** Perfil do cliente */
  customerProfile?: CustomerProfile;
  /** Ato COTEPE */
  cotepeAct?: boolean;
  /** OH recorrente */
  recurringOH: number;
  /** OH eventual */
  eventualOH: number;
  /** Margem recorrente */
  recurringMargin: number;
  /** Margem eventual */
  eventualMargin: number;
  /** ICMS da CNPJ da Arion */
  icmsArion: number;
  /** Alíquota do ICMS por UF */
  icmsByUF: CalculatorMatrixICMSByUF;
  /** SIGLA DO ESTADO */
  uf: CalculatorMatrixUF;
  /** Velocidade da internet */
  speed: string;
  /** Operadora Contratada */
  operator?: string;
  /** Mensalidade */
  monthlyFee: number;
  /** Instalação */
  installationFee: number;
  /** Quantidade de links por estado e velocidade */
  linkQtdByUF: CalculatorMatrixUFLinkQtdByUF;
  /** Multa por cancelamento */
  costCancellationPenalty?: number;
}
export interface ICalculateTotalParams {
  totalRecurring: number;
  totalEventual: number;
  contractDeadline: ContractDeadline;
  marginRecurringTotal: number;
  marginEventualTotal: number;
  recurringSalesPriceGrossTotal: number;
}
export interface ICalculateTotalResult {
  totalProposal: number;
  totalContract: number;
  marginRecurringPercentual: number;
  marginEventualTotalPercentual: number;
  marginContractTotal: number;
  marginContractTotalPercentual: number;
}
export interface ICalculateHiringCostsParams {
  /** Quantidade de Links: links de circuito por município e velocidade */
  linkQtd: number;
  /** Custo unitário recorrente com impostos */
  recurringUnitCostWithTax: number;
  /** Custo unitário da instalação com impostos */
  unitCostInstallationWithTax: number;
  /** Custo mensal da multa por cancelamento */
  monthlyCostCancellationPenalty: number;
  /** ICMS por região  */
  icms: number;
  /** OH recorrente */
  recurringOH: number; 
  /** OH eventual */
  eventualOH: number;
}
export interface ICalculateHiringCostsResult {
  /** Recuperação Mensal de ICMS */
  monthlyRecoveryICMS: number;
  /** Mensal Bruto c/ Impostos */
  monthlyGrossWithTax: number;
  /** Custo Mensal c/ Overhead */
  monthlyCostsWithOverhead: number;
  /** Custo Eventual c/ Overhead */
  possibleOverheadCosts: number;
}
export interface ICalculateRecurringSalesPriceFullAndPercentualParams {
  /** Quantidade de Links: links de circuito por município e velocidade */
  linkQtd: number;
  /** Custo unitário recorrente com impostos */
  recurringUnitCostWithTax: number;
  /** Custo Mensal com Overhead */
  monthlyCostsWithOverhead: number;
  /** Margem Recorrente */
  recurringMargin: number;
  /** ICMS da filial da Arion */
  icmsArion: number;
}
export interface ICalculateBaseResult {
  /** Preço Líquido Unitário */
  netPriceUnit: number;
  /** Preço Líquido Total */
  netPriceTotal: number;
  /** Preço Bruto Unitário */
  grossPriceUnit: number;
  /** Preço Bruto Total */
  grossPriceTotal: number;
}
export interface ICalculateRecurringSalesPriceWithPercentualResult extends ICalculateBaseResult {
  /** Telecom 60% */
  telecom: number;
  /** Serviço 40% */
  service: number;
} 
export interface ICalculateRecurringSalesPriceParams {
  /** Perfil do Cliente */
  customerProfile?: CustomerProfile;
  /** Custos de Contratação > Recuperação Mensal de ICMS */
  monthlyRecoveryICMS: number;
  /** Preço de venda recorrente 100% */
  recurringSalesPriceFull: ICalculateBaseResult;
  /** Preço de venda recorrente 60%-40% */
  recurringSalesPriceWithPercentual: ICalculateRecurringSalesPriceWithPercentualResult;
  /** ICMS da filial da Arion */
  icmsArion: number;
}
export interface ICalculateRecurringSalesPriceResul extends ICalculateBaseResult {
  /** Bruto (ATO COTEPE) Unitário */
  grossPriceUnitCotepe: number;
  /** Bruto (ATO COTEPE) Total */
  grossPriceTotalCotepe: number;
}
export interface ICalculateEventualSalePriceOrInstallationFeeParams {
  /** Quantidade de Links */
  linkQtd: number;
  /** Recuperação Mensal de ICMS */
  monthlyRecoveryICMS: number;
  /** Custo Eventual com Overhead */
  possibleOverheadCosts: number;
  /** Margem Eventual */
  eventualMargin: number;
}
export interface ICalculateMarginParams {
  /** Quantidade de Links */
  linkQtd: number;
  hiringCosts: any;
  recurringSalesPrice: ICalculateRecurringSalesPriceResul;
  eventualSalePriceOrInstallationFee: ICalculateBaseResult;
}
export interface ICalculateMarginResult {
  /** Margem Recorrente */
  recurring: number;
  /** Margem Eventual */
  eventual: number;
}
//#endregion

export class CalculatorMatrix {
  static execute(data: ICalculatorMatrixData) {
    const {
      operator,
      customerProfile,
      cotepeAct,
      recurringOH,
      eventualOH,
      recurringMargin,
      eventualMargin,
      icmsArion,
      icmsByUF,
      uf,
      speed,
      monthlyFee,
      installationFee,
      linkQtdByUF,
      costCancellationPenalty
    } = data;
    const monthly_fee = monthlyFee;
    const installation_fee = installationFee;

    if (!monthly_fee || !installation_fee) throw new Error('Existem circuitos sem mensalidade ou taxa de instalação');

    // Validação da célula F2 da planilha
    // [ ] COLOCAR UMA VALIDAÇÃO PARA ISSO NO FLOW DATA, PORQUE O GRUPO "PREÇO DE VENDA RECORRENTE" E "PREÇO DE VENDA EVENTUAL OU TAXA DE INSTALAÇÃO VALIDAM POR ESSE CAMPO"
    if (customerProfile === 'Corporativo' && !!cotepeAct && String(cotepeAct) === 'true') throw new Error('Favor alterar ATO COTEPE para NÃO');

    /** Quantidade de Links */
    const linkQtd = linkQtdByUF[uf][speed.toLowerCase()] ?? 1;
    /** Custo unitário recorrente com impostos */
    const recurringUnitCostWithTax = monthly_fee;
    /** Custo unitário da instalação com impostos */
    const unitCostInstallationWithTax = installation_fee;
    /** Custo mensal da multa por cancelamento */
    const monthlyCostCancellationPenalty = costCancellationPenalty ?? 0;
    /** ICMS da Operadora Contratada. Buscar o ICMS referente a empresa na planilha */
    // [ ] Puxar o ICMS por região
    let icms = null;
    if (icmsByUF[uf]) {
      if (
        operator && icmsByUF[uf]['operators'] &&
        icmsByUF[uf]['operators'][operator] >= 0
      ) icms = icmsByUF[uf]['operators'][operator] / 100;
      else icms = icmsByUF[uf];
    } 
    if (!icms && icms !== 0) throw new Error(`A alíquota do estado ${uf} não está cadastrada`);

    /** Custos de contratação */
    const hiringCosts = this.calculateHiringCosts({ linkQtd, recurringUnitCostWithTax, unitCostInstallationWithTax, monthlyCostCancellationPenalty, icms, recurringOH, eventualOH });
    /** Preço de venda recorrente 100% */
    const recurringSalesPriceFull = this.calculateRecurringSalesPriceFull({
      recurringUnitCostWithTax,
      linkQtd,
      monthlyCostsWithOverhead: hiringCosts.monthlyCostsWithOverhead,
      recurringMargin,
      icmsArion,
    });
    /** Preço de venda recorrente 60%-40% */
    const recurringSalesPriceWithPercentual = this.calculateRecurringSalesPriceWithPercentual({
      recurringUnitCostWithTax,
      linkQtd,
      monthlyCostsWithOverhead: hiringCosts.monthlyCostsWithOverhead,
      recurringMargin,
      icmsArion,
    });
    /** Preço de venda recorrente */
    const recurringSalesPrice = this.calculateRecurringSalesPrice({
      customerProfile,
      monthlyRecoveryICMS: hiringCosts.monthlyRecoveryICMS,
      recurringSalesPriceFull,
      recurringSalesPriceWithPercentual,
      icmsArion
    });
    /** Preço de Venda Eventual ou Taxa de Instalação */
    const eventualSalePriceOrInstallationFee = this.calculateEventualSalePriceOrInstallationFee({
      monthlyRecoveryICMS: hiringCosts.monthlyRecoveryICMS,
      possibleOverheadCosts: hiringCosts.possibleOverheadCosts,
      eventualMargin,
      linkQtd,
    });
    /** Margem */
    const margin = this.calculateMargin({
      hiringCosts,
      recurringSalesPrice,
      eventualSalePriceOrInstallationFee,
      linkQtd,
    });

    const result = {
      hiringCosts,
      recurringSalesPriceFull,
      recurringSalesPriceWithPercentual,
      recurringSalesPrice,
      eventualSalePriceOrInstallationFee,
      margin,
      marginRecurring: margin.recurring,
      marginEventual: margin.eventual,
      linkQtd,
    };

    return result;
  }

  static getQuantityLinksByUFandSpeed(circuits: ICircuit[]) {
    const links: Record<string, any> = {};
    for (const circuit of circuits) {
      let uf = circuit.uf_a;
      if(!uf) {
        uf = this.getUFByAdress(circuit.address_a);
        circuit.uf_a = uf;
      };

      const monthly_fee = circuit.monthly_fee;
      const installation_fee = circuit.installation_fee;
      const speed = String(circuit.speed).toLowerCase();
      if (!monthly_fee || !installation_fee || !speed) continue;
  
      if (!links[uf]) links[uf] = { [speed]: 1 };
      else {
        if (!links[uf][speed]) links[uf][speed] = 1
        else links[uf][speed] += 1
      };
    }
    return links;
  }
  private static getUFByAdress(value: string) {
    const parts = value.split('. ');
    const part = parts.length > 1 ? parts[1] : parts[0]
    const uf = part.split(' - ')[1];
    if (!uf) throw new Error('Circuito não contém UF no endereço');
    return uf;
  }
  private static calculateHiringCosts({ linkQtd, recurringUnitCostWithTax, unitCostInstallationWithTax, monthlyCostCancellationPenalty, icms, recurringOH, eventualOH  }: ICalculateHiringCostsParams): ICalculateHiringCostsResult {
    /** Recuperação mensal de ICMS */
    let monthlyRecoveryICMS = 0;
    /** Mensal bruto com impostos */
    let monthlyGrossWithTax = 0;
    /** Custo mensal com overhead */
    let monthlyCostsWithOverhead = 0;
    /** Custo eventual com everhead */
    const possibleOverheadCosts = unitCostInstallationWithTax * (1 + eventualOH);
  
    if (recurringUnitCostWithTax) {
      monthlyGrossWithTax = recurringUnitCostWithTax * linkQtd + (monthlyCostCancellationPenalty * linkQtd);
      monthlyRecoveryICMS = (monthlyGrossWithTax - monthlyCostCancellationPenalty) * icms;
      monthlyCostsWithOverhead = (monthlyGrossWithTax - monthlyRecoveryICMS) * (1 + recurringOH);
    }
  
    return {
      monthlyRecoveryICMS: this.convertDecimals(monthlyRecoveryICMS),
      monthlyGrossWithTax: this.convertDecimals(monthlyGrossWithTax),
      monthlyCostsWithOverhead: this.convertDecimals(monthlyCostsWithOverhead),
      possibleOverheadCosts: this.convertDecimals(possibleOverheadCosts)
    }
  }
  private static calculateRecurringSalesPriceFull({
    recurringUnitCostWithTax,
    linkQtd,
    monthlyCostsWithOverhead,
    recurringMargin,
    icmsArion,
  }: ICalculateRecurringSalesPriceFullAndPercentualParams): ICalculateBaseResult {
    /** Bruto total */
    let grossPriceTotal = 0;
    /** Bruto unitário */
    let grossPriceUnit = 0;
    /** Líquido unitário */
    let netPriceUnit = 0;
    /** Líquido total */
    let netPriceTotal = 0;
    if (recurringUnitCostWithTax) {
      grossPriceTotal = monthlyCostsWithOverhead / (1 - (recurringMargin + icmsArion + 0.02993 + 0.011851))
      grossPriceUnit = grossPriceTotal / linkQtd;
      netPriceUnit = ((grossPriceUnit * (1 - icmsArion)) * (1 - (0.0365))) * (1 - 0.015);
      netPriceTotal = netPriceUnit * linkQtd;
    }
  
    return {
      netPriceUnit: this.convertDecimals(netPriceUnit),
      netPriceTotal: this.convertDecimals(netPriceTotal),
      grossPriceUnit: this.convertDecimals(grossPriceUnit),
      grossPriceTotal: this.convertDecimals(grossPriceTotal),
    }
  }
  private static calculateRecurringSalesPriceWithPercentual({
    recurringUnitCostWithTax,
    linkQtd,
    monthlyCostsWithOverhead,
    recurringMargin,
    icmsArion,
  }: ICalculateRecurringSalesPriceFullAndPercentualParams): ICalculateRecurringSalesPriceWithPercentualResult {
    /** Bruto total */
    let grossPriceTotal = 0;
    /** Bruto unitário */
    let grossPriceUnit = 0;
    /** Líquido unitário */
    let netPriceUnit = 0;
    /** Líquido total */
    let netPriceTotal = 0;
    /** TELECOM */
    let telecom = 0;
    /** SERVICE */
    let service = 0;
    if (recurringUnitCostWithTax) {
      grossPriceTotal = this.roundDecimals(monthlyCostsWithOverhead / (1 - (recurringMargin + icmsArion + 0.01007)));
      grossPriceUnit = grossPriceTotal / linkQtd;
      netPriceTotal = (((grossPriceTotal * 0.60) * (1 - icmsArion)) * (1 - (0.0365))) * (1 - 0.015) + (grossPriceTotal * 0.40 * (1 - (0.05 + 0.076 + 0.0165)));
      netPriceUnit = netPriceTotal / linkQtd;
      telecom = this.roundDecimals(((( grossPriceTotal * 0.60 ) * (1 - (icmsArion))) * (1 - (0.0365))) * (1 - 0.015), 'floor');
      service = (grossPriceTotal * 0.40 * (1 - (0.05 + 0.076 + 0.0165)))
    }
  
    return {
      netPriceUnit: this.convertDecimals(netPriceUnit),
      netPriceTotal: this.convertDecimals(netPriceTotal),
      telecom: this.convertDecimals(telecom),
      service: this.convertDecimals(service),
      grossPriceUnit: this.convertDecimals(grossPriceUnit),
      grossPriceTotal: this.convertDecimals(grossPriceTotal),
    }
  }
  private static calculateRecurringSalesPrice({
    customerProfile,
    monthlyRecoveryICMS,
    recurringSalesPriceFull,
    recurringSalesPriceWithPercentual,
    icmsArion
  }: ICalculateRecurringSalesPriceParams): ICalculateRecurringSalesPriceResul {
    /** Bruto total */
    let grossPriceTotal = 0;
    /** Bruto unitário */
    let grossPriceUnit = 0;
    /** Líquido unitário */
    let netPriceUnit = 0;
    /** Líquido total */
    let netPriceTotal = 0;
    /** Bruto total ATO COTEPE */
    let grossPriceTotalCotepe = 0;
    /** Bruto unitário ATO COTEPE */
    let grossPriceUnitCotepe = 0;
    
    grossPriceTotal = customerProfile === 'Operadora' ?
      recurringSalesPriceFull.grossPriceTotal:
      customerProfile === 'Corporativo' ?
        recurringSalesPriceWithPercentual.grossPriceTotal :
        0;
    grossPriceUnit = customerProfile === 'Operadora' ?
      recurringSalesPriceFull.grossPriceUnit:
      customerProfile === 'Corporativo' ?
        recurringSalesPriceWithPercentual.grossPriceUnit :
        0;
    
    netPriceTotal = customerProfile === 'Operadora' ?
      recurringSalesPriceFull.netPriceTotal:
      customerProfile === 'Corporativo' ?
        recurringSalesPriceWithPercentual.netPriceTotal :
        0;
    netPriceUnit = customerProfile === 'Operadora' ?
      recurringSalesPriceFull.netPriceUnit:
      customerProfile === 'Corporativo' ?
        recurringSalesPriceWithPercentual.netPriceUnit :
        0;

    grossPriceTotalCotepe = customerProfile === 'Operadora' ? 
      grossPriceTotal * (1 - icmsArion) : 
      0;
    grossPriceUnitCotepe = customerProfile === 'Operadora' ? 
      grossPriceUnit * (1 - icmsArion) : 
      0;
  
    return {
      netPriceUnit: this.convertDecimals(netPriceUnit),
      netPriceTotal: this.convertDecimals(netPriceTotal),
      grossPriceUnit: this.convertDecimals(grossPriceUnit),
      grossPriceTotal: this.convertDecimals(grossPriceTotal),
      grossPriceUnitCotepe: this.convertDecimals(grossPriceUnitCotepe),
      grossPriceTotalCotepe: this.convertDecimals(grossPriceTotalCotepe),
    }
  }
  private static calculateEventualSalePriceOrInstallationFee({
    monthlyRecoveryICMS,
    possibleOverheadCosts,
    eventualMargin,
    linkQtd
  }: ICalculateEventualSalePriceOrInstallationFeeParams): ICalculateBaseResult {
    /** Bruto total */
    let grossPriceTotal = 0;
    /** Bruto unitário */
    let grossPriceUnit = 0;
    /** Líquido unitário */
    let netPriceUnit = 0;
    /** Líquido total */
    let netPriceTotal = 0;
  
    grossPriceUnit = possibleOverheadCosts / ( 1 - (eventualMargin + 0.05 + 0.076 + 0.0165));
    grossPriceTotal = grossPriceUnit * linkQtd;
    netPriceUnit = grossPriceUnit * (1 - (0.05 + 0.076 + 0.0165));
    netPriceTotal = netPriceUnit * linkQtd;
  
    return {
      netPriceUnit: this.convertDecimals(netPriceUnit),
      netPriceTotal: this.convertDecimals(netPriceTotal),
      grossPriceUnit: this.convertDecimals(grossPriceUnit),
      grossPriceTotal: this.convertDecimals(grossPriceTotal),
    }
  }
  private static calculateMargin({
    hiringCosts,
    recurringSalesPrice,
    eventualSalePriceOrInstallationFee,
    linkQtd,
  }: ICalculateMarginParams): ICalculateMarginResult {
    let recurring = 0;
    let eventual = 0;
  
    recurring = recurringSalesPrice.netPriceTotal - hiringCosts.monthlyCostsWithOverhead;
    eventual = eventualSalePriceOrInstallationFee.netPriceTotal - ( hiringCosts.possibleOverheadCosts * linkQtd );
  
    return {
      recurring: this.convertDecimals(recurring),
      eventual: this.convertDecimals(eventual),
    }
  }
  static calculateTotal({
    totalRecurring,
    totalEventual,
    contractDeadline,
    marginRecurringTotal,
    marginEventualTotal,
    recurringSalesPriceGrossTotal,
  }: ICalculateTotalParams): ICalculateTotalResult {
    const totalProposal = this.roundDecimals(totalRecurring + totalEventual, 'floor');
    // [ ] Arrumar "totalRecurring", por ele estar com 1 centavo a menos, está dando uma diferença de 14 centavos no final
    /** Total do contrato */
    const totalContract = (totalRecurring * contractDeadline) + totalEventual;
    /** Margem recorrente % */
    const marginRecurringPercentual = marginRecurringTotal / recurringSalesPriceGrossTotal;
    /** Margem eventual % */
    const marginEventualTotalPercentual = marginEventualTotal / totalEventual;
    /** Margem do contrato */
    const marginContractTotal = (contractDeadline * marginRecurringTotal) + marginEventualTotal;
    /** Margem do contrato % */
    const marginContractTotalPercentual = ((contractDeadline * marginRecurringTotal) + marginEventualTotal) / (recurringSalesPriceGrossTotal * contractDeadline + totalEventual);
    
    const result = {
      totalProposal,
      totalContract,
      marginRecurringPercentual,
      marginEventualTotalPercentual,
      marginContractTotal,
      marginContractTotalPercentual,
    };

    return result;
  }
  //#region UTILS
  private static convertDecimals(value: number) {
    return parseFloat(value.toFixed(2))
  }
  private static roundDecimals(value: number, type: 'ceil' | 'floor' = 'ceil') {
    const decimals = 2;
    const factor = Math.pow(10, decimals);
    return type === 'ceil' ?
      Math.ceil(value * factor) / factor :
      Math.floor(value * factor) / factor;
  }
  //#endregion UTILS
}