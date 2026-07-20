'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
    Sparkles, TrendingUp, TrendingDown, ShieldAlert, ArrowUpRight, CheckCircle2, 
    BrainCircuit, Activity, BarChart3, Filter, RefreshCw, Cpu, Zap, Layers, Scale, AlertCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Prediction {
    id: string;
    symbol: string;
    company: string;
    sector: string;
    currentPrice: number;
    baseTargetPrice: number;
    bullTargetPrice: number;
    bearTargetPrice: number;
    projectedReturn: number; // percentage
    signal: 'STRONG BUY' | 'BUY' | 'HOLD' | 'REDUCE';
    confidence: number; // percentage
    riskLevel: 'Low' | 'Moderate' | 'High';
    timeframe: '7 Days' | '30 Days' | '90 Days' | '1 Year';
    sentimentScore: number; // 0-100
    sparkline: number[]; // mini trend SVG points
    thesis: string;
    catalysts: string[];
    technicalMatrix: {
        rsi: number;
        macd: string;
        movingAverage: string;
        supportLevel: number;
        resistanceLevel: number;
    };
    institutionalFlow: string;
}

const STOCKIFY_PREDICTIONS: Prediction[] = [
    {
        id: '1',
        symbol: 'NVDA',
        company: 'NVIDIA Corporation',
        sector: 'Semiconductors & AI',
        currentPrice: 131.75,
        baseTargetPrice: 160.00,
        bullTargetPrice: 185.00,
        bearTargetPrice: 118.00,
        projectedReturn: 21.44,
        signal: 'STRONG BUY',
        confidence: 94,
        riskLevel: 'Moderate',
        timeframe: '90 Days',
        sentimentScore: 92,
        sparkline: [110, 115, 112, 124, 128, 131.75, 142, 150, 160],
        thesis: 'Blackwell architecture B200 production ramp and sustained hyperscaler enterprise capex indicate revenue outperformance through Q3/Q4.',
        catalysts: [
            'Blackwell server rack shipping pipeline expansion',
            'Microsoft, Google & Meta multi-billion dollar GPU orders',
            'Data Center segment revenue YoY growth +140%'
        ],
        technicalMatrix: {
            rsi: 64,
            macd: 'Bullish Crossover (+3.42)',
            movingAverage: 'Above 50-day & 200-day EMA',
            supportLevel: 122.50,
            resistanceLevel: 140.00
        },
        institutionalFlow: '+$1.4B Net Inflow (Top 1% Hedge Funds)'
    },
    {
        id: '2',
        symbol: 'MSFT',
        company: 'Microsoft Corporation',
        sector: 'Cloud & AI Software',
        currentPrice: 442.50,
        baseTargetPrice: 510.00,
        bullTargetPrice: 545.00,
        bearTargetPrice: 415.00,
        projectedReturn: 15.25,
        signal: 'STRONG BUY',
        confidence: 93,
        riskLevel: 'Low',
        timeframe: '90 Days',
        sentimentScore: 89,
        sparkline: [410, 420, 425, 435, 438, 442.5, 465, 490, 510],
        thesis: 'Enterprise Copilot seat monetization accelerating rapidly across Fortune 500 accounts while Azure AI revenue gains market share.',
        catalysts: [
            'Azure AI annual recurring revenue (ARR) surpassing $12B',
            '365 Copilot commercial seat adoption expanding 40% QoQ',
            'Strong high-margin recurring enterprise software cashflows'
        ],
        technicalMatrix: {
            rsi: 58,
            macd: 'Positive Momentum (+2.10)',
            movingAverage: 'Sustained Above 20-day SMA',
            supportLevel: 430.00,
            resistanceLevel: 455.00
        },
        institutionalFlow: '+$980M Net Inflow (Pension & Mutual Funds)'
    },
    {
        id: '3',
        symbol: 'AAPL',
        company: 'Apple Inc.',
        sector: 'Consumer Electronics & AI',
        currentPrice: 224.20,
        baseTargetPrice: 260.00,
        bullTargetPrice: 280.00,
        bearTargetPrice: 205.00,
        projectedReturn: 15.96,
        signal: 'BUY',
        confidence: 88,
        riskLevel: 'Low',
        timeframe: '60-90 Days',
        sentimentScore: 85,
        sparkline: [195, 202, 210, 218, 220, 224.2, 238, 248, 260],
        thesis: 'Apple Intelligence feature exclusivity on iPhone 16/17 models expected to trigger the largest hardware replacement cycle in 4 years.',
        catalysts: [
            'iPhone 16 Pro supercycle replacement demand',
            'Services division (App Store, iCloud, Pay) revenue all-time high',
            'On-device neural engine capabilities positioning for ecosystem lock-in'
        ],
        technicalMatrix: {
            rsi: 61,
            macd: 'Bullish Continuation (+1.85)',
            movingAverage: 'Golden Cross Formed on Daily Chart',
            supportLevel: 215.00,
            resistanceLevel: 232.00
        },
        institutionalFlow: '+$640M Net Inflow'
    },
    {
        id: '4',
        symbol: 'AMZN',
        company: 'Amazon.com Inc.',
        sector: 'E-Commerce & AWS Cloud',
        currentPrice: 186.40,
        baseTargetPrice: 225.00,
        bullTargetPrice: 245.00,
        bearTargetPrice: 170.00,
        projectedReturn: 20.71,
        signal: 'STRONG BUY',
        confidence: 91,
        riskLevel: 'Low',
        timeframe: '90 Days',
        sentimentScore: 88,
        sparkline: [168, 172, 178, 180, 184, 186.4, 198, 212, 225],
        thesis: 'AWS cloud growth re-acceleration driven by Generative AI workload migration combined with logistics regionalization efficiency gains.',
        catalysts: [
            'AWS Bedrock generative AI adoption expanding across enterprise clients',
            'North American fulfillment cost-to-serve reduction driving operating margin expansion',
            'High-margin Prime Video digital ad revenue growth (+28% YoY)'
        ],
        technicalMatrix: {
            rsi: 56,
            macd: 'Ascending Triangle Breakout',
            movingAverage: 'Above 50-day & 100-day SMA',
            supportLevel: 178.00,
            resistanceLevel: 194.00
        },
        institutionalFlow: '+$820M Net Inflow'
    },
    {
        id: '5',
        symbol: 'GOOGL',
        company: 'Alphabet Inc.',
        sector: 'Digital Advertising & AI',
        currentPrice: 178.10,
        baseTargetPrice: 210.00,
        bullTargetPrice: 230.00,
        bearTargetPrice: 162.00,
        projectedReturn: 17.91,
        signal: 'BUY',
        confidence: 87,
        riskLevel: 'Low',
        timeframe: '90 Days',
        sentimentScore: 83,
        sparkline: [155, 160, 168, 172, 175, 178.1, 190, 200, 210],
        thesis: 'Gemini 2.5 integration across Search, YouTube, and Workspace defending digital ad dominance while Google Cloud operates at 10%+ margins.',
        catalysts: [
            'Search Generative Experience (SGE) ad monetization proving effective',
            'Google Cloud Platform backlog reaching record $78B',
            'Custom TPU v5p & Ironwood silicon reducing AI inferencing costs'
        ],
        technicalMatrix: {
            rsi: 53,
            macd: 'Bullish Divergence',
            movingAverage: 'Testing 20-day EMA Resistance',
            supportLevel: 170.00,
            resistanceLevel: 185.00
        },
        institutionalFlow: '+$450M Net Inflow'
    },
    {
        id: '6',
        symbol: 'PLTR',
        company: 'Palantir Technologies',
        sector: 'Enterprise AI & Defense',
        currentPrice: 32.50,
        baseTargetPrice: 42.00,
        bullTargetPrice: 48.00,
        bearTargetPrice: 27.00,
        projectedReturn: 29.23,
        signal: 'STRONG BUY',
        confidence: 90,
        riskLevel: 'Moderate',
        timeframe: '90 Days',
        sentimentScore: 94,
        sparkline: [22, 24, 26, 28, 30, 32.5, 36, 39, 42],
        thesis: 'AIP (Artificial Intelligence Platform) bootcamps converting enterprise deals at an unprecedented rate alongside S&P 500 inclusion momentum.',
        catalysts: [
            'US Commercial revenue expanding 55%+ YoY',
            'US Department of Defense Maven AI contract expansions',
            'GAAP net income profitability for 7 consecutive quarters'
        ],
        technicalMatrix: {
            rsi: 68,
            macd: 'Strong Momentum Expansion',
            movingAverage: 'Parabolic SAR Bullish Signal',
            supportLevel: 29.50,
            resistanceLevel: 35.00
        },
        institutionalFlow: '+$510M Net Inflow'
    },
    {
        id: '7',
        symbol: 'TSLA',
        company: 'Tesla Inc.',
        sector: 'Autonomous Vehicles & Energy',
        currentPrice: 245.80,
        baseTargetPrice: 250.00,
        bullTargetPrice: 310.00,
        bearTargetPrice: 190.00,
        projectedReturn: 1.71,
        signal: 'HOLD',
        confidence: 75,
        riskLevel: 'High',
        timeframe: '30 Days',
        sentimentScore: 68,
        sparkline: [210, 225, 230, 255, 240, 245.8, 248, 250, 252],
        thesis: 'Near-term EV auto price cuts impacting gross margins balanced against long-term Robotaxi regulatory timeline and Energy Megapack growth.',
        catalysts: [
            'Full Self-Driving (FSD) v12.5 licensing negotiations with legacy OEMs',
            'Energy storage Megapack deployments doubling year-over-year',
            'Unveiling of lower-cost sub-$25k vehicle platform'
        ],
        technicalMatrix: {
            rsi: 49,
            macd: 'Neutral Sideways Range',
            movingAverage: 'Fluctuating around 50-day SMA',
            supportLevel: 220.00,
            resistanceLevel: 265.00
        },
        institutionalFlow: '-$120M Net Outflow (Short-Term Traders)'
    },
    {
        id: '8',
        symbol: 'AMD',
        company: 'Advanced Micro Devices',
        sector: 'Semiconductors & AI',
        currentPrice: 154.20,
        baseTargetPrice: 195.00,
        bullTargetPrice: 215.00,
        bearTargetPrice: 135.00,
        projectedReturn: 26.46,
        signal: 'BUY',
        confidence: 86,
        riskLevel: 'Moderate',
        timeframe: '90 Days',
        sentimentScore: 84,
        sparkline: [135, 140, 145, 150, 152, 154.2, 168, 182, 195],
        thesis: 'Instinct MI300X AI GPU adoption gaining traction as primary alternative to NVIDIA for cloud inferencing workloads.',
        catalysts: [
            'MI300 Series revenue guidance raised to $4.5B+',
            'Enterprise adoption by Microsoft, Meta, and Oracle Cloud',
            'Zen 5 EPYC server CPU market share gains against Intel'
        ],
        technicalMatrix: {
            rsi: 54,
            macd: 'Bullish Reversal Signal',
            movingAverage: 'Consolidating above 100-day EMA',
            supportLevel: 142.00,
            resistanceLevel: 165.00
        },
        institutionalFlow: '+$390M Net Inflow'
    }
];

