//#region TYPES
export type ValueInProposalType =  'net' | 'net_cotepe' | 'gross' |'gross_cotepe'
export interface ICircuit {
  status?: 'Reprovado' | 'Projeto Especial' | 'Em Negociação' | 'Ag. Retorno Operadora' | 'Cancelado',
  special_project_reason?: string,
  possible_selected_providers?: any,
  link_group_key?: string,
  linkQtd: number,
  code: string,
  speed: string,
  address_a: string,
  municipality_a: string,
  uf_a: string,
  id_erp?: string,
  cnl?: string,
  latitude_a?: string,
  longitude_a?: string,
  
  monthly_cancellation_fee: number,
  installation_fee: number,
  gross_unit_price?: number,
  gross_installation_unit?: number,
  cotation_date?: Date,
  reproval_reason?: string

  contracted_operator?: string,
  monthly_fee: number,
  first_monthly_fee?: number,
  first_installation_fee?: number,
  real_monthly_fee?: number,
  real_installation_fee?: number,
  own_network?: string,
  product: string,
  raw_product?: string,
  cep_a?: string,
  uf_b?: string,
  municipality_b?: string,
  address_b?: string,
  cep_b?: string,
  latitude_b?: string,
  longitude_B?: string,
  term?: number,
  unit_of_measure?: string,
  sla?: string,
  interface?: string,
  connector_type?: string,
  type_of_protection?: string,
  observations?: string,
  margin_recurring?: number,
  margin_eventual?: number,
  contract_term_values: {
    term: number,
    months_net: number,
    months_net_cotepe: number,
    months_net_rate: number,
    months_gross: number,
    months_gross_rate: number,
    months_gross_cotepe: number,
    months_gross_cotepe_rate: number,
    monthly_fee_margin_of_error?: number,
    installation_fee_margin_of_error?: number
  }[],
  activation_deadline?: number,
  third_party_provider?: string,
  contracted_monthly?: number,
  contracted_installation?: number,
  first_contracted_monthly?: number,
  first_contracted_installation?: number,
  grouping_type: 'single' | 'group' | 'ungroup',
  established_group?: boolean,
  sale_price_monthly?: number,
  sale_price_installation?: number,
  target_monthly_fee?: number,
  target_installation_fee?: number,
  claro_order_id?: string,
  target_margin_installation_fee?: number,
  target_margin_monthly_fee?: number,
  network?: { id: string },
  special_project_with_adjustment?: boolean,
  overload_info?: {
    diff_installation_fee: number,
    diff_monthly_fee: number
  },
  _largestGroupSize?: number
}
export interface IValidedSingleCircuitResult {
  hiringCosts: ICalculateHiringCostsResult,
  recurringSalesPrice: ICalculateRecurringSalesPriceResul,
  eventualSalePriceOrInstallationFee: ICalculateBaseResult,
  margin: ICalculateMarginResult,
  marginRecurring: number,
  marginEventual: number,
  linkQtd: number,
  monthly_fee_margin_of_error: number,
  installation_fee_margin_of_error: number,
}
export type CustomerProfile = 'Operadora' | 'Corporativo';
export type CalculatorMatrixUF = 'AC' | 'AL' | 'AP' | 'AM' | 'BA' | 'CE' | 'DF' | 'ES' | 'GO' | 'MA' | 'MT' | 'MS' | 'MG' | 'PA' | 'PB' | 'PR' | 'PE' | 'PI' | 'RJ' | 'RN' | 'RS' | 'RO' | 'RR' | 'SC' | 'SP' | 'SE' | 'TO';
export type CalculatorMatrixICMSByUF = Record<CalculatorMatrixUF, any>;
export type CalculatorMatrixUFLinkQtdByUF = Record<CalculatorMatrixUF, any>;
export interface ICalculatorMatrixData {
  /** Perfil do cliente */
  customerProfile?: CustomerProfile,
  /** Ato COTEPE */
  cotepeAct?: boolean,
  /** OH recorrente */
  recurringOH: number,
  /** OH eventual */
  eventualOH: number,
  /** Margem recorrente */
  recurringMargin: number,
  /** Margem eventual */
  eventualMargin: number,
  /** ICMS da CNPJ da Arion */
  icmsArion: number,
  /** Alíquota do ICMS por UF */
  icmsByUF: CalculatorMatrixICMSByUF,
  /** SIGLA DO ESTADO */
  uf: CalculatorMatrixUF,
  /** Velocidade da internet */
  speed: string,
  /** Operadora Contratada */
  operator?: string,
  /** Mensalidade */
  monthlyFee: number,
  /** Instalação */
  installationFee: number,
  /** Quantidade de links por estado e velocidade */
  linkQtd: number,
  /** Multa por cancelamento */
  costCancellationPenalty?: number,
  valueInProposal: ValueInProposalType | null,
  calculator: 'direct' | 'indirect' | 'margin',
  target_installation_fee: number | null,
  target_monthly_fee: number | null,
}
export interface ICalculateTotalParams {
  totalRecurring: number,
  totalEventual: number,
  contractDeadline: number,
  marginRecurringTotal: number,
  marginEventualTotal: number,
  recurringSalesPriceGrossTotal: number,
}
export interface ICalculateTotalResult {
  totalProposal: number,
  totalContract: number,
  marginRecurringPercentual: number,
  marginEventualTotalPercentual: number,
  marginContractTotal: number,
  marginContractTotalPercentual: number,
}
export interface ICalculateHiringCostsParams {
  /** Quantidade de Links: links de circuito por município e velocidade */
  linkQtd: number,
  /** Custo unitário recorrente com impostos */
  recurringUnitCostWithTax: number,
  /** Custo unitário da instalação com impostos */
  unitCostInstallationWithTax: number,
  /** Custo mensal da multa por cancelamento */
  monthlyCostCancellationPenalty: number,
  /** ICMS por região  */
  icms: number,
  /** OH recorrente */
  recurringOH: number, 
  /** OH eventual */
  eventualOH: number,
}
export interface ICalculateHiringCostsResult {
  /** Recuperação Mensal de ICMS */
  monthlyRecoveryICMS: number,
  /** Mensal Bruto c/ Impostos */
  monthlyGrossWithTax: number,
  /** Custo Mensal c/ Overhead */
  monthlyCostsWithOverhead: number,
  /** Custo Eventual c/ Overhead */
  possibleOverheadCosts: number,
}
export interface ICalculateRecurringSalesPriceFullAndPercentualParams {
  /** Quantidade de Links: links de circuito por município e velocidade */
  linkQtd: number,
  /** Custo unitário recorrente com impostos */
  recurringUnitCostWithTax: number,
  /** Custo Mensal com Overhead */
  monthlyCostsWithOverhead?: number,
  /** Margem Recorrente */
  recurringMargin: number,
  /** ICMS da filial da Arion */
  icmsArion: number,
  valueInProposal: ValueInProposalType | null,
  calculator: 'direct' | 'indirect' | 'margin',
  target_monthly_fee: number | null,
}
export interface ICalculateBaseResult {
  /** Preço Líquido Unitário */
  netPriceUnit: number,
  /** Preço Líquido Total */
  netPriceTotal: number,
  /** Preço Bruto Unitário */
  grossPriceUnit: number,
  /** Preço Bruto Total */
  grossPriceTotal: number,
  /** Margem de erro */
  marginOfError: number
}
export interface ICalculateRecurringSalesPriceWithPercentualResult extends ICalculateBaseResult {
  /** Telecom 60% */
  telecom: number,
  /** Serviço 40% */
  service: number,
} 
export interface ICalculateRecurringSalesPriceParams {
  /** Perfil do Cliente */
  customerProfile?: CustomerProfile,
  /** Custos de Contratação > Recuperação Mensal de ICMS */
  monthlyRecoveryICMS: number,
  /** ICMS da filial da Arion */
  icmsArion: number,
  valueInProposal: ValueInProposalType | null,
  calculator: 'direct' | 'indirect' | 'margin',
  target_monthly_fee: number | null,
}
export interface ICalculateRecurringSalesPriceResul extends ICalculateBaseResult {
  /** Líquido (ATO COTEPE) Unitário */
  netPriceUnitCotepe: number,
  /** Líquido (ATO COTEPE) Total */
  netPriceTotalCotepe: number,
  /** Bruto (ATO COTEPE) Unitário */
  grossPriceUnitCotepe: number,
  /** Bruto (ATO COTEPE) Total */
  grossPriceTotalCotepe: number,
}
export interface ICalculateEventualSalePriceOrInstallationFeeParams {
  /** Quantidade de Links */
  linkQtd: number,
  /** Recuperação Mensal de ICMS */
  monthlyRecoveryICMS: number,
  /** Custo Eventual com Overhead */
  possibleOverheadCosts: number,
  /** Margem Eventual */
  eventualMargin: number,
  valueInProposal: ValueInProposalType | null,
  calculator: 'direct' | 'indirect' | 'margin',
  target_installation_fee: number | null,
}
export interface ICalculateMarginParams {
  /** Quantidade de Links */
  linkQtd: number,
  hiringCosts: any,
  recurringSalesPrice: ICalculateRecurringSalesPriceResul,
  eventualSalePriceOrInstallationFee: ICalculateBaseResult,
  valueInProposal: ValueInProposalType | null,
  calculator: 'direct' | 'indirect' | 'margin',
  cotepeAct: boolean
}
export interface ICalculateMarginResult {
  /** Margem Recorrente */
  recurring: number,
  /** Margem Eventual */
  eventual: number,
}
//#endregion

