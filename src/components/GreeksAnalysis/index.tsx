import { GreeksChart } from "./GreeksChart";
import { GreeksTable } from "./GreeksTable";

interface GreeksAnalysisSectionProps {
  title: string;
  data: any[];
  dataKeyCall: string;
  dataKeyPut: string;
  dataKeyNet: string;
  colorNet: string;
  icon: any;
  selectedDate: Date;
  interval?: number;
  baselineTime?: string;
}

export const GreeksAnalysisSection = ({
  title,
  data,
  dataKeyCall,
  dataKeyPut,
  dataKeyNet,
  colorNet,
  icon,
  selectedDate,
  interval,
  baselineTime,
}: GreeksAnalysisSectionProps) => {
  return (
    <div className="grid grid-cols-12 gap-6 h-full mb-10">
      <GreeksChart
        title={title}
        data={data}
        dataKeyCall={dataKeyCall}
        dataKeyPut={dataKeyPut}
        dataKeyNet={dataKeyNet}
        colorNet={colorNet}
        icon={icon}
        selectedDate={selectedDate}
        interval={interval}
        baselineTime={baselineTime}
      />
      <GreeksTable
        title={title}
        data={data}
        dataKeyCall={dataKeyCall}
        dataKeyPut={dataKeyPut}
        dataKeyNet={dataKeyNet}
        colorNet={colorNet}
      />
    </div>
  );
};