export default function PredictionsPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedTimeframe, setSelectedTimeframe] = useState<'7 Days' | '30 Days' | '90 Days' | '1 Year'>('90 Days');
    const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(STOCKIFY_PREDICTIONS[0]);
    const [isReevaluating, setIsReevaluating] = useState(false);
    const [predictionsData, setPredictionsData] = useState<Prediction[]>(STOCKIFY_PREDICTIONS);

    const categories = ['All', 'Strong Buy', 'Semiconductors & AI', 'Cloud & AI Software', 'Low Risk'];

    const handleReevaluateModel = () => {
        setIsReevaluating(true);
        toast.info('Stockify AI Neural Engine re-processing 50,000+ market data points...');

        setTimeout(() => {
            // Slightly nudge confidence / target prices to simulate live neural recalculation
            const updated = predictionsData.map(p => ({
                ...p,
                confidence: Math.min(98, Math.max(70, p.confidence + (Math.floor(Math.random() * 3) - 1))),
                sentimentScore: Math.min(99, Math.max(60, p.sentimentScore + (Math.floor(Math.random() * 3) - 1)))
            }));
            setPredictionsData(updated);
            if (selectedPrediction) {
                const refreshedSelected = updated.find(u => u.symbol === selectedPrediction.symbol);
                if (refreshedSelected) setSelectedPrediction(refreshedSelected);
            }
            setIsReevaluating(false);
            toast.success('Stockify AI Neural Signals updated successfully!');
        }, 1200);
    };

    const filteredPredictions = predictionsData.filter(p => {
        if (selectedCategory === 'All') return true;
        if (selectedCategory === 'Strong Buy') return p.signal === 'STRONG BUY';
        if (selectedCategory === 'Semiconductors & AI') return p.sector.includes('Semiconductors');
        if (selectedCategory === 'Cloud & AI Software') return p.sector.includes('Cloud');
        if (selectedCategory === 'Low Risk') return p.riskLevel === 'Low';
        return true;
    });

    return (
        <div className="min-h-screen space-y-8 text-gray-200">
            {/* Header Hero Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-950 via-slate-900 to-yellow-950/40 border border-yellow-500/30 p-6 md:p-8 shadow-2xl backdrop-blur-md">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-3 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/15 border border-yellow-500/40 text-yellow-400 text-xs font-bold tracking-wide uppercase">
                            <Cpu className="w-4 h-4 animate-spin text-yellow-400" />
                            Stockify AI Deep Learning Alpha Model v4.5
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                            AI Stock Market Signals & Price Targets
                        </h1>
                        <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                            Real-time quantitative price forecasts generated by neural sentiment parsing of 10,000+ daily financial news articles, options flow, and technical momentum indicators.
                        </p>
                    </div>

                    <div className="flex flex-wrap sm:flex-nowrap lg:flex-col gap-3 shrink-0">
                        <Button
                            onClick={handleReevaluateModel}
                            disabled={isReevaluating}
                            className="yellow-btn flex items-center gap-2 px-5 py-3 text-sm font-bold shadow-lg"
                        >
                            <RefreshCw className={`w-4 h-4 ${isReevaluating ? 'animate-spin' : ''}`} />
                            {isReevaluating ? 'Processing Neural Model...' : 'Re-Run AI Neural Engine'}
                        </Button>
                        <div className="flex items-center justify-between gap-2 px-4 py-2 bg-gray-900/90 border border-gray-800 rounded-xl text-xs text-gray-400">
                            <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                                Live Stream Active
                            </span>
                            <span>Latency: 42ms</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-900/90 border border-gray-800 p-5 rounded-xl flex items-center gap-4 hover:border-yellow-500/30 transition-all">
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                        <Zap className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 font-medium">Top High-Conviction Pick</div>
                        <div className="text-lg font-bold text-white">PLTR (+29.2%)</div>
                        <div className="text-xs text-emerald-400 font-semibold">Strong Buy Signal</div>
                    </div>
                </div>

                <div className="bg-gray-900/90 border border-gray-800 p-5 rounded-xl flex items-center gap-4 hover:border-yellow-500/30 transition-all">
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400">
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 font-medium">Market Sentiment Index</div>
                        <div className="text-lg font-bold text-white">88/100 (Bullish)</div>
                        <div className="text-xs text-yellow-400 font-semibold">Extreme Institutional Buy</div>
                    </div>
                </div>

                <div className="bg-gray-900/90 border border-gray-800 p-5 rounded-xl flex items-center gap-4 hover:border-yellow-500/30 transition-all">
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
                        <BarChart3 className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 font-medium">Avg Target Return</div>
                        <div className="text-lg font-bold text-white">+18.57%</div>
                        <div className="text-xs text-blue-400 font-semibold">Over 90-Day Horizon</div>
                    </div>
                </div>

                <div className="bg-gray-900/90 border border-gray-800 p-5 rounded-xl flex items-center gap-4 hover:border-yellow-500/30 transition-all">
                    <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
                        <BrainCircuit className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 font-medium">Historical Model Accuracy</div>
                        <div className="text-lg font-bold text-white">94.2% Precision</div>
                        <div className="text-xs text-purple-400 font-semibold">Backtested 2024-2026</div>
                    </div>
                </div>
            </div>

            {/* Time Horizon & Filter Controls */}
            <div className="bg-gray-900/80 border border-gray-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    <Filter className="w-4 h-4 text-gray-400 mr-1 shrink-0" />
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                selectedCategory === cat
                                    ? 'bg-yellow-500 text-yellow-950 font-bold shadow-md'
                                    : 'bg-gray-950 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Timeframe Selector */}
                <div className="flex items-center gap-2 bg-gray-950 p-1 rounded-lg border border-gray-800">
                    <span className="text-[11px] text-gray-400 font-semibold px-2">Forecast Horizon:</span>
                    {(['7 Days', '30 Days', '90 Days', '1 Year'] as const).map(tf => (
                        <button
                            key={tf}
                            onClick={() => setSelectedTimeframe(tf)}
                            className={`px-2.5 py-1 text-[11px] font-bold rounded transition-all ${
                                selectedTimeframe === tf
                                    ? 'bg-gray-800 text-yellow-400 border border-yellow-500/30'
                                    : 'text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left 2 Columns: Stock Prediction Grid */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredPredictions.map(item => {
                        const isSelected = selectedPrediction?.symbol === item.symbol;
                        const isStrongBuy = item.signal === 'STRONG BUY';
                        const isBuy = item.signal === 'BUY';
                        const isHold = item.signal === 'HOLD';

                        return (
                            <div
                                key={item.id}
                                onClick={() => setSelectedPrediction(item)}
                                className={`cursor-pointer rounded-2xl border p-5 transition-all flex flex-col justify-between space-y-4 relative ${
                                    isSelected
                                        ? 'bg-gray-900 border-yellow-500/60 shadow-xl ring-1 ring-yellow-500/40'
                                        : 'bg-gray-900/60 border-gray-800 hover:border-gray-700 hover:bg-gray-900/90'
                                }`}
                            >
                                <div>
                                    {/* Top Row: Symbol & Signal Badge */}
                                    <div className="flex items-start justify-between gap-3 mb-2">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-2xl font-black text-white tracking-wide">{item.symbol}</h3>
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700">
                                                    {item.sector}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400 line-clamp-1">{item.company}</p>
                                        </div>

                                        <span
                                            className={`text-xs px-3 py-1 font-black rounded-full border tracking-wide ${
                                                isStrongBuy
                                                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                                                    : isBuy
                                                    ? 'bg-blue-500/15 text-blue-400 border-blue-500/40'
                                                    : 'bg-yellow-500/15 text-yellow-400 border-yellow-500/40'
                                            }`}
                                        >
                                            {item.signal}
                                        </span>
                                    </div>

                                    {/* Mini SVG Trend Sparkline */}
                                    <div className="py-2">
                                        <div className="h-8 w-full flex items-end">
                                            <svg className="w-full h-8 overflow-visible" viewBox="0 0 100 30">
                                                <polyline
                                                    fill="none"
                                                    stroke={isStrongBuy || isBuy ? "#10B981" : "#F59E0B"}
                                                    strokeWidth="2.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    points={item.sparkline.map((val, idx) => {
                                                        const min = Math.min(...item.sparkline);
                                                        const max = Math.max(...item.sparkline);
                                                        const range = max - min || 1;
                                                        const x = (idx / (item.sparkline.length - 1)) * 100;
                                                        const y = 28 - ((val - min) / range) * 24;
                                                        return `${x},${y}`;
                                                    }).join(' ')}
                                                />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Target Prices Row */}
                                    <div className="grid grid-cols-2 gap-3 py-3 border-y border-gray-800/80 my-2 bg-gray-950/40 px-3 rounded-lg">
                                        <div>
                                            <div className="text-[10px] text-gray-500 font-semibold uppercase">Current Price</div>
                                            <div className="text-base font-bold text-gray-200">${item.currentPrice.toFixed(2)}</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-gray-500 font-semibold uppercase">AI Target Price</div>
                                            <div className="text-base font-black text-emerald-400 flex items-center gap-1">
                                                ${item.baseTargetPrice.toFixed(2)}
                                                <span className="text-xs font-bold">+{item.projectedReturn.toFixed(1)}%</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Summary Thesis */}
                                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                                        {item.thesis}
                                    </p>
                                </div>

                                {/* Confidence Score Bar */}
                                <div className="pt-2 space-y-1.5">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-400 text-[11px]">AI Confidence Score</span>
                                        <span className="font-bold text-yellow-400">{item.confidence}%</span>
                                    </div>
                                    <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-yellow-500 via-emerald-400 to-emerald-300 h-full rounded-full transition-all duration-500"
                                            style={{ width: `${item.confidence}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Right Column: Detailed Stockify AI Deep Analysis Inspector */}
                {selectedPrediction && (
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6 lg:sticky lg:top-24 h-fit shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                            <div>
                                <div className="text-[11px] font-bold text-yellow-400 tracking-wider uppercase flex items-center gap-1.5">
                                    <BrainCircuit className="w-4 h-4" />
                                    Stockify Quantitative Intelligence
                                </div>
                                <h2 className="text-2xl font-black text-white mt-1">{selectedPrediction.symbol} Forecast</h2>
                                <p className="text-xs text-gray-400">{selectedPrediction.company}</p>
                            </div>
                            <Link href={`/stocks/${selectedPrediction.symbol}`}>
                                <Button variant="outline" size="sm" className="text-xs border-gray-700 hover:bg-gray-800 text-yellow-400">
                                    Live Chart <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                                </Button>
                            </Link>
                        </div>

                        {/* Recommendation Banner */}
                        <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 flex items-center justify-between">
                            <div>
                                <div className="text-[10px] text-gray-500 uppercase font-semibold">AI Recommendation</div>
                                <div className="text-xl font-black text-emerald-400 tracking-wide">{selectedPrediction.signal}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] text-gray-500 uppercase font-semibold">Institutional Net Flow</div>
                                <div className="text-xs font-bold text-gray-200">{selectedPrediction.institutionalFlow}</div>
                            </div>
                        </div>

                        {/* Price Scenario Matrix (Bull / Base / Bear) */}
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Target Price Scenarios ({selectedTimeframe})</h4>
                            <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                <div className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl">
                                    <div className="text-emerald-400 text-[10px] font-bold uppercase">Bull Case</div>
                                    <div className="font-extrabold text-emerald-300 mt-0.5">${selectedPrediction.bullTargetPrice.toFixed(2)}</div>
                                </div>
                                <div className="bg-yellow-500/10 border border-yellow-500/20 p-2.5 rounded-xl">
                                    <div className="text-yellow-400 text-[10px] font-bold uppercase">Base Case</div>
                                    <div className="font-extrabold text-yellow-300 mt-0.5">${selectedPrediction.baseTargetPrice.toFixed(2)}</div>
                                </div>
                                <div className="bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
                                    <div className="text-rose-400 text-[10px] font-bold uppercase">Bear Case</div>
                                    <div className="font-extrabold text-rose-300 mt-0.5">${selectedPrediction.bearTargetPrice.toFixed(2)}</div>
                                </div>
                            </div>
                        </div>

                        {/* AI Thesis Summary */}
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Neural Model Investment Thesis</h4>
                            <p className="text-xs text-gray-300 leading-relaxed bg-gray-950/80 p-3.5 rounded-xl border border-gray-800">
                                {selectedPrediction.thesis}
                            </p>
                        </div>

                        {/* Key Catalysts */}
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Identified Catalyst Events</h4>
                            <ul className="space-y-2">
                                {selectedPrediction.catalysts.map((cat, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-xs text-gray-300 bg-gray-950/40 p-2 rounded-lg border border-gray-800/60">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                        <span>{cat}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Technical Indicator Matrix */}
                        <div className="space-y-2 pt-2 border-t border-gray-800">
                            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Quantitative Technical Matrix</h4>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="bg-gray-950 p-2.5 rounded-xl border border-gray-800">
                                    <div className="text-gray-500 text-[10px]">RSI (14-day)</div>
                                    <div className="font-bold text-gray-200">{selectedPrediction.technicalMatrix.rsi} (Healthy)</div>
                                </div>
                                <div className="bg-gray-950 p-2.5 rounded-xl border border-gray-800">
                                    <div className="text-gray-500 text-[10px]">MACD Signal</div>
                                    <div className="font-bold text-emerald-400 truncate">{selectedPrediction.technicalMatrix.macd}</div>
                                </div>
                                <div className="bg-gray-950 p-2.5 rounded-xl border border-gray-800">
                                    <div className="text-gray-500 text-[10px]">Key Support</div>
                                    <div className="font-bold text-gray-200">${selectedPrediction.technicalMatrix.supportLevel.toFixed(2)}</div>
                                </div>
                                <div className="bg-gray-950 p-2.5 rounded-xl border border-gray-800">
                                    <div className="text-gray-500 text-[10px]">Key Resistance</div>
                                    <div className="font-bold text-yellow-400">${selectedPrediction.technicalMatrix.resistanceLevel.toFixed(2)}</div>
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <Link href={`/stocks/${selectedPrediction.symbol}`} className="block pt-2">
                            <Button className="yellow-btn w-full text-sm font-bold shadow-lg">
                                Open Interactive Technical Chart for {selectedPrediction.symbol}
                            </Button>
                        </Link>
                    </div>
                )}
            </div>

            {/* Presentation & Educational Disclaimer */}
            <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5 text-xs text-yellow-200/90 flex items-start gap-3.5 shadow-xl">
                <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                <div>
                    <span className="font-bold text-yellow-400 text-sm block mb-1">Stockify Academic Demonstration Notice:</span>
                    Stockify AI predictive signals, price target scenario cones, and confidence ratings are generated using synthetic machine learning market modeling for presentation in computer science and software engineering academic evaluation.
                </div>
            </div>
        </div>
    );
}
