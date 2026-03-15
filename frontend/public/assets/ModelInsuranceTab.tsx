import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Heart, Users, TrendingUp, AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useCurrency } from '../contexts/CurrencyContext';

type InsuranceType = 'health' | 'life';
type Gender = 'male' | 'female' | 'other';
type HealthCondition = 'excellent' | 'good' | 'fair' | 'poor';
type SmokingStatus = 'non-smoker' | 'smoker';

interface PremiumRecommendation {
    minPremium: number;
    maxPremium: number;
    coverageAmount: number;
    explanation: string;
    factors: string[];
}

export function ModelInsuranceTab() {
    const { formatCurrency } = useCurrency();
    const [insuranceType, setInsuranceType] = useState<InsuranceType>('health');
    const [age, setAge] = useState<string>('30');
    const [gender, setGender] = useState<Gender>('male');
    const [lifeExpectancy, setLifeExpectancy] = useState<string>('75');
    const [smokingStatus, setSmokingStatus] = useState<SmokingStatus>('non-smoker');
    const [healthCondition, setHealthCondition] = useState<HealthCondition>('good');
    const [annualIncome, setAnnualIncome] = useState<string>('1000000');
    const [familyMembers, setFamilyMembers] = useState<string>('4');
    const [recommendation, setRecommendation] = useState<PremiumRecommendation | null>(null);

    // Auto-calculate when inputs change
    useEffect(() => {
        calculatePremium();
    }, [insuranceType, age, gender, lifeExpectancy, smokingStatus, healthCondition, annualIncome, familyMembers]);

    const calculatePremium = () => {
        const ageNum = parseInt(age) || 30;
        const incomeNum = parseFloat(annualIncome) || 1000000;
        const familyNum = parseInt(familyMembers) || 4;
        const lifeExpNum = parseInt(lifeExpectancy) || 75;

        let basePremium = 0;
        let coverageMultiplier = 1;
        let riskMultiplier = 1;

        if (insuranceType === 'health') {
            // Health Insurance Calculation (Indian market benchmarks)
            basePremium = 5000; // Base premium per person
            
            // Age factor
            if (ageNum < 25) riskMultiplier *= 0.8;
            else if (ageNum < 35) riskMultiplier *= 1.0;
            else if (ageNum < 45) riskMultiplier *= 1.3;
            else if (ageNum < 55) riskMultiplier *= 1.7;
            else riskMultiplier *= 2.2;

            // Health condition factor
            if (healthCondition === 'excellent') riskMultiplier *= 0.9;
            else if (healthCondition === 'good') riskMultiplier *= 1.0;
            else if (healthCondition === 'fair') riskMultiplier *= 1.3;
            else riskMultiplier *= 1.6;

            // Smoking status
            if (smokingStatus === 'smoker') riskMultiplier *= 1.4;

            // Family members
            const familyPremium = basePremium * familyNum * riskMultiplier;

            // Income-based coverage (5-10 lakhs typical for middle income)
            const suggestedCoverage = Math.min(Math.max(incomeNum * 0.5, 500000), 2000000);
            coverageMultiplier = suggestedCoverage / 500000;

            const minPremium = familyPremium * coverageMultiplier * 0.85;
            const maxPremium = familyPremium * coverageMultiplier * 1.15;

            setRecommendation({
                minPremium: Math.round(minPremium),
                maxPremium: Math.round(maxPremium),
                coverageAmount: Math.round(suggestedCoverage),
                explanation: `Based on your profile, we recommend a health insurance plan with coverage of ${formatCurrency(suggestedCoverage)} for ${familyNum} family member(s). The premium range reflects typical Indian market rates adjusted for your age, health condition, and family size.`,
                factors: [
                    `Age ${ageNum}: ${ageNum < 35 ? 'Lower' : ageNum < 50 ? 'Moderate' : 'Higher'} risk category`,
                    `Health Condition (${healthCondition}): ${healthCondition === 'excellent' || healthCondition === 'good' ? 'Favorable' : 'Requires attention'}`,
                    `${smokingStatus === 'smoker' ? 'Smoking increases premium by ~40%' : 'Non-smoker discount applied'}`,
                    `Family size (${familyNum} members): Premium scales with coverage`,
                    `Income-based coverage: ${formatCurrency(suggestedCoverage)} recommended`,
                ],
            });
        } else {
            // Life Insurance Calculation (Indian market benchmarks)
            basePremium = 8000; // Base annual premium
            
            // Coverage typically 10-15x annual income
            const suggestedCoverage = incomeNum * 12;
            
            // Age factor
            if (ageNum < 25) riskMultiplier *= 0.7;
            else if (ageNum < 35) riskMultiplier *= 0.9;
            else if (ageNum < 45) riskMultiplier *= 1.2;
            else if (ageNum < 55) riskMultiplier *= 1.6;
            else riskMultiplier *= 2.3;

            // Life expectancy factor
            const yearsRemaining = lifeExpNum - ageNum;
            if (yearsRemaining > 40) riskMultiplier *= 0.9;
            else if (yearsRemaining < 20) riskMultiplier *= 1.3;

            // Health and lifestyle factors
            if (healthCondition === 'excellent') riskMultiplier *= 0.85;
            else if (healthCondition === 'good') riskMultiplier *= 1.0;
            else if (healthCondition === 'fair') riskMultiplier *= 1.4;
            else riskMultiplier *= 1.8;

            if (smokingStatus === 'smoker') riskMultiplier *= 1.5;

            // Gender factor (actuarial)
            if (gender === 'female') riskMultiplier *= 0.95;

            // Coverage-based premium
            coverageMultiplier = suggestedCoverage / 10000000; // Normalize to 1 crore
            const totalPremium = basePremium * riskMultiplier * coverageMultiplier;

            const minPremium = totalPremium * 0.9;
            const maxPremium = totalPremium * 1.1;

            setRecommendation({
                minPremium: Math.round(minPremium),
                maxPremium: Math.round(maxPremium),
                coverageAmount: Math.round(suggestedCoverage),
                explanation: `Based on your profile, we recommend a life insurance policy with coverage of ${formatCurrency(suggestedCoverage)} (approximately 12x your annual income). This ensures adequate financial protection for your family. The premium range is calculated using Indian market actuarial standards.`,
                factors: [
                    `Age ${ageNum}: ${ageNum < 35 ? 'Younger age = lower premium' : 'Premium increases with age'}`,
                    `Life Expectancy (${lifeExpNum} years): ${yearsRemaining} years remaining`,
                    `Health Condition (${healthCondition}): Impacts risk assessment`,
                    `${smokingStatus === 'smoker' ? 'Smoking significantly increases premium (~50%)' : 'Non-smoker benefit applied'}`,
                    `Coverage: ${formatCurrency(suggestedCoverage)} (12x annual income of ${formatCurrency(incomeNum)})`,
                    `Gender (${gender}): ${gender === 'female' ? 'Slight premium advantage' : 'Standard rates'}`,
                ],
            });
        }
    };

    return (
        <div className="space-y-6 p-6 animate-slide-up">
            <Card className="shadow-premium-lg border-border/50 bg-gradient-to-br from-card to-muted/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-info/20 to-chart-4/20">
                            <Shield className="h-6 w-6 text-info" />
                        </div>
                        Insurance Premium Calculator
                    </CardTitle>
                    <CardDescription className="text-base">
                        Get insurance premium estimates based on Indian market benchmarks
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card className="shadow-premium border-border/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Shield className="h-5 w-5 text-primary" />
                                    Insurance Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="insuranceType">Insurance Type</Label>
                                    <Select value={insuranceType} onValueChange={(value) => setInsuranceType(value as InsuranceType)}>
                                        <SelectTrigger id="insuranceType">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="health">
                                                <div className="flex items-center gap-2">
                                                    <Heart className="h-4 w-4 text-success" />
                                                    Health Insurance
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="life">
                                                <div className="flex items-center gap-2">
                                                    <Shield className="h-4 w-4 text-primary" />
                                                    Life Insurance
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="age">Age (years)</Label>
                                        <Input
                                            id="age"
                                            type="number"
                                            value={age}
                                            onChange={(e) => setAge(e.target.value)}
                                            min="18"
                                            max="80"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="gender">Gender</Label>
                                        <Select value={gender} onValueChange={(value) => setGender(value as Gender)}>
                                            <SelectTrigger id="gender">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="male">Male</SelectItem>
                                                <SelectItem value="female">Female</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {insuranceType === 'life' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="lifeExpectancy">Life Expectancy (years)</Label>
                                        <Input
                                            id="lifeExpectancy"
                                            type="number"
                                            value={lifeExpectancy}
                                            onChange={(e) => setLifeExpectancy(e.target.value)}
                                            min="50"
                                            max="100"
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="smokingStatus">Smoking Status</Label>
                                    <Select value={smokingStatus} onValueChange={(value) => setSmokingStatus(value as SmokingStatus)}>
                                        <SelectTrigger id="smokingStatus">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="non-smoker">Non-Smoker</SelectItem>
                                            <SelectItem value="smoker">Smoker</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="healthCondition">Health Condition</Label>
                                    <Select value={healthCondition} onValueChange={(value) => setHealthCondition(value as HealthCondition)}>
                                        <SelectTrigger id="healthCondition">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="excellent">Excellent</SelectItem>
                                            <SelectItem value="good">Good</SelectItem>
                                            <SelectItem value="fair">Fair</SelectItem>
                                            <SelectItem value="poor">Poor</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="annualIncome">Annual Income (₹)</Label>
                                    <Input
                                        id="annualIncome"
                                        type="number"
                                        value={annualIncome}
                                        onChange={(e) => setAnnualIncome(e.target.value)}
                                        min="0"
                                        step="100000"
                                    />
                                </div>

                                {insuranceType === 'health' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="familyMembers">Number of Family Members</Label>
                                        <Input
                                            id="familyMembers"
                                            type="number"
                                            value={familyMembers}
                                            onChange={(e) => setFamilyMembers(e.target.value)}
                                            min="1"
                                            max="10"
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="shadow-premium border-border/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <TrendingUp className="h-5 w-5 text-success" />
                                    Premium Recommendation
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {recommendation ? (
                                    <div className="space-y-6">
                                        <Card className="bg-gradient-to-br from-success/10 to-chart-2/10 border-success/20">
                                            <CardContent className="pt-6">
                                                <div className="text-center space-y-3">
                                                    <p className="text-sm text-muted-foreground">Estimated Annual Premium Range</p>
                                                    <div className="text-3xl font-bold text-success">
                                                        {formatCurrency(recommendation.minPremium)} - {formatCurrency(recommendation.maxPremium)}
                                                    </div>
                                                    <div className="pt-2 border-t border-success/20">
                                                        <p className="text-sm text-muted-foreground mb-1">Recommended Coverage</p>
                                                        <p className="text-xl font-bold text-primary">
                                                            {formatCurrency(recommendation.coverageAmount)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <div className="space-y-3">
                                            <h4 className="font-semibold text-sm flex items-center gap-2">
                                                <Info className="h-4 w-4 text-info" />
                                                How We Calculated This
                                            </h4>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                {recommendation.explanation}
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            <h4 className="font-semibold text-sm">Key Factors Considered:</h4>
                                            <ul className="space-y-2">
                                                {recommendation.factors.map((factor, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-sm">
                                                        <span className="text-primary font-bold mt-0.5">•</span>
                                                        <span className="text-muted-foreground">{factor}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <Alert className="bg-warning/5 border-warning/20">
                                            <AlertCircle className="h-4 w-4 text-warning" />
                                            <AlertDescription className="text-xs">
                                                <strong>Important:</strong> This is an estimate based on typical Indian market rates. 
                                                Actual premiums may vary based on insurer policies, medical underwriting, policy riders, and current market conditions. 
                                                Please consult with licensed insurance advisors for personalized quotes.
                                            </AlertDescription>
                                        </Alert>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                                        <div className="p-4 rounded-full bg-muted/30">
                                            <Shield className="h-12 w-12 text-muted-foreground" />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium">No Recommendation Yet</p>
                                            <p className="text-xs text-muted-foreground max-w-xs">
                                                Fill in your details to get personalized insurance recommendations
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card className="shadow-premium border-border/50 bg-gradient-to-br from-success/5 to-transparent">
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-3">
                                    <Heart className="h-5 w-5 text-success mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold mb-1">Health Insurance Benefits</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Covers hospitalization, surgeries, and medical expenses. Family floater plans provide comprehensive coverage for all members.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-premium border-border/50 bg-gradient-to-br from-primary/5 to-transparent">
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-3">
                                    <Shield className="h-5 w-5 text-primary mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold mb-1">Life Insurance Benefits</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Provides financial security to your family in case of unfortunate events. Term plans offer maximum coverage at affordable premiums.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
