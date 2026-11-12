export type Account = { id: string; name: string; type: string; balanceCents: number; last4: string };
export type Transaction = { id: string; date: string; accountId: string; merchant: string; category: string; amountCents: number; note?: string };
export type QueryFilters = { from: string; to: string; category: string; accountId: string };

export const REFERENCE_DATE = '2026-10-31';
export const accounts: Account[] = [
  { id: 'checking', name: 'Conta do dia a dia', type: 'Conta corrente', balanceCents: 482650, last4: '2408' },
  { id: 'savings', name: 'Reserva', type: 'Poupança', balanceCents: 1264800, last4: '7316' },
];

const rows: [string, string, string, string, number, string?][] = [
  ['2026-08-01','checking','Salário','Renda',520000],['2026-08-02','checking','Aluguel','Moradia',-165000],['2026-08-03','checking','Mercado Pão de Açúcar','Mercado',-48620],['2026-08-05','checking','Netflix','Assinaturas',-5590],['2026-08-07','checking','Uber','Transporte',-3820],['2026-08-09','checking','Restaurante Manjericão','Alimentação',-8640],['2026-08-11','checking','Mercado Pão de Açúcar','Mercado',-32100],['2026-08-14','checking','Farmácia São João','Saúde',-7860],['2026-08-17','checking','Uber','Transporte',-4260],['2026-08-20','checking','Restaurante Manjericão','Alimentação',-10450],['2026-08-25','checking','Mercado Pão de Açúcar','Mercado',-28760],['2026-08-28','checking','Academia','Saúde',-11990],['2026-08-30','checking','Cinema','Lazer',-7400],
  ['2026-09-01','checking','Salário','Renda',520000],['2026-09-02','checking','Aluguel','Moradia',-165000],['2026-09-03','checking','Mercado Pão de Açúcar','Mercado',-52340],['2026-09-05','checking','Netflix','Assinaturas',-5590],['2026-09-07','checking','Uber','Transporte',-5190],['2026-09-10','checking','Restaurante Manjericão','Alimentação',-9250],['2026-09-12','checking','Farmácia São João','Saúde',-6450],['2026-09-15','checking','Mercado Pão de Açúcar','Mercado',-34780],['2026-09-18','checking','Uber','Transporte',-3810],['2026-09-21','checking','Restaurante Manjericão','Alimentação',-11800],['2026-09-24','checking','Mercado Pão de Açúcar','Mercado',-26940],['2026-09-28','checking','Livraria Cultura','Lazer',-9240],
  ['2026-10-01','checking','Salário','Renda',520000],['2026-10-02','checking','Aluguel','Moradia',-165000],['2026-10-03','checking','Mercado Pão de Açúcar','Mercado',-57980],['2026-10-05','checking','Netflix','Assinaturas',-5590],['2026-10-06','checking','Uber','Transporte',-4620],['2026-10-09','checking','Restaurante Manjericão','Alimentação',-12800],['2026-10-12','checking','Farmácia São João','Saúde',-9720],['2026-10-15','checking','Mercado Pão de Açúcar','Mercado',-39240],['2026-10-18','checking','Uber','Transporte',-5370],['2026-10-21','checking','Restaurante Manjericão','Alimentação',-9450],['2026-10-24','checking','Mercado Pão de Açúcar','Mercado',-31360],['2026-10-27','checking','Show ao vivo','Lazer',-18500],['2026-10-29','checking','Freelance','Renda',85000],
];
export const transactions: Transaction[] = rows.map((r,i)=>({id:`tx-${i+1}`,date:r[0],accountId:r[1],merchant:r[2],category:r[3],amountCents:r[4],note:r[5]}));
export const defaultFilters: QueryFilters = { from: '2026-10-01', to: REFERENCE_DATE, category: 'Todas', accountId: 'Todas' };
export const categories = ['Todas', ...new Set(transactions.map(t=>t.category))];
export const money = (cents:number) => new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(cents/100);
export const dateLabel = (date:string) => new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'short'}).format(new Date(`${date}T12:00:00`));