export class CalculatorMatrix {
  /** PIS e COFINS sem ATO COTEPE */
  private static pisCofins = 0.0365; // 0.02993;

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
      monthlyFee,
      installationFee,
      linkQtd,
      costCancellationPenalty,
      valueInProposal,
      calculator,
      target_installation_fee,
      target_monthly_fee
    } = data;
    const monthly_fee = monthlyFee;
    const installation_fee = installationFee;

    // Validação da célula F2 da planilha
    // [ ] COLOCAR UMA VALIDAÇÃO PARA ISSO NO FLOW DATA, PORQUE O GRUPO "PREÇO DE VENDA RECORRENTE" E "PREÇO DE VENDA EVENTUAL OU TAXA DE INSTALAÇÃO VALIDAM POR ESSE CAMPO"
    if (customerProfile === 'Corporativo' && !!cotepeAct && String(cotepeAct) === 'true') throw new Error('Favor alterar ATO COTEPE para NÃO');
 
    /** Custo unitário recorrente com impostos */
    const recurringUnitCostWithTax = monthly_fee ?? 0;
    /** Custo unitário da instalação com impostos */
    const unitCostInstallationWithTax = installation_fee ?? 0;
    /** Custo mensal da multa por cancelamento */
    const monthlyCostCancellationPenalty = costCancellationPenalty ?? 0;
    /** ICMS da Operadora Contratada. Buscar o ICMS referente a empresa na planilha */
    let icms = null;
    if (icmsByUF[uf]) {
      if (
        operator && icmsByUF[uf]['operators'] &&
        icmsByUF[uf]['operators'][operator] != undefined
      ) icms = icmsByUF[uf]['operators'][operator] / 100;
      else icms = (icmsByUF[uf].tax / 100);
    } 
    if (!icms && icms !== 0) throw new Error(`A alíquota do estado ${uf} não está cadastrada`);

    /** Custos de contratação */
    const hiringCosts = this.calculateHiringCosts({ linkQtd, recurringUnitCostWithTax, unitCostInstallationWithTax, monthlyCostCancellationPenalty, icms, recurringOH, eventualOH });
    
    /** Preço de venda recorrente */
    const recurringSalesPrice = this.calculateRecurringSalesPrice({
      customerProfile,
      monthlyRecoveryICMS: hiringCosts.monthlyRecoveryICMS,
      icmsArion,
      recurringMargin,
      monthlyCostsWithOverhead: hiringCosts.monthlyCostsWithOverhead,
      linkQtd,
      valueInProposal,
      calculator,
      target_monthly_fee,
      recurringUnitCostWithTax
    });

    /** Preço de Venda Eventual ou Taxa de Instalação */
    const eventualSalePriceOrInstallationFee = this.calculateEventualSalePriceOrInstallationFee({
      monthlyRecoveryICMS: hiringCosts.monthlyRecoveryICMS,
      possibleOverheadCosts: hiringCosts.possibleOverheadCosts,
      eventualMargin,
      linkQtd,
      valueInProposal,
      calculator,
      target_installation_fee,
    });

    /** Margem */
    const margin = this.calculateMargin({
      hiringCosts,
      recurringSalesPrice,
      eventualSalePriceOrInstallationFee,
      linkQtd,
      valueInProposal,
      calculator,
      cotepeAct: cotepeAct ?? false
    });
    
    const result = {
      hiringCosts,
      recurringSalesPrice,
      eventualSalePriceOrInstallationFee,
      margin,
      marginRecurring: margin.recurring,
      marginEventual: margin.eventual,
      linkQtd,
      monthly_fee_margin_of_error: this.roundDecimals(recurringSalesPrice.marginOfError, 'round'),
      installation_fee_margin_of_error: this.roundDecimals(eventualSalePriceOrInstallationFee.marginOfError, 'round')
    };

    return result;
  }

  static getQuantityLinksByUFandSpeed(circuits: ICircuit[]) {
    const links: Record<string, number> = {};
    for (const circuit of circuits) {
      let uf = circuit.uf_a;
      if(!uf) {
        uf = this.getUFByAdress(circuit.address_a);
        circuit.uf_a = uf;
      };
      
      if(['Reprovado', 'Cancelado'].includes(circuit.status!)) continue;

      const linkGroupKey = CalculatorMatrix.makeLinkGroupKey(circuit);

      if(circuit.grouping_type === 'single' || circuit.grouping_type === 'ungroup') continue;
      if(!linkGroupKey) continue;

      if (!links[linkGroupKey]) links[linkGroupKey] = 1;
      else links[linkGroupKey] += 1;
    }
    return links;
  }
  static makeLinkGroupKey(circuit: ICircuit){
    const uf = circuit.uf_a;
    const speed = circuit.speed ? String(circuit.speed).toLowerCase() : undefined;
    const product = circuit.product ? String(circuit.product).toLowerCase() : undefined;

    if (!product || !uf || !speed) return;

    const linkGroupKey = [uf,product,speed].join('‡');
    circuit.link_group_key = linkGroupKey;
    return linkGroupKey;
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
    calculator,
    valueInProposal,
    target_monthly_fee
  }: ICalculateRecurringSalesPriceFullAndPercentualParams): ICalculateBaseResult {
    /** Bruto total */
    let grossPriceTotal = 0;
    /** Bruto unitário */
    let grossPriceUnit = 0;
    /** Líquido unitário */
    let netPriceUnit = 0;
    /** Líquido total */
    let netPriceTotal = 0;
    
    let marginOfError = 0;

    if (recurringUnitCostWithTax) {
      let calculateBy : 'gross' | 'gross_cotepe' = 'gross';

      grossPriceTotal = monthlyCostsWithOverhead! / (
        1 - (recurringMargin + icmsArion + this.pisCofins)
      );
      let grossCotepePriceTotal = monthlyCostsWithOverhead! / (
        1 - (recurringMargin + this.pisCofins)
      );
      grossPriceUnit = grossPriceTotal / linkQtd;
      let grossCotepePriceUnit = grossCotepePriceTotal / linkQtd;

      if(calculator === 'margin' && target_monthly_fee){
        if(valueInProposal === 'gross'){
          marginOfError =  grossPriceUnit - target_monthly_fee;
          grossPriceUnit = target_monthly_fee;
          grossPriceTotal = target_monthly_fee * linkQtd;
        }
        else if(valueInProposal === 'gross_cotepe'){
          marginOfError =  grossCotepePriceUnit - target_monthly_fee;
          grossCotepePriceUnit = target_monthly_fee;
          grossCotepePriceTotal = target_monthly_fee * linkQtd;
        }
      }
      else marginOfError = 0;

      netPriceUnit = calculateBy === 'gross' ? (
        ((grossPriceUnit * (1 - icmsArion)) *  (1 - this.pisCofins)) * (1 - 0.015)
      ) : (
        grossCotepePriceUnit * (1 - this.pisCofins)
      );
      
      netPriceTotal = netPriceUnit * linkQtd;
    }
  
    if(calculator === 'margin' && target_monthly_fee){
      if(valueInProposal === 'net' || valueInProposal === 'net_cotepe'){
        marginOfError =  netPriceUnit - target_monthly_fee;
        netPriceUnit = target_monthly_fee;
        netPriceTotal = target_monthly_fee * linkQtd;
      }
    }
  
    return { 
      netPriceUnit: this.convertDecimals(netPriceUnit),
      netPriceTotal: this.convertDecimals(netPriceTotal),
      grossPriceUnit: this.convertDecimals(grossPriceUnit),
      grossPriceTotal: this.convertDecimals(grossPriceTotal),
      marginOfError: this.convertDecimals(marginOfError)
    }
  }
  private static calculateRecurringSalesPriceWithPercentual({
    recurringUnitCostWithTax,
    linkQtd,
    monthlyCostsWithOverhead,
    recurringMargin,
    icmsArion,
    calculator,
    target_monthly_fee,
    valueInProposal
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
    let marginOfError = 0;

    if (recurringUnitCostWithTax) {
      grossPriceTotal = this.roundDecimals(monthlyCostsWithOverhead! / (
        1 - (recurringMargin + icmsArion + 0.01007)
      ));
      grossPriceUnit = grossPriceTotal / linkQtd;
      
      if(calculator === 'margin' && target_monthly_fee){
        if(valueInProposal === 'gross'){
          marginOfError =  grossPriceUnit - target_monthly_fee;
          grossPriceUnit = target_monthly_fee;
          grossPriceTotal = target_monthly_fee * linkQtd;
        }
      }
      else marginOfError = 0;
      
      netPriceTotal = (
        ((grossPriceTotal * 0.60) * (1 - icmsArion)) * (1 - this.pisCofins)
      ) * (1 - 0.015) + (
        grossPriceTotal * 0.40 * (1 - (0.05 + 0.076 + 0.0165))
      );
      netPriceUnit = netPriceTotal / linkQtd;

      if(calculator === 'margin' && target_monthly_fee){
        if(valueInProposal === 'net' || valueInProposal === 'net_cotepe'){
          marginOfError =  netPriceUnit - target_monthly_fee;
          netPriceUnit = target_monthly_fee;
          netPriceTotal = target_monthly_fee * linkQtd;
        }
      }

      telecom = this.roundDecimals(((( grossPriceTotal * 0.60 ) * (1 - (icmsArion))) * (1 - this.pisCofins)) * (1 - 0.015), 'floor');
      service = (grossPriceTotal * 0.40 * (1 - (0.05 + 0.076 + 0.0165)))
    }
  
    return {
      netPriceUnit: this.convertDecimals(netPriceUnit),
      netPriceTotal: this.convertDecimals(netPriceTotal),
      telecom: this.convertDecimals(telecom),
      service: this.convertDecimals(service),
      grossPriceUnit: this.convertDecimals(grossPriceUnit),
      grossPriceTotal: this.convertDecimals(grossPriceTotal),
      marginOfError
    }
  }
  private static calculateRecurringSalesPrice({
    customerProfile,
    recurringMargin,
    monthlyCostsWithOverhead,
    linkQtd,
    icmsArion,
    calculator,
    target_monthly_fee,
    valueInProposal,
    recurringUnitCostWithTax
  }: ICalculateRecurringSalesPriceParams & Pick<ICalculateRecurringSalesPriceFullAndPercentualParams, 'recurringMargin' | 'linkQtd' | 'monthlyCostsWithOverhead' | 'icmsArion' | 'recurringUnitCostWithTax'>): ICalculateRecurringSalesPriceResul {
    //#region DECLARATION
    /** Bruto total */
    let grossPriceTotal = 0;
    /** Bruto unitário */
    let grossPriceUnit = 0;
    /** Líquido unitário */
    let netPriceUnit = 0;
    /** Líquido total */
    let netPriceTotal = 0;
    /** Líquido unitário ATO COTEPE */
    let netPriceUnitCotepe = 0;
    /** Líquido total ATO COTEPE */
    let netPriceTotalCotepe = 0;
    /** Bruto total ATO COTEPE */
    let grossPriceTotalCotepe = 0;
    /** Bruto unitário ATO COTEPE */
    let grossPriceUnitCotepe = 0;
    let marginOfError = 0;
    //#endregion DECLARATION
    
    if(customerProfile === 'Operadora'){
      /** Preço de venda recorrente 100% */
      const recurringSalesPriceFull = this.calculateRecurringSalesPriceFull({
        recurringUnitCostWithTax,
        linkQtd,
        monthlyCostsWithOverhead,
        recurringMargin,
        icmsArion,
        valueInProposal,
        calculator,
        target_monthly_fee
      });

      marginOfError = recurringSalesPriceFull.marginOfError;

      grossPriceTotal = recurringSalesPriceFull.grossPriceTotal;
      grossPriceUnit = recurringSalesPriceFull.grossPriceUnit;

      const discount = (grossPriceTotal * icmsArion) + ((grossPriceTotal - (grossPriceTotal * icmsArion)) * this.pisCofins);
      netPriceTotal = grossPriceTotal - discount;
      netPriceUnit = netPriceTotal / linkQtd;

      if(calculator === 'margin' && valueInProposal === 'net' && target_monthly_fee){
        marginOfError =  netPriceUnit - target_monthly_fee;
        netPriceUnit = target_monthly_fee;
        netPriceTotal = target_monthly_fee * linkQtd;
      }

      grossPriceTotalCotepe = (grossPriceTotal * (monthlyCostsWithOverhead! / grossPriceTotal)) / (
        1 - (recurringMargin + this.pisCofins)
      );
      grossPriceUnitCotepe = grossPriceTotalCotepe / linkQtd;

      if(calculator === 'margin' && valueInProposal === 'gross_cotepe' && target_monthly_fee){
        marginOfError =  grossPriceUnitCotepe - target_monthly_fee;
        grossPriceUnitCotepe = target_monthly_fee;
        grossPriceTotalCotepe = target_monthly_fee * linkQtd;
      }

      netPriceTotalCotepe = grossPriceTotalCotepe - (grossPriceTotalCotepe * this.pisCofins);
      netPriceUnitCotepe = netPriceTotalCotepe / linkQtd;

      if(calculator === 'margin' && valueInProposal === 'net_cotepe' && target_monthly_fee){
        marginOfError =  netPriceUnitCotepe - target_monthly_fee;
        netPriceUnitCotepe = target_monthly_fee;
        netPriceTotalCotepe = target_monthly_fee * linkQtd;
      }
    }
    else if(customerProfile === 'Corporativo'){
      /** Preço de venda recorrente 60%-40% */
      const recurringSalesPriceWithPercentual = this.calculateRecurringSalesPriceWithPercentual({
        recurringUnitCostWithTax,
        linkQtd,
        monthlyCostsWithOverhead,
        recurringMargin,
        icmsArion,
        valueInProposal,
        calculator,
        target_monthly_fee
      });

      marginOfError = recurringSalesPriceWithPercentual.marginOfError;

      grossPriceTotal = recurringSalesPriceWithPercentual.grossPriceTotal;
      grossPriceUnit = recurringSalesPriceWithPercentual.grossPriceUnit;

      netPriceTotal = recurringSalesPriceWithPercentual.netPriceTotal;
      netPriceUnit = recurringSalesPriceWithPercentual.netPriceUnit;

      grossPriceTotalCotepe = 0;
      grossPriceUnitCotepe = 0;

      netPriceTotalCotepe = recurringSalesPriceWithPercentual.netPriceTotal;
      netPriceUnitCotepe = recurringSalesPriceWithPercentual.netPriceUnit;
    }

    return {
      netPriceUnit: this.convertDecimals(netPriceUnit),
      netPriceTotal: this.convertDecimals(netPriceTotal),
      netPriceUnitCotepe: this.convertDecimals(netPriceUnitCotepe),
      netPriceTotalCotepe: this.convertDecimals(netPriceTotalCotepe),
      grossPriceUnit: this.convertDecimals(grossPriceUnit),
      grossPriceTotal: this.convertDecimals(grossPriceTotal),
      grossPriceUnitCotepe: this.convertDecimals(grossPriceUnitCotepe),
      grossPriceTotalCotepe: this.convertDecimals(grossPriceTotalCotepe),
      marginOfError
    }
  }
  private static calculateEventualSalePriceOrInstallationFee({
    monthlyRecoveryICMS,
    possibleOverheadCosts,
    eventualMargin,
    linkQtd,
    valueInProposal,
    calculator,
    target_installation_fee,
  }: ICalculateEventualSalePriceOrInstallationFeeParams): ICalculateBaseResult {
    /** Bruto total */
    let grossPriceTotal = 0;
    /** Bruto unitário */
    let grossPriceUnit = 0;
    /** Líquido unitário */
    let netPriceUnit = 0;
    /** Líquido total */
    let netPriceTotal = 0;
    let marginOfError = 0;
  
    grossPriceUnit = possibleOverheadCosts / (
      1 - (eventualMargin + 0.05 + 0.076 + 0.0165)
    );
    if(calculator === 'margin' && target_installation_fee){
      if(valueInProposal === 'gross' || valueInProposal === 'gross_cotepe'){
        marginOfError =  grossPriceUnit - target_installation_fee;
        grossPriceUnit = target_installation_fee;
      }
    }
    grossPriceTotal = grossPriceUnit * linkQtd;
    
    netPriceUnit = grossPriceUnit * (1 - (0.05 + 0.076 + 0.0165));
    if(calculator === 'margin' && target_installation_fee){
      if(valueInProposal === 'net' || valueInProposal === 'net_cotepe'){
        marginOfError =  netPriceUnit - target_installation_fee;
        netPriceUnit = target_installation_fee;
      }
    }
    netPriceTotal = netPriceUnit * linkQtd;
  
    return {
      netPriceUnit: this.convertDecimals(netPriceUnit),
      netPriceTotal: this.convertDecimals(netPriceTotal),
      grossPriceUnit: this.convertDecimals(grossPriceUnit),
      grossPriceTotal: this.convertDecimals(grossPriceTotal),
      marginOfError
    }
  }
  private static calculateMargin({
    hiringCosts,
    recurringSalesPrice,
    eventualSalePriceOrInstallationFee,
    linkQtd,
    calculator,
    valueInProposal,
    cotepeAct
  }: ICalculateMarginParams): ICalculateMarginResult {
    let recurring = 0;
    let eventual = 0;
  
    recurring = cotepeAct ?
      (recurringSalesPrice.netPriceTotalCotepe - hiringCosts.monthlyCostsWithOverhead):
      (recurringSalesPrice.netPriceTotal - hiringCosts.monthlyCostsWithOverhead)
    ;

    // if(calculator === 'margin'){
      if(valueInProposal === 'net_cotepe') recurring = recurringSalesPrice.netPriceTotalCotepe - hiringCosts.monthlyCostsWithOverhead;
      else if(valueInProposal === 'gross') recurring = recurringSalesPrice.grossPriceTotal - hiringCosts.monthlyCostsWithOverhead;
      else if(valueInProposal === 'gross_cotepe') recurring = recurringSalesPrice.grossPriceTotalCotepe - (
        recurringSalesPrice.grossPriceTotalCotepe * this.pisCofins
      ) - hiringCosts.monthlyCostsWithOverhead;
    // }

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
    
    /** Total do contrato */
    const totalContract = (totalRecurring * contractDeadline) + totalEventual;
    /** Margem recorrente % */
    const marginRecurringPercentual = marginRecurringTotal / totalRecurring;
    /** Margem eventual % */
    const marginEventualTotalPercentual = marginEventualTotal / totalEventual;
    /** Margem do contrato */
    const marginContractTotal = (contractDeadline * marginRecurringTotal) + marginEventualTotal;
    /** Margem do contrato % */
    const marginContractTotalPercentual = (
      (contractDeadline * marginRecurringTotal) + marginEventualTotal
    ) / (totalRecurring * contractDeadline + totalEventual);
    
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
    return !isNaN(value) ? parseFloat(value.toFixed(2)) : 0;
  }
  private static roundDecimals(value: number, type: 'ceil' | 'floor' | 'round'= 'ceil') {
    const decimals = 2;
    const factor = Math.pow(10, decimals);
    return (
      type === 'ceil'  ? Math.ceil(value * factor) / factor  :
      type === 'floor' ? Math.floor(value * factor) / factor :
      type === 'round' ? Math.round(value * factor) / factor : value
    );
  }
  //#endregion UTILS
}