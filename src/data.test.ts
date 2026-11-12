import { describe, expect, it } from 'vitest'
import { answerQuestion, defaultFilters, filterTransactions, spendingPatterns, transactions } from './data'

describe('DioBank local financial data',()=>{
 it('combines date, category and account filters',()=>{const rows=filterTransactions({...defaultFilters,category:'Mercado',accountId:'checking'});expect(rows.length).toBeGreaterThan(0);expect(rows.every(t=>t.category==='Mercado'&&t.accountId==='checking')).toBe(true)})
 it('excludes incoming funds from spending patterns',()=>{const p=spendingPatterns(transactions);expect(p.expenseCount).toBe(transactions.filter(t=>t.amountCents<0).length);expect(p.top?.name).toBe('Moradia')})
 it('answers month queries in Brazilian Portuguese',()=>{const a=answerQuestion('Quanto gastei em outubro?',defaultFilters);expect(a.text).toContain('gastos no período');expect(a.period).toContain('out')})
 it('guides unsupported questions without inventing numbers',()=>{expect(answerQuestion('Qual a previsão do dólar?',defaultFilters).text).toContain('Posso consultar')})
})
