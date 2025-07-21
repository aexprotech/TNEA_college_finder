import React, { useEffect, useState } from 'react';
import { SmartSearchResult } from '../App';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { 
  BookOpen, Briefcase, TrendingUp, DollarSign, Clock, 
  Award, Target, Users, GraduationCap, AlertTriangle, X, Building 
} from "lucide-react";


interface CourseInsightsModalProps {
  college: SmartSearchResult;
  onClose: () => void;
}

const mapInsightToModel = (insight: any) => {
  return {
    aboutCareer: insight["Course Description"] || '',
    whatYouStudy: insight["Fundamental Concepts"] || [],
    skillsYouDevelop: [
      ...(insight["Theoretical Skills"] || []),
      ...(insight["Practical Applications"] ? [insight["Practical Applications"]] : [])
    ],
    jobs: insight["Job Positions"] || [],
    marketAnalysis: [
      insight["Fee Structure"] ? `Fee Structure: ${Object.values(insight["Fee Structure"]).join(', ')}` : '',
      insight["Market Demand"] ? `Market Demand: ${insight["Market Demand"]}` : '',
      insight["Salary"] ? `Salary: ${Object.entries(insight["Salary"]).map(([k,v]) => `${k}: ${v}`).join(', ')}` : ''
    ].filter(Boolean).join(' | '),
    courseFee: insight["Fee Structure"] ? Object.values(insight["Fee Structure"]).join(', ') : '',
    expectedSalary: insight["Salary"] ? Object.entries(insight["Salary"]).map(([k,v]) => `${k}: ${v}`).join(', ') : '',
    currentMarketTrends: insight["Industry Trends"] ? insight["Industry Trends"].join(', ') : '',
    disclaimer: 'This information is provided for guidance only. Data may change. Please verify with official sources.'
  };
};

