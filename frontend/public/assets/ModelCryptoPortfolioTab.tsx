import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bitcoin, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { formatCurrency } from '../lib/utils';

type CryptoSize = 'large' | 'mid' | 'small';

const cryptoPortfolios = {
    conservative: {
        large: 70,
        mid: 20,
        small: 10,
    },
    moderate: {
        large: 50,
        mid: 30,
        small: 20,
    },
    aggressive: {
        large: 30,
        mid: 40,
        small: 30,
    },
};

const COLORS = ['#f7931a', '#627eea', '#00d395', '#8247e5', '#26a17b'];

export function ModelCryptoPortfolioTab() {
    const [riskProfile, setRiskProfile] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');
    const [initialCapital, setInitialCapital] = useState('100000');
    const [sipAmount, setSipAmount] = useState('10000');

    const allocation = cryptoPortfolios[riskProfile];
    const capital = parseFloat(initialCapital) || 0;
    const sip = parseFloat(sipAmount) || 0;

    const allocationData = [
        { name: 'Large Cap (BTC, ETH)', value: allocation.large, amount: (capital * allocation.large) / 100 },
        { name: 'Mid Cap (SOL, ADA, DOT)', value: allocation.mid, amount: (capital * allocation.mid) / 100 },
        { name: 'Small Cap (Emerging)', value: allocation.small, amount: (capital * allocation.small) / 100 },
    ];

    // Generate 25-year forecast
    const years = 25;
    const avgReturn = riskProfile === 'conservative' ? 0.15 : riskProfile === 'moderate' ? 0.25 : 0.35;
    
    const forecastData = Array.from({ length: years }, (_, i) => {
        const year = new Date().getFullYear() + i;
        const lumpsumValue = capital * Math.pow(1 + avgReturn, i);
        
        let sipValue = 0;
        for (let j = 0; j <= i * 12; j++) {
            sipValue += sip * Math.pow(1 + avgReturn / 12, i * 12 - j);
        }
        
        return {
            year,
            value: lumpsumValue + sipValue,
        };
    });

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bitcoin className="h-5 w-5 text-primary" />
                        Model Crypto Portfolio Builder
                    </CardTitle>
                    <CardDescription>
                        Build a diversified cryptocurrency portfolio based on your risk appetite
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="riskProfile">Risk Profile</Label>
                            <Select value={riskProfile} onValueChange={(v: any) => setRiskProfile(v)}>
                                <SelectTrigger id="riskProfile">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="conservative">Conservative (15% avg return)</SelectItem>
                                    <SelectItem value="moderate">Moderate (25% avg return)</SelectItem>
                                    <SelectItem value="aggressive">Aggressive (35% avg return)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="initialCapital">Initial Capital (₹)</Label>
                            <Input
                                id="initialCapital"
                                type="number"
                                value={initialCapital}
                                onChange={(e) => setInitialCapital(e.target.value)}
                                placeholder="100000"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sipAmount">Monthly SIP (₹)</Label>
                            <Input
                                id="sipAmount"
                                type="number"
                                value={sipAmount}
                                onChange={(e) => setSipAmount(e.target.value)}
                                placeholder="10000"
                            />
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Suggested Allocation</CardTitle>
                                <CardDescription>Based on {riskProfile} risk profile</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={allocationData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={(entry) => `${entry.name}: ${entry.value}%`}
                                            outerRadius={80}
                                            dataKey="value"
                                        >
                                            {allocationData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value: number) => `${value}%`} />
                                    </PieChart>
                                </ResponsiveContainer>

                                <div className="mt-4 space-y-2">
                                    {allocationData.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center p-2 rounded bg-muted/30">
                                            <div className="flex items-center gap-2">
                                                <div className="h-3 w-3 rounded" style={{ backgroundColor: COLORS[index] }} />
                                                <span className="text-sm">{item.name}</span>
                                            </div>
                                            <div className="text-sm font-semibold">{formatCurrency(item.amount)}</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Top Crypto Suggestions</CardTitle>
                                <CardDescription>Recommended cryptocurrencies by category</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-[#f7931a]" />
                                            Large Cap ({allocation.large}%)
                                        </h4>
                                        <ul className="text-sm space-y-1 ml-4">
                                            <li>• Bitcoin (BTC) - Digital Gold</li>
                                            <li>• Ethereum (ETH) - Smart Contracts</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-[#627eea]" />
                                            Mid Cap ({allocation.mid}%)
                                        </h4>
                                        <ul className="text-sm space-y-1 ml-4">
                                            <li>• Solana (SOL) - High Performance</li>
                                            <li>• Cardano (ADA) - Research-Based</li>
                                            <li>• Polkadot (DOT) - Interoperability</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-[#00d395]" />
                                            Small Cap ({allocation.small}%)
                                        </h4>
                                        <ul className="text-sm space-y-1 ml-4">
                                            <li>• Emerging DeFi Projects</li>
                                            <li>• Layer 2 Solutions</li>
                                            <li>• Web3 Infrastructure</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">25-Year Portfolio Forecast</CardTitle>
                            <CardDescription>
                                Projected growth with {formatCurrency(capital)} initial + {formatCurrency(sip)}/month SIP
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={forecastData}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis dataKey="year" />
                                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                    <Legend />
                                    <Line type="monotone" dataKey="value" stroke="#f7931a" strokeWidth={2} name="Portfolio Value" />
                                </LineChart>
                            </ResponsiveContainer>

                            <div className="mt-4 grid gap-3 md:grid-cols-3">
                                <div className="p-3 rounded-lg bg-muted/30 border">
                                    <div className="text-xs text-muted-foreground">5 Year Value</div>
                                    <div className="text-lg font-bold text-primary">
                                        {formatCurrency(forecastData[4]?.value || 0)}
                                    </div>
                                </div>
                                <div className="p-3 rounded-lg bg-muted/30 border">
                                    <div className="text-xs text-muted-foreground">15 Year Value</div>
                                    <div className="text-lg font-bold text-success">
                                        {formatCurrency(forecastData[14]?.value || 0)}
                                    </div>
                                </div>
                                <div className="p-3 rounded-lg bg-muted/30 border">
                                    <div className="text-xs text-muted-foreground">25 Year Value</div>
                                    <div className="text-lg font-bold text-chart-3">
                                        {formatCurrency(forecastData[24]?.value || 0)}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-warning/5 border-warning/20">
                        <CardHeader>
                            <CardTitle className="text-base text-warning">⚠️ Important Disclaimer</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                            <p>• Cryptocurrency investments are highly volatile and risky</p>
                            <p>• Only invest what you can afford to lose</p>
                            <p>• Past performance does not guarantee future results</p>
                            <p>• Diversification does not eliminate risk</p>
                            <p>• Consult with a financial advisor before investing</p>
                            <p>• Keep your crypto assets secure with hardware wallets</p>
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
        </div>
    );
}
