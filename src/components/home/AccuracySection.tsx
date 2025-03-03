
import React from 'react';
import { Bar } from 'recharts';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const comparisonData = [
  { name: 'TuneMigrate', accuracy: 95, color: '#3B82F6' },
  { name: 'Competitor A', accuracy: 78, color: '#9CA3AF' },
  { name: 'Competitor B', accuracy: 65, color: '#D1D5DB' },
];

const ComparisonChart = () => {
  return (
    <div className="h-64 w-full">
      <div className="h-full w-full flex items-end space-x-12 justify-center">
        {comparisonData.map((entry, index) => (
          <div key={index} className="flex flex-col items-center">
            <div 
              className="w-24 transition-all duration-1000 ease-out relative rounded-t-lg" 
              style={{ 
                height: `${entry.accuracy * 0.8}%`, 
                backgroundColor: entry.color,
                transition: 'height 1.5s ease-out',
                transitionDelay: `${index * 200}ms`,
              }}
            >
              <div className="absolute -top-8 w-full text-center font-semibold">
                {entry.accuracy}%
              </div>
            </div>
            <div className="mt-2 text-center text-sm font-medium">
              {entry.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ComparisonTable = () => {
  return (
    <div className="w-full max-w-3xl mx-auto mt-12 overflow-hidden rounded-lg border">
      <table className="w-full">
        <thead>
          <tr className="bg-muted">
            <th className="py-4 px-6 text-left font-medium">Feature</th>
            <th className="py-4 px-6 text-center font-medium">TuneMigrate</th>
            <th className="py-4 px-6 text-center font-medium">Competitors</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="py-4 px-6">AI-Powered Matching</td>
            <td className="py-4 px-6 text-center"><Check className="mx-auto text-green-500" /></td>
            <td className="py-4 px-6 text-center"><X className="mx-auto text-red-500" /></td>
          </tr>
          <tr className="border-t bg-muted/50">
            <td className="py-4 px-6">Match Confidence Indicators</td>
            <td className="py-4 px-6 text-center"><Check className="mx-auto text-green-500" /></td>
            <td className="py-4 px-6 text-center"><X className="mx-auto text-red-500" /></td>
          </tr>
          <tr className="border-t">
            <td className="py-4 px-6">Version Selection (Original vs. Remix)</td>
            <td className="py-4 px-6 text-center"><Check className="mx-auto text-green-500" /></td>
            <td className="py-4 px-6 text-center"><X className="mx-auto text-red-500" /></td>
          </tr>
          <tr className="border-t bg-muted/50">
            <td className="py-4 px-6">Smart Replacement Suggestions</td>
            <td className="py-4 px-6 text-center"><Check className="mx-auto text-green-500" /></td>
            <td className="py-4 px-6 text-center"><X className="mx-auto text-red-500" /></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const AccuracySection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight max-w-[800px] text-balance">
            Unmatched Conversion Accuracy
          </h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-[700px] text-balance">
            See how TuneMigrate compares to other conversion tools in matching accuracy.
          </p>
        </div>
        
        <ComparisonChart />
        <ComparisonTable />
        
        <div className="mt-12 text-center">
          <Link to="/migrate">
            <Button size="lg">
              Try TuneMigrate Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AccuracySection;