const CourseInsightsModal: React.FC<CourseInsightsModalProps> = ({ college, onClose }) => {
  const [insight, setInsight] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const module = await import('../data/courseInsights.json');
        const data = module.default || module;
        // Improved normalization: remove all special characters (including spaces), lowercase
        const normalize = (str: string) => {
          return (str || '')
            .toLowerCase()
            .replace(/[^a-z0-9]/gi, ''); // Remove all non-alphanumeric chars
        };
        const courseName = normalize(college.branch_name || '');
        // Debug logging
        // console.log('Searching for:', courseName);
        // console.log('Available keys:', Object.keys(data));
        // Find the key that contains or is contained within the branch name
        const foundKey = Object.keys(data).find(key => {
          const normalizedKey = normalize(key);
          return normalizedKey === courseName;
        });
        // console.log('Found match:', foundKey);
        setInsight(foundKey ? data[foundKey as keyof typeof data] : null);
      } catch (error) {
        // console.error('Error loading insights:', error);
        setInsight(null);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, [college.branch_name]);

  if (loading) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent>
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!insight) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>No Insights Available</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p>No detailed insights found for {college.branch_name}.</p>
            <p className="text-sm text-gray-500 mt-2">
              We're working to add more course information. Check back later!
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const getMetrics = (insight: any) => {
    const metrics: any = {};
    
    if (insight?.["Market Demand"]) {
      const demandStr = insight["Market Demand"];
      let value = 70, level = 'Medium';
      if (/very high|extremely high|high/i.test(demandStr)) { value = 90; level = 'High'; }
      else if (/moderate/i.test(demandStr)) { value = 70; level = 'Medium'; }
      else if (/low/i.test(demandStr)) { value = 50; level = 'Low'; }
      metrics.demand = { value, level };
    }

    if (insight?.["Salary"]?.Entry) {
      const entry = insight["Salary"].Entry;
      const matches = entry.match(/\d+\.?\d*/g);
      let value = 50, level = 'Medium'; // Default values

      if (matches && matches.length > 0) {
        const lowEndSalary = parseFloat(matches[0]);
        const highEndSalary = matches.length > 1 ? parseFloat(matches[matches.length - 1]) : lowEndSalary;
        
        if (highEndSalary <= 5) {
          level = 'Low';
        } else if (highEndSalary <= 8) {
          level = 'Medium';
        } else {
          level = 'High';
        }

        const averageSalary = (lowEndSalary + highEndSalary) / 2;
        // Scale salary to a 0-100 value for the progress bar.
        // Assuming a max entry-level salary of around 15 LPA for scaling.
        const maxSalary = 15;
        value = Math.min(Math.round((averageSalary / maxSalary) * 100), 100);
        
        metrics.salary = { value, level };
      }
    }

    if (insight?.["Course Complexity"]) {
      const comp = parseFloat(insight["Course Complexity"].replace(/[^\d.]/g, ''));
      if (!isNaN(comp)) {
        metrics.preparation = { 
          value: Math.round(comp * 10), 
          level: comp > 8 ? 'High' : comp > 6 ? 'Medium' : 'Low' 
        };
      }
    }
    return metrics;
  };

  const getMetricColor = (metric: string, level: string) => {
    const colors = {
      fee: {
        High: 'bg-red-100 text-red-800',
        Medium: 'bg-yellow-100 text-yellow-800',
        Low: 'bg-green-100 text-green-800'
      },
      default: {
        High: 'bg-green-100 text-green-800',
        Medium: 'bg-yellow-100 text-yellow-800',
        Low: 'bg-red-100 text-red-800'
      }
    };
    return metric === 'fee' 
      ? colors.fee[level as keyof typeof colors.fee] 
      : colors.default[level as keyof typeof colors.default];
  };

  const model = mapInsightToModel(insight);
  const metrics = getMetrics(insight);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 m-0 rounded-lg">
        {/* Header with gradient background restored */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-indigo-700 py-4 px-6 text-white">
          <DialogHeader className="flex-row items-center">
            <div className="flex items-center gap-4 w-full">
              <div className="bg-white/20 p-3 rounded-full">
                <BookOpen className="h-6 w-6" />
              </div>
              <div className="text-left w-full">
                <DialogTitle className="text-2xl font-bold text-left w-full">
                  {college.branch_name || 'Course Insights'}
                </DialogTitle>
                <p className="text-sm opacity-90 text-left w-full">{college.college_name}</p>
              </div>
            </div>
          </DialogHeader>
        </div>
        {/* Close button at top-right corner of modal */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 rounded-full p-1 bg-white/20 hover:bg-white/30 transition-colors"
          title="Close"
        >
          <X className="h-5 w-5 text-white" />
        </button>

        <div className="p-6 space-y-6 overflow-y-auto">
          {/* About Career - should come first */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
              About This Career
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{model.aboutCareer}</p>
          </section>

          {/* Key Metrics Cards */}
          {metrics && (
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                Key Metrics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="border border-green-100">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <CardTitle className="text-sm font-medium">Market Demand</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-end justify-between">
                      <span className="text-lg font-bold text-green-600">{metrics.demand.level}</span>
                      <Progress value={metrics.demand.value} className="w-1/2"/>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-purple-100">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="h-4 w-4 text-purple-600" />
                      <CardTitle className="text-sm font-medium">Salary Potential</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-end justify-between">
                      <span className="text-lg font-bold text-purple-600">{metrics.salary.level}</span>
                      <Progress value={metrics.salary.value} className="w-1/2"/>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-orange-100">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="h-4 w-4 text-orange-600" />
                      <CardTitle className="text-sm font-medium">Preparation Level</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-end justify-between">
                      <span className="text-lg font-bold text-orange-600">{metrics.preparation.level}</span>
                      <Progress value={metrics.preparation.value} className="w-1/2"/>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          )}

          {/* Curriculum and Skills */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <Target className="h-5 w-5 mr-2 text-indigo-600" />
              Curriculum & Skills
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium flex items-center">
                    What You'll Study
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 list-disc list-inside">
                    {(model.whatYouStudy || []).map((item: any, idx: number) => (
                      <li key={idx} className="text-gray-800 pl-2">{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium flex items-center">
                    Skills You'll Develop
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(model.skillsYouDevelop || []).map((item: any, idx: number) => (
                      <Badge key={idx} variant="secondary">{item}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Career Opportunities */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-amber-600" />
              Career Opportunities
            </h3>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Job Roles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 list-disc list-inside">
                  {(model.jobs || []).length ? (model.jobs || []).map((item: any, idx: number) => (
                    <li key={idx} className="text-gray-800 pl-2">{item}</li>
                  )) : (
                    <li className="text-gray-500">No major job roles listed</li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Market Insights */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-purple-600" />
              Market & Financials
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium flex items-center">
                    Fee Structure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {insight["Fee Structure"] && typeof insight["Fee Structure"] === 'object' ? (
                    <ul className="list-disc list-inside space-y-1">
                      {Object.entries(insight["Fee Structure"]).map(([type, value]: [string, any], idx) => (
                        <li key={idx} className="text-gray-800 pl-2">{type}: {value}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700">{model.courseFee || 'Not available'}</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium flex items-center">
                    Salary Expectations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {insight["Salary"] && typeof insight["Salary"] === 'object' ? (
                    <ul className="list-disc list-inside space-y-1">
                      {Object.entries(insight["Salary"]).map(([type, value]: [string, any], idx) => (
                        <li key={idx} className="text-gray-800 pl-2">{type}: {value}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700">{model.expectedSalary || 'Not available'}</p>
                  )}
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium flex items-center">
                    Market Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {Array.isArray(insight["Industry Trends"]) ? (
                    <ul className="list-disc list-inside space-y-1">
                      {insight["Industry Trends"].map((trend: string, idx: number) => (
                        <li key={idx} className="text-gray-800 pl-2">{trend}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700">{model.currentMarketTrends || 'Not available'}</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Disclaimer */}
          <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800 mb-1">Important Disclaimer</h4>
                <p className="text-sm text-amber-700">
                  {model.disclaimer}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseInsightsModal;