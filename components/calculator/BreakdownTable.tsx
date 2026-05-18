import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BreakdownData } from "@/types/calculator";

interface BreakdownTableProps {
  data: BreakdownData;
}

export function BreakdownTable({ data }: BreakdownTableProps) {
  if (!data.rows.length) return null;
  return (
    <div className="w-full overflow-x-auto">
      <h3 className="text-sm font-semibold text-muted-foreground mb-3">YEAR-BY-YEAR BREAKDOWN</h3>
      <Table>
        <TableHeader>
          <TableRow>
            {data.headers.map((h, i) => (
              <TableHead key={i} className="whitespace-nowrap text-xs">{h}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.rows.map((row, i) => (
            <TableRow key={i}>
              {row.map((cell, j) => (
                <TableCell key={j} className="tabular-nums text-sm whitespace-nowrap">{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