export function filterTransactions(filters: QueryFilters, source = transactions) {
  return source.filter(t => t.date >= filters.from && t.date <= filters.to && (filters.category==='Todas'||t.category===filters.category) && (filters.accountId==='Todas'||t.accountId===filters.accountId));
}
export function spendingPatterns(list: Transaction[]) {
  const expenses=list.filter(t=>t.amountCents<0);
  const total=expenses.reduce((s,t)=>s-t.amountCents,0);
  const groups=new Map<string,number>();
  expenses.forEach(t=>groups.set(t.category,(groups.get(t.category)||0)-t.amountCents));
  const top=[...groups].sort((a,b)=>b[1]-a[1])[0];
  const repeats=new Map<string,number>(); expenses.forEach(t=>repeats.set(t.merchant,(repeats.get(t.merchant)||0)+1));
  const repeated=[...repeats].filter(([,n])=>n>1).sort((a,b)=>b[1]-a[1])[0];
  const months=[...new Set(expenses.map(t=>t.date.slice(0,7)))].sort();
  let comparison:string|undefined;
  if(months.length>=2){const [prev,cur]=months.slice(-2);const sum=(m:string)=>expenses.filter(t=>t.date.startsWith(m)).reduce((s,t)=>s-t.amountCents,0);const a=sum(prev),b=sum(cur); const delta=a?Math.round((b-a)/a*100):0; comparison=`Seus gastos passaram de ${money(a)} em ${prev.slice(5)} para ${money(b)} em ${cur.slice(5)} (${delta>0?'+' : ''}${delta}%).`;}
  return { total, top: top?{name:top[0],value:top[1],share:total?Math.round(top[1]/total*100):0}:undefined, repeated, comparison, expenseCount:expenses.length };
}
export function answerQuestion(question:string, filters:QueryFilters) {
  const q=question.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const explicit:QueryFilters={...filters};
  const month=q.match(/\b(agosto|setembro|outubro)\b/);
  if(month){const m=month[1]==='agosto'?'08':month[1]==='setembro'?'09':'10';explicit.from=`2026-${m}-01`;explicit.to=m==='10'?REFERENCE_DATE:`2026-${m}-${m==='09'?'30':'31'}`;}
  const cat=categories.find(c=>c!=='Todas'&&q.includes(c.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase())); if(cat)explicit.category=cat;
  const acc=accounts.find(a=>q.includes(a.name.toLowerCase())||q.includes(a.type.toLowerCase())); if(acc)explicit.accountId=acc.id;
  const list=filterTransactions(explicit);
  const period=`${dateLabel(explicit.from)} a ${dateLabel(explicit.to)}${explicit.category!=='Todas'?` · ${explicit.category}`:''}${explicit.accountId!=='Todas'?` · ${accounts.find(a=>a.id===explicit.accountId)?.name}`:''}`;
  if(/saldo|conta/.test(q))return {text:`Você tem ${accounts.length} contas com saldo total de ${money(accounts.reduce((s,a)=>s+a.balanceCents,0))}. A posição é de 31/10/2026.`,period,rows:[]};
  if(/padrao|padrões|repetid/.test(q)){const p=spendingPatterns(list);return {text:p.expenseCount?`Encontrei ${p.top?`${p.top.name} como maior categoria (${p.top.share}% dos gastos)`:'gastos no período'}${p.repeated?`; ${p.repeated[0]} aparece ${p.repeated[1]} vezes`:''}${p.comparison?`. ${p.comparison}`:''}.`:'Ainda não há gastos suficientes neste recorte para apontar padrões.',period,rows:[]};}
  if(/gasto|gastei|despesa|gast/.test(q)){const p=spendingPatterns(list);return {text:`Você teve ${money(p.total)} em gastos no período.`,period,rows:list};}
  if(/transa|compra|movimenta/.test(q))return {text:`Encontrei ${list.length} transações no período. Saídas aparecem como valores positivos nesta lista; entradas, como valores negativos.`,period,rows:list};
  return {text:'Posso consultar seus saldos, listar transações e analisar padrões de gasto por categoria, período ou conta.',period,rows:[]};
}
